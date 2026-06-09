/**
 * Vision service — sends a product photo to OpenRouter's free Gemini Flash
 * vision model and returns structured product data matching the app's Product model.
 *
 * Uses the obfuscated API key from visionConfig.js — never exposed in source.
 */
import { getVisionApiKey, VISION_MODEL, OPENROUTER_URL } from './visionConfig';

// ── Prompt template ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a precise food product analyzer. Analyze the image of a food product and return ONLY a valid JSON object — no markdown, no code fences, no explanation.

Return this exact JSON structure:
{
  "name": "Product name",
  "brand": "Brand or manufacturer",
  "ingredients": "Full ingredients list as it appears on the package",
  "allergens": ["Allergen1", "Allergen2"],
  "nutritionalInfo": {
    "calories": 0,
    "fat": 0,
    "saturatedFat": 0,
    "carbohydrates": 0,
    "sugars": 0,
    "fiber": 0,
    "protein": 0,
    "salt": 0
  },
  "eCodes": [{"code": "E330", "name": "Citric Acid"}]
}

Rules:
- All nutritional values are per 100g. Use numbers, not strings.
- If a value is unknown, use null (not 0, not "N/A").
- Allergens should be common names: Milk, Gluten, Eggs, Nuts, Soy, Wheat, Fish, Shellfish, etc.
- E-codes should be extracted from the ingredients list if visible.
- Read the text on the package carefully. Do NOT guess or hallucinate.
- If you cannot determine the product, return: { "error": "Could not identify product" }`;

// ── Public API ──────────────────────────────────────────────────

/**
 * Analyze a product photo using OpenRouter's vision model.
 *
 * @param {string} base64Image — base64-encoded JPEG image (without data URI prefix)
 * @returns {Object|null} — Product object matching the app's model, or null on failure
 */
export const analyzeProductImage = async (base64Image) => {
  try {
    const apiKey = getVisionApiKey();

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://nutriscan.app',
        'X-Title': 'NutriScan',
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this food product image and return the structured JSON.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1024,
        temperature: 0.1, // Low temperature for consistent structured output
      }),
    });

    if (!response.ok) {
      console.warn(`Vision API HTTP ${response.status}`);
      return null;
    }

    const json = await response.json();

    // OpenRouter wraps OpenAI-compatible response
    const content = json?.choices?.[0]?.message?.content;
    if (!content) {
      console.warn('Vision API returned no content');
      return null;
    }

    // Parse the JSON from the model response
    const parsed = parseVisionResponse(content);
    if (!parsed || parsed.error) {
      console.warn('Vision model could not identify product:', parsed?.error);
      return null;
    }

    // Transform to our Product model
    return visionToProduct(parsed);
  } catch (error) {
    console.error('Vision analysis error:', error);
    return null;
  }
};

// ── Response parsing ─────────────────────────────────────────────

/**
 * Parse the model's JSON response, handling common quirks.
 * @param {string} content — raw model output
 * @returns {Object|null}
 */
function parseVisionResponse(content) {
  // Try direct JSON parse first
  try {
    return JSON.parse(content);
  } catch (_) {
    // Fall through to cleaning
  }

  // Strip markdown code fences if present
  const cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // Try extracting JSON object from the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {
        // Failed
      }
    }
  }

  console.warn('Failed to parse vision response:', content.substring(0, 200));
  return null;
}

// ── Vision response → Product model ──────────────────────────────

/**
 * Convert the vision model's JSON output into the app's Product model.
 * Mirrors the structure from productService.js's transformOffProduct.
 *
 * @param {Object} data — parsed vision model output
 * @returns {Object} — Product object
 */
function visionToProduct(data) {
  const ni = data.nutritionalInfo || {};

  return {
    id: `vision-${Date.now()}`,
    barcode: null, // No barcode from vision
    name: data.name || 'Unknown product',
    manufacturer: data.brand || 'Unknown',
    ingredients: data.ingredients || '',
    allergens: (data.allergens || []).map(a =>
      a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()
    ),
    eCodes: (data.eCodes || []).map(ec => ({
      code: ec.code?.toUpperCase() || '',
      name: ec.name || ec.code || '',
      warning: false, // Vision model doesn't classify warnings
    })),
    nutritionalInfo: {
      calories: num(ni.calories),
      fat: num(ni.fat),
      saturatedFat: num(ni.saturatedFat),
      carbohydrates: num(ni.carbohydrates),
      sugars: num(ni.sugars),
      fiber: num(ni.fiber),
      protein: num(ni.protein),
      salt: num(ni.salt),
      novaGroup: null,
      nutriscoreGrade: null,
    },
    scannedTime: new Date().toISOString(),
    source: 'vision',
  };
}

/** Safe number conversion — returns 0 for null/undefined */
function num(val) {
  if (val === null || val === undefined) return 0;
  const n = Number(val);
  return Number.isNaN(n) ? 0 : Math.round(n * 10) / 10;
}
