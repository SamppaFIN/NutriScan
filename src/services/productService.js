/**
 * Product service — fetches product data from Open Food Facts API
 * with local cache fallback for offline use.
 *
 * Open Food Facts is a free, open-source food product database
 * with over 4M products from 150 countries. No API key required.
 *
 * API docs: https://world.openfoodfacts.org/api
 */
import { getCachedProduct, cacheProduct } from '../utils/storageUtils';
import { extractAllergensFromText } from '../utils/allergenUtils';

// ── API configuration ──────────────────────────────────────────
const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2/product';
const CACHE_VERSION = 2; // bump to invalidate stale caches from older transform logic

// ── Public API ──────────────────────────────────────────────────

/**
 * Get product information for a barcode.
 * Checks local cache first, then Open Food Facts API.
 *
 * @param {string} barcode — EAN-8 or EAN-13 barcode
 * @returns {Object|null}  — Product object, or null if not found
 */
export const getProductInfo = async (barcode) => {
  try {
    // 1. Try local cache (skip if from older transform version)
    const cached = await getCachedProduct(barcode);
    if (cached && cached._cacheVersion === CACHE_VERSION) {
      return cached;
    }

    // 2. Fetch from Open Food Facts
    const response = await fetch(`${OFF_API_BASE}/${barcode}.json`);
    if (!response.ok) {
      console.warn(`OFF API HTTP ${response.status} for barcode ${barcode}`);
      return null;
    }

    const json = await response.json();

    // OFF returns status: 0 when product is not found
    if (!json || json.status === 0 || !json.product) {
      return null;
    }

    // 3. Transform OFF data to our Product model
    const product = transformOffProduct(barcode, json.product);

    // Debug: log what OFF returned vs what we extracted
    if (__DEV__) {
      const off = json.product;
      console.log('[OFF debug]', {
        barcode,
        hasAllergensTags: (off.allergens_tags || []).length,
        hasAllergensHierarchy: (off.allergens_hierarchy || []).length,
        hasAllergensFromIngredients: !!off.allergens_from_ingredients,
        hasAllergensString: !!off.allergens,
        hasIngredientsText: !!(off.ingredients_text_fi || off.ingredients_text_en || off.ingredients_text),
        extractedAllergens: product.allergens.length,
        nutrimentsKeyCount: Object.keys(off.nutriments || {}).length,
        nutritionZero: Object.values(product.nutritionalInfo).filter(v => typeof v === 'number' && v === 0).length,
      });
    }

    // 4. Cache for offline use
    await cacheProduct(barcode, product);

    return product;
  } catch (error) {
    console.error('Error fetching product info:', error);
    return null;
  }
};

// ── OFF → Product transformation ────────────────────────────────

/**
 * Transform Open Food Facts API response into the app's Product model.
 *
 * OFF field              → Product field
 * ─────────────────────────────────────────
 * product_name_fi / en   → name
 * brands                 → manufacturer
 * ingredients_text_fi/en → ingredients
 * allergens_tags         → allergens[]
 * nutriments             → nutritionalInfo
 * additives_tags         → eCodes[]
 */
function transformOffProduct(barcode, off) {
  // ── Name ──────────────────────────────────────────────────
  const name = off.product_name_fi
    || off.product_name_en
    || off.product_name
    || 'Unknown product';

  // ── Manufacturer ───────────────────────────────────────────
  const manufacturer = off.brands
    || off.brands_tags?.[0]?.replace(/^en:/, '')
    || 'Unknown';

  // ── Ingredients ────────────────────────────────────────────
  const ingredients = off.ingredients_text_fi
    || off.ingredients_text_en
    || off.ingredients_text
    || '';

  // ── Allergens ──────────────────────────────────────────────
  // Collect from multiple OFF sources, best first, fallbacks after.
  const allergenSources = [];

  // 1. allergens_tags (primary OFF field, e.g. "en:gluten")
  if (off.allergens_tags?.length) {
    const fromTags = off.allergens_tags
      .map(tag => tag.replace(/^[a-z]{2}:/, ''))
      .map(name => name.charAt(0).toUpperCase() + name.slice(1))
      .filter(Boolean);
    allergenSources.push(fromTags);
  }

  // 2. allergens_hierarchy (alternative OFF field)
  if (off.allergens_hierarchy?.length) {
    const fromHierarchy = off.allergens_hierarchy
      .map(tag => {
        // format: "en:gluten" or just "gluten"
        const cleaned = tag.replace(/^[a-z]{2}:/, '');
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      })
      .filter(Boolean);
    allergenSources.push(fromHierarchy);
  }

  // 3. allergens_from_ingredients (OFF auto-detected)
  if (off.allergens_from_ingredients?.length) {
    const fromIngredients = off.allergens_from_ingredients
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    allergenSources.push(fromIngredients);
  }

  // 4. allergens plain string
  if (off.allergens) {
    const fromString = off.allergens
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    allergenSources.push(fromString);
  }

  // 5. Extract from ingredients text (Finnish + English)
  const ingredientsForAllergens = off.ingredients_text_fi
    || off.ingredients_text_en
    || off.ingredients_text
    || '';
  if (ingredientsForAllergens) {
    const fromText = extractAllergensFromText(ingredientsForAllergens);
    if (fromText.length) {
      allergenSources.push(fromText);
    }
  }

  // Merge all sources, deduplicate (case-insensitive)
  const seen = new Set();
  const allergens = [];
  for (const source of allergenSources) {
    for (const item of source) {
      const key = item.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        allergens.push(item.charAt(0).toUpperCase() + item.slice(1));
      }
    }
  }

  // ── E-codes (additives) ────────────────────────────────────
  const eCodes = (off.additives_tags || []).map(tag => {
    // OFF format: "en:e330" → code "E330"
    const code = tag.replace(/^[a-z]{2}:/, '').toUpperCase();
    return {
      code,
      name: additivename(code),
      warning: isWarningAdditive(code),
    };
  });

  // ── Nutritional info ───────────────────────────────────────
  const n = off.nutriments || {};
  const nutritionalInfo = {
    calories:       round(n['energy-kcal_100g'] ?? n['energy-kcal'] ?? n.energy_kcal_100g ?? n['energy-kcal_value'] ?? n.energy_100g),
    fat:            round(n.fat_100g ?? n.fat_value ?? n.fat),
    saturatedFat:   round(n['saturated-fat_100g'] ?? n['saturated-fat_value'] ?? n.saturated_fat_100g ?? n.saturated_fat),
    carbohydrates:  round(n.carbohydrates_100g ?? n['carbohydrates_value'] ?? n.carbohydrates),
    sugars:         round(n.sugars_100g ?? n['sugars_value'] ?? n.sugars),
    fiber:          round(n.fiber_100g ?? n['fiber_value'] ?? n.fiber),
    protein:        round(n.proteins_100g ?? n['proteins_value'] ?? n.proteins),
    salt:           round(n.salt_100g ?? n['salt_value'] ?? n.salt),
    // Extra fields for richer display
    novaGroup:      off.nova_group ?? null,
    nutriscoreGrade: off.nutriscore_grade ?? null,
  };

  return {
    id: `product-${barcode}`,
    barcode,
    name,
    manufacturer,
    ingredients,
    allergens,
    eCodes,
    nutritionalInfo,
    scannedTime: new Date().toISOString(),
    _cacheVersion: CACHE_VERSION,
  };
}

// ── Helpers ─────────────────────────────────────────────────────

/** Round a number to 1 decimal place, or return 0 if NaN/undefined */
function round(val) {
  if (val === undefined || val === null) return 0;
  const n = Number(val);
  return Number.isNaN(n) ? 0 : Math.round(n * 10) / 10;
}

/** Known additive names (subset — extended as needed) */
function additivename(code) {
  const map = {
    E100: 'Curcumin', E101: 'Riboflavin', E102: 'Tartrazine',
    E110: 'Sunset Yellow', E120: 'Cochineal', E122: 'Azorubine',
    E124: 'Ponceau 4R', E129: 'Allura Red', E133: 'Brilliant Blue',
    E150a: 'Plain Caramel', E150c: 'Ammonia Caramel', E150d: 'Sulphite Ammonia Caramel',
    E160a: 'Carotenes', E160c: 'Paprika Extract', E162: 'Beetroot Red',
    E171: 'Titanium Dioxide', E200: 'Sorbic Acid', E202: 'Potassium Sorbate',
    E210: 'Benzoic Acid', E211: 'Sodium Benzoate', E220: 'Sulphur Dioxide',
    E250: 'Sodium Nitrite', E260: 'Acetic Acid', E270: 'Lactic Acid',
    E290: 'Carbon Dioxide', E296: 'Malic Acid', E300: 'Ascorbic Acid',
    E306: 'Tocopherols', E322: 'Lecithins', E325: 'Sodium Lactate',
    E330: 'Citric Acid', E331: 'Sodium Citrates', E334: 'Tartaric Acid',
    E339: 'Sodium Phosphates', E340: 'Potassium Phosphates',
    E400: 'Alginic Acid', E401: 'Sodium Alginate', E406: 'Agar',
    E407: 'Carrageenan', E410: 'Locust Bean Gum', E412: 'Guar Gum',
    E414: 'Gum Arabic', E415: 'Xanthan Gum', E422: 'Glycerol',
    E440: 'Pectins', E450: 'Diphosphates', E451: 'Triphosphates',
    E452: 'Polyphosphates', E460: 'Cellulose', E466: 'CMC',
    E471: 'Mono-/Diglycerides', E472e: 'DATEM', E476: 'Polyglycerol Polyricinoleate',
    E500: 'Sodium Carbonates', E503: 'Ammonium Carbonates',
    E509: 'Calcium Chloride', E551: 'Silicon Dioxide',
    E621: 'MSG', E627: 'Disodium Guanylate', E631: 'Disodium Inosinate',
    E901: 'Beeswax', E903: 'Carnauba Wax', E920: 'L-Cysteine',
    E950: 'Acesulfame K', E951: 'Aspartame', E952: 'Cyclamates',
    E953: 'Isomalt', E954: 'Saccharin', E955: 'Sucralose',
    E965: 'Maltitol', E967: 'Xylitol', E968: 'Erythritol',
  };
  return map[code] || code;
}

/** Additives with known health concerns */
function isWarningAdditive(code) {
  const warnings = new Set([
    'E102', 'E104', 'E110', 'E122', 'E124', 'E129', 'E131', 'E132',
    'E133', 'E142', 'E151', 'E171', 'E210', 'E211', 'E212', 'E213',
    'E220', 'E221', 'E222', 'E223', 'E224', 'E250', 'E251', 'E252',
    'E951', 'E954',
  ]);
  return warnings.has(code);
}
