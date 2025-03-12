import { COMMON_ALLERGENS } from './constants';

/**
 * Check a product for allergens based on user's allergies
 * @param {Object} product - The product to check
 * @param {Array} userAllergies - List of user's allergies
 * @returns {Array} List of identified allergens in the product
 */
export const checkAllergens = (product, userAllergies) => {
  if (!product || !userAllergies || !Array.isArray(userAllergies) || userAllergies.length === 0) {
    return [];
  }

  const allergenWarnings = [];
  const ingredients = product.ingredients || '';
  const ingredientsLower = ingredients.toLowerCase();

  // Check each allergen the user has specified
  userAllergies.forEach(allergen => {
    const allergenLower = allergen.toLowerCase();
    
    // Check if the allergen is directly mentioned in the ingredients
    if (ingredientsLower.includes(allergenLower)) {
      allergenWarnings.push(allergen);
      return;
    }
    
    // Check for related terms for common allergens
    const relatedTerms = getAllergenRelatedTerms(allergenLower);
    for (const term of relatedTerms) {
      if (ingredientsLower.includes(term)) {
        allergenWarnings.push(allergen);
        return;
      }
    }
  });

  // Check E-codes for allergens
  if (product.eCodes && Array.isArray(product.eCodes)) {
    product.eCodes.forEach(eCode => {
      if (eCode.warning) {
        // Check if this E-code is associated with an allergen the user cares about
        const associatedAllergen = findAllergenForECode(eCode.code, userAllergies);
        if (associatedAllergen && !allergenWarnings.includes(associatedAllergen)) {
          allergenWarnings.push(associatedAllergen);
        }
      }
    });
  }

  return allergenWarnings;
};

/**
 * Get alternative terms related to an allergen
 * @param {string} allergen - The allergen to find related terms for
 * @returns {Array} List of related terms
 */
const getAllergenRelatedTerms = (allergen) => {
  // Map of allergens to their related terms
  const allergenTerms = {
    'milk': ['dairy', 'lactose', 'whey', 'casein', 'butter', 'cream', 'cheese', 'yogurt'],
    'egg': ['albumin', 'ovalbumin', 'globulin', 'ovomucin', 'vitellin', 'livetin'],
    'peanut': ['arachis', 'goober', 'groundnut'],
    'treenuts': ['almond', 'hazelnut', 'walnut', 'cashew', 'pecan', 'pistachio', 'macadamia'],
    'fish': ['cod', 'salmon', 'tuna', 'halibut', 'anchovy', 'bass', 'flounder', 'sole'],
    'shellfish': ['crab', 'lobster', 'shrimp', 'prawn', 'crayfish', 'squid', 'clam', 'mussel', 'oyster'],
    'soy': ['soya', 'soybean', 'edamame', 'tofu', 'miso', 'tempeh'],
    'wheat': ['flour', 'bread', 'bran', 'bulgur', 'durum', 'semolina', 'spelt', 'farina'],
    'gluten': ['wheat', 'barley', 'rye', 'oats', 'triticale', 'kamut', 'spelt'],
    'sulfites': ['sulphites', 'sulfiting', 'sulphiting', 'e220', 'e221', 'e222', 'e223', 'e224', 'e225', 'e226', 'e227', 'e228'],
    'lactose': ['milk', 'dairy', 'whey', 'lactose'],
    'mustard': ['mustard seeds', 'mustard powder'],
    'celery': ['celeriac', 'celery seeds', 'celery salt'],
    'lupin': ['lupine', 'lupin flour', 'lupin beans'],
    'sesame': ['sesame seeds', 'sesame oil', 'tahini'],
    'nuts': ['almond', 'hazelnut', 'walnut', 'cashew', 'pecan', 'brazil', 'pistachio', 'macadamia', 'pine nut'],
  };
  
  // Normalize the allergen name
  let normalizedAllergen = allergen.toLowerCase().trim();
  
  // Check if the allergen is a key in our map
  if (allergenTerms[normalizedAllergen]) {
    return allergenTerms[normalizedAllergen];
  }
  
  // Check if the allergen is one of the values in our map
  for (const [key, terms] of Object.entries(allergenTerms)) {
    if (terms.includes(normalizedAllergen)) {
      return [...terms.filter(term => term !== normalizedAllergen), key];
    }
  }
  
  // If no related terms are found, return an empty array
  return [];
};

/**
 * Find which allergen (if any) an E-code is associated with
 * @param {string} eCode - The E-code to check
 * @param {Array} userAllergies - List of user's allergies
 * @returns {string|null} The associated allergen or null
 */
const findAllergenForECode = (eCode, userAllergies) => {
  // Map of E-codes to potential allergens
  const eCodeAllergenMap = {
    // Sulfites
    'E220': 'Sulfites',
    'E221': 'Sulfites',
    'E222': 'Sulfites',
    'E223': 'Sulfites',
    'E224': 'Sulfites',
    'E225': 'Sulfites',
    'E226': 'Sulfites',
    'E227': 'Sulfites',
    'E228': 'Sulfites',
    
    // Milk-related
    'E270': 'Lactose', // Sometimes derived from milk
    'E325': 'Lactose',
    'E326': 'Lactose',
    'E327': 'Lactose',
    'E966': 'Lactose',
    
    // Gluten-related
    'E1404': 'Gluten',
    'E1410': 'Gluten',
    'E1412': 'Gluten',
    'E1413': 'Gluten',
    'E1414': 'Gluten',
    'E1420': 'Gluten',
    'E1422': 'Gluten',
    'E1440': 'Gluten',
    'E1442': 'Gluten',
    'E1450': 'Gluten',
    
    // Soy-related
    'E322': 'Soy', // Can be derived from soy
    
    // Fish-related
    'E626': 'Fish',
    'E627': 'Fish',
    'E631': 'Fish',
    'E635': 'Fish'
  };
  
  // Check if the E-code is associated with any allergen
  const associatedAllergen = eCodeAllergenMap[eCode];
  
  if (associatedAllergen) {
    // Check if the user is allergic to this allergen
    const normalizedUserAllergies = userAllergies.map(a => a.toLowerCase());
    
    if (normalizedUserAllergies.includes(associatedAllergen.toLowerCase())) {
      return associatedAllergen;
    }
    
    // Also check related terms
    for (const userAllergen of normalizedUserAllergies) {
      const relatedTerms = getAllergenRelatedTerms(userAllergen);
      if (relatedTerms.includes(associatedAllergen.toLowerCase())) {
        return userAllergen;
      }
    }
  }
  
  return null;
};

/**
 * Check if a specific E-code is considered problematic
 * @param {string} eCode - The E-code to check
 * @returns {boolean} Whether the E-code is problematic
 */
export const isProblematicECode = (eCode) => {
  const problematicECodes = [
    'E102', 'E104', 'E110', 'E122', 'E124', 'E129', // Colors linked to hyperactivity
    'E171', 'E172', 'E173', 'E174', 'E175', // Metal-based colorings
    'E210', 'E211', 'E212', 'E213', 'E214', 'E215', 'E219', // Benzoates
    'E220', 'E221', 'E222', 'E223', 'E224', 'E228', // Sulfites
    'E249', 'E250', 'E251', 'E252', // Nitrates and nitrites
    'E310', 'E311', 'E312', 'E320', 'E321', // Gallates and BHA/BHT
    'E407', // Carrageenan
    'E621', 'E622', 'E623', // MSG and glutamates
    'E950', 'E951', 'E952', 'E954', 'E955', 'E962' // Artificial sweeteners
  ];
  
  return problematicECodes.includes(eCode.toUpperCase());
};

/**
 * Get a description of why an E-code might be problematic
 * @param {string} eCode - The E-code to check
 * @returns {string} Description of why the E-code is problematic
 */
export const getECodeWarning = (eCode) => {
  const eCodeWarnings = {
    'E102': 'May cause allergic reactions and hyperactivity in some people',
    'E104': 'May cause allergic reactions and hyperactivity in some people',
    'E110': 'May cause allergic reactions and hyperactivity in some people',
    'E122': 'May cause allergic reactions and hyperactivity in some people',
    'E124': 'May cause allergic reactions and hyperactivity in some people',
    'E129': 'May cause allergic reactions and hyperactivity in some people',
    'E171': 'Titanium dioxide - potentially carcinogenic',
    'E172': 'Iron oxides - may accumulate in the body',
    'E173': 'Aluminum - may accumulate in the body',
    'E174': 'Silver - may accumulate in the body',
    'E175': 'Gold - may cause allergic reactions',
    'E210': 'Benzoic acid - may cause allergic reactions and hyperactivity',
    'E211': 'Sodium benzoate - may cause allergic reactions and hyperactivity',
    'E220': 'Sulfur dioxide - may trigger asthma attacks in sensitive individuals',
    'E249': 'Potassium nitrite - can form nitrosamines, which are carcinogenic',
    'E250': 'Sodium nitrite - can form nitrosamines, which are carcinogenic',
    'E251': 'Sodium nitrate - can form nitrosamines, which are carcinogenic',
    'E252': 'Potassium nitrate - can form nitrosamines, which are carcinogenic',
    'E320': 'BHA - potentially carcinogenic and may cause allergic reactions',
    'E321': 'BHT - potentially carcinogenic and may cause allergic reactions',
    'E407': 'Carrageenan - may cause digestive issues',
    'E621': 'Monosodium glutamate (MSG) - may cause headaches and other reactions',
    'E951': 'Aspartame - may cause headaches and other neurological issues',
    'E954': 'Saccharin - potentially carcinogenic'
  };
  
  return eCodeWarnings[eCode.toUpperCase()] || 'May cause adverse reactions in some individuals';
};
