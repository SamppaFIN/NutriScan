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

// ── API configuration ──────────────────────────────────────────
const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2/product';

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
    // 1. Try local cache
    const cached = await getCachedProduct(barcode);
    if (cached) {
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
  // OFF stores allergens as tags like "en:gluten" — clean them up
  const allergens = (off.allergens_tags || [])
    .map(tag => tag.replace(/^[a-z]{2}:/, ''))           // strip language prefix
    .map(name => name.charAt(0).toUpperCase() + name.slice(1)) // capitalise
    .filter(Boolean);

  // Also try the plain allergens string as a fallback
  if (allergens.length === 0 && off.allergens) {
    const fromString = off.allergens
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    allergens.push(...fromString);
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
    calories:       round(n['energy-kcal_100g'] ?? n['energy-kcal'] ?? n.energy_kcal_100g),
    fat:            round(n.fat_100g),
    saturatedFat:   round(n['saturated-fat_100g']),
    carbohydrates:  round(n.carbohydrates_100g),
    sugars:         round(n.sugars_100g),
    fiber:          round(n.fiber_100g),
    protein:        round(n.proteins_100g),
    salt:           round(n.salt_100g),
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
