/**
 * Comprehensive database of E-codes (food additives),
 * their functions, origins, and potential allergen information
 */

const eCodeDatabase = {
  // Colors (E100-E199)
  "E100": {
    name: "Curcumin",
    category: "Color",
    origin: "Natural - derived from turmeric",
    function: "Yellow food coloring",
    potentialIssues: ["May cause allergic reactions in those with turmeric allergy"],
    commonIn: ["Curry powders", "Mustard", "Yellow candy", "Margarine"]
  },
  "E101": {
    name: "Riboflavin (Vitamin B2)",
    category: "Color",
    origin: "Natural or synthetic",
    function: "Yellow-orange food coloring",
    potentialIssues: ["Generally recognized as safe"],
    commonIn: ["Breakfast cereals", "Dairy products", "Infant formula"]
  },
  "E102": {
    name: "Tartrazine",
    category: "Color",
    origin: "Synthetic",
    function: "Yellow food coloring",
    potentialIssues: ["Associated with hyperactivity in children", "May cause allergic reactions, especially in those with aspirin sensitivity"],
    commonIn: ["Soft drinks", "Candy", "Ice cream", "Jams"]
  },
  "E104": {
    name: "Quinoline Yellow",
    category: "Color",
    origin: "Synthetic",
    function: "Yellow food coloring",
    potentialIssues: ["May cause hypersensitivity reactions", "Associated with hyperactivity in children"],
    commonIn: ["Soft drinks", "Candy", "Ice cream", "Desserts"]
  },
  "E110": {
    name: "Sunset Yellow FCF",
    category: "Color",
    origin: "Synthetic",
    function: "Orange-yellow food coloring",
    potentialIssues: ["May cause allergic reactions", "Associated with hyperactivity in children"],
    commonIn: ["Orange sodas", "Sweets", "Dessert mixes", "Snacks"]
  },
  "E120": {
    name: "Cochineal (Carminic Acid)",
    category: "Color",
    origin: "Natural - derived from insects",
    function: "Red food coloring",
    potentialIssues: ["May cause severe allergic reactions", "Not suitable for vegetarians/vegans"],
    commonIn: ["Red candy", "Yogurt", "Ice cream", "Alcoholic beverages"]
  },
  "E122": {
    name: "Azorubine (Carmoisine)",
    category: "Color",
    origin: "Synthetic",
    function: "Red food coloring",
    potentialIssues: ["May cause allergic reactions", "Associated with hyperactivity in children"],
    commonIn: ["Jams", "Sweets", "Desserts", "Soft drinks"]
  },
  "E127": {
    name: "Erythrosine",
    category: "Color",
    origin: "Synthetic",
    function: "Cherry-pink food coloring",
    potentialIssues: ["May affect thyroid function", "May cause photosensitivity", "Associated with hyperactivity"],
    commonIn: ["Candied cherries", "Cake mixes", "Seafood", "Popsicles"]
  },
  "E129": {
    name: "Allura Red AC",
    category: "Color",
    origin: "Synthetic",
    function: "Red food coloring",
    potentialIssues: ["May cause allergic reactions", "Associated with hyperactivity in children"],
    commonIn: ["Soft drinks", "Candy", "Desserts", "Processed meats"]
  },
  "E131": {
    name: "Patent Blue V",
    category: "Color",
    origin: "Synthetic",
    function: "Blue food coloring",
    potentialIssues: ["May cause allergic reactions including anaphylaxis", "May cause vomiting, nausea, high blood pressure"],
    commonIn: ["Ice cream", "Sweets", "Soft drinks"]
  },
  "E132": {
    name: "Indigotine (Indigo Carmine)",
    category: "Color",
    origin: "Synthetic",
    function: "Blue food coloring",
    potentialIssues: ["May cause allergic reactions", "May cause nausea, vomiting, high blood pressure"],
    commonIn: ["Candy", "Ice cream", "Canned peas", "Desserts"]
  },
  "E133": {
    name: "Brilliant Blue FCF",
    category: "Color",
    origin: "Synthetic",
    function: "Blue food coloring",
    potentialIssues: ["May cause allergic reactions", "Possible hyperactivity in children"],
    commonIn: ["Drinks", "Desserts", "Sweets", "Cereals"]
  },
  "E150a-d": {
    name: "Caramel (various types)",
    category: "Color",
    origin: "Produced by heating sugar",
    function: "Brown food coloring",
    potentialIssues: ["E150c and E150d may cause digestive problems"],
    commonIn: ["Cola drinks", "Soy sauce", "Bread", "Beer", "Desserts"]
  },
  "E160a": {
    name: "Alpha-carotene, Beta-carotene",
    category: "Color",
    origin: "Natural - from plants or synthetic",
    function: "Orange food coloring",
    potentialIssues: ["Generally recognized as safe", "May cause yellowing of skin in high doses"],
    commonIn: ["Margarine", "Butter", "Cheeses", "Desserts"]
  },
  "E171": {
    name: "Titanium Dioxide",
    category: "Color",
    origin: "Mineral",
    function: "White food coloring",
    potentialIssues: ["Possible inflammatory effects", "May accumulate in body tissues", "Being phased out in EU"],
    commonIn: ["Chewing gum", "Cake icings", "Candy coatings", "Dairy products"]
  },
  "E172": {
    name: "Iron Oxides",
    category: "Color",
    origin: "Mineral",
    function: "Red, yellow, black food coloring",
    potentialIssues: ["Generally recognized as safe"],
    commonIn: ["Candy", "Processed meats", "Desserts"]
  },
  
  // Preservatives (E200-E299)
  "E200": {
    name: "Sorbic Acid",
    category: "Preservative",
    origin: "Natural or synthetic",
    function: "Prevents mold and yeast growth",
    potentialIssues: ["May cause contact dermatitis in sensitive individuals"],
    commonIn: ["Cheese", "Yogurt", "Wine", "Baked goods"]
  },
  "E202": {
    name: "Potassium Sorbate",
    category: "Preservative",
    origin: "Synthetic",
    function: "Prevents mold and yeast growth",
    potentialIssues: ["May cause irritation of skin, eyes and respiratory tract in sensitive individuals"],
    commonIn: ["Wine", "Cheese", "Juices", "Dried fruits"]
  },
  "E210": {
    name: "Benzoic Acid",
    category: "Preservative",
    origin: "Natural or synthetic",
    function: "Prevents bacterial growth",
    potentialIssues: ["May trigger allergic reactions", "May cause hyperactivity", "May trigger asthma"],
    commonIn: ["Soft drinks", "Fruit juices", "Pickles", "Jams"]
  },
  "E211": {
    name: "Sodium Benzoate",
    category: "Preservative",
    origin: "Synthetic",
    function: "Prevents bacterial and fungal growth",
    potentialIssues: ["May trigger allergic reactions", "May cause hyperactivity", "May worsen asthma symptoms"],
    commonIn: ["Acidic foods", "Soft drinks", "Salad dressings", "Jams"]
  },
  "E220": {
    name: "Sulfur Dioxide",
    category: "Preservative",
    origin: "Chemical compound",
    function: "Prevents bacterial growth and browning",
    potentialIssues: ["May trigger asthma attacks", "Known to cause allergic reactions", "Not suitable for people with sulfite sensitivity"],
    commonIn: ["Wine", "Dried fruits", "Vinegar", "Potato products"]
  },
  "E221-E228": {
    name: "Sulfites (various)",
    category: "Preservative",
    origin: "Chemical compounds",
    function: "Prevent bacterial growth and browning",
    potentialIssues: ["May trigger severe reactions in sensitive individuals", "May cause breathing difficulties", "May trigger asthma attacks"],
    commonIn: ["Wine", "Dried fruits", "Processed vegetables", "Baked goods"]
  },
  "E249": {
    name: "Potassium Nitrite",
    category: "Preservative",
    origin: "Synthetic",
    function: "Preserves meat color and prevents bacterial growth",
    potentialIssues: ["May form carcinogenic nitrosamines", "May cause allergic reactions"],
    commonIn: ["Processed meats", "Bacon", "Ham", "Sausages"]
  },
  "E250": {
    name: "Sodium Nitrite",
    category: "Preservative",
    origin: "Synthetic",
    function: "Preserves meat color and prevents bacterial growth",
    potentialIssues: ["May form carcinogenic nitrosamines", "May cause allergic reactions"],
    commonIn: ["Cured meats", "Bacon", "Sausages", "Corned beef"]
  },
  "E251": {
    name: "Sodium Nitrate",
    category: "Preservative",
    origin: "Natural or synthetic",
    function: "Preserves meat and prevents bacterial growth",
    potentialIssues: ["May form carcinogenic nitrosamines", "May cause allergic reactions"],
    commonIn: ["Cured meats", "Bacon", "Ham", "Sausages"]
  },
  
  // Antioxidants, Acidity Regulators (E300-E399)
  "E300": {
    name: "Ascorbic Acid (Vitamin C)",
    category: "Antioxidant",
    origin: "Natural or synthetic",
    function: "Prevents oxidation and browning",
    potentialIssues: ["Generally recognized as safe"],
    commonIn: ["Fruit juices", "Jams", "Frozen fruits", "Bread"]
  },
  "E306": {
    name: "Tocopherol (Vitamin E)",
    category: "Antioxidant",
    origin: "Natural or synthetic",
    function: "Prevents rancidity in fatty foods",
    potentialIssues: ["Generally recognized as safe"],
    commonIn: ["Vegetable oils", "Margarine", "Cereal", "Baked goods"]
  },
  "E310": {
    name: "Propyl Gallate",
    category: "Antioxidant",
    origin: "Synthetic",
    function: "Prevents rancidity in fats and oils",
    potentialIssues: ["May cause allergic reactions", "Potential estrogenic effects"],
    commonIn: ["Vegetable oils", "Meat products", "Chewing gum", "Soup mixes"]
  },
  "E320": {
    name: "Butylated Hydroxyanisole (BHA)",
    category: "Antioxidant",
    origin: "Synthetic",
    function: "Prevents rancidity in fats and oils",
    potentialIssues: ["Possible carcinogen", "May cause allergic reactions"],
    commonIn: ["Potato chips", "Cereal", "Chewing gum", "Baked goods"]
  },
  "E321": {
    name: "Butylated Hydroxytoluene (BHT)",
    category: "Antioxidant",
    origin: "Synthetic",
    function: "Prevents rancidity in fats and oils",
    potentialIssues: ["May cause allergic reactions", "Potential endocrine disruptor"],
    commonIn: ["Potato chips", "Cereal", "Vegetable oils", "Chewing gum"]
  },
  "E330": {
    name: "Citric Acid",
    category: "Acidity Regulator",
    origin: "Natural or synthetic",
    function: "Provides tartness and acts as a preservative",
    potentialIssues: ["May cause mouth irritation in sensitive individuals"],
    commonIn: ["Soft drinks", "Candy", "Fruit juices", "Jams"]
  },
  "E339": {
    name: "Sodium Phosphates",
    category: "Acidity Regulator",
    origin: "Synthetic",
    function: "Controls acidity and acts as emulsifier",
    potentialIssues: ["May affect calcium absorption", "May worsen kidney problems"],
    commonIn: ["Processed cheese", "Meat products", "Canned soups"]
  },
  
  // Emulsifiers, Stabilizers (E400-E499)
  "E407": {
    name: "Carrageenan",
    category: "Stabilizer",
    origin: "Natural - derived from seaweed",
    function: "Thickening and stabilizing agent",
    potentialIssues: ["May cause digestive issues", "Associated with inflammation in some studies"],
    commonIn: ["Ice cream", "Yogurt", "Almond milk", "Processed meats"]
  },
  "E413": {
    name: "Tragacanth",
    category: "Emulsifier/Stabilizer",
    origin: "Natural - plant gum",
    function: "Thickener and stabilizer",
    potentialIssues: ["May cause allergic reactions", "May cause asthmatic reactions"],
    commonIn: ["Salad dressings", "Sauces", "Ice cream", "Candy"]
  },
  "E414": {
    name: "Acacia Gum (Gum Arabic)",
    category: "Emulsifier",
    origin: "Natural - plant gum",
    function: "Stabilizer and thickener",
    potentialIssues: ["May cause allergic reactions in some people", "Can cause digestive issues in large amounts"],
    commonIn: ["Soft drinks", "Candy", "Chewing gum", "Desserts"]
  },
  "E420": {
    name: "Sorbitol",
    category: "Sweetener/Stabilizer",
    origin: "Natural or synthetic",
    function: "Sweetener, humectant, stabilizer",
    potentialIssues: ["Can cause digestive issues in large amounts", "May cause diarrhea"],
    commonIn: ["Sugar-free gum", "Diabetic foods", "Mints", "Cough syrups"]
  },
  "E421": {
    name: "Mannitol",
    category: "Sweetener/Stabilizer",
    origin: "Natural or synthetic",
    function: "Sweetener, anti-caking agent",
    potentialIssues: ["Can cause digestive issues in large amounts", "May cause diarrhea"],
    commonIn: ["Chewing gum", "Diabetic foods", "Low-calorie products"]
  },
  "E422": {
    name: "Glycerol",
    category: "Humectant",
    origin: "Natural or synthetic",
    function: "Maintains moisture, sweetener",
    potentialIssues: ["Generally recognized as safe", "May cause headaches in some individuals"],
    commonIn: ["Baked goods", "Candy", "Dairy products", "Meat products"]
  },
  "E430-E436": {
    name: "Polysorbates",
    category: "Emulsifier",
    origin: "Synthetic",
    function: "Emulsification of oils in water",
    potentialIssues: ["May cause allergic reactions", "May disrupt gut bacterial balance"],
    commonIn: ["Ice cream", "Baked goods", "Pickles", "Fat emulsions"]
  },
  
  // Flavor Enhancers (E600-E699)
  "E621": {
    name: "Monosodium Glutamate (MSG)",
    category: "Flavor Enhancer",
    origin: "Derived from glutamic acid",
    function: "Enhances savory flavors",
    potentialIssues: ["May cause MSG symptom complex in sensitive individuals", "Reported reactions include headache, flushing, sweating"],
    commonIn: ["Soups", "Processed meats", "Savory snacks", "Restaurant food"]
  },
  
  // Sweeteners (E900-E999)
  "E951": {
    name: "Aspartame",
    category: "Sweetener",
    origin: "Synthetic",
    function: "Artificial sweetener",
    potentialIssues: ["Not suitable for people with phenylketonuria (PKU)", "Reported symptoms include headaches, dizziness in sensitive individuals"],
    commonIn: ["Diet sodas", "Sugar-free products", "Chewing gum", "Dessert mixes"]
  }
};

/**
 * Get E-code information
 * @param {string} eCode - The E-number to check (with or without 'E' prefix)
 * @returns {Object|null} - E-code information or null if not found
 */
function getECodeInfo(eCode) {
  // Normalize E-code format
  let normalizedCode = eCode.toUpperCase().trim();
  if (!normalizedCode.startsWith('E')) {
    normalizedCode = 'E' + normalizedCode;
  }
  
  // Check exact matches
  if (eCodeDatabase[normalizedCode]) {
    return eCodeDatabase[normalizedCode];
  }
  
  // Check ranges (like E430-E436)
  for (const code in eCodeDatabase) {
    if (code.includes('-')) {
      const [start, end] = code.split('-');
      const startNum = parseInt(start.substring(1));
      const endNum = parseInt(end.substring(1));
      const codeNum = parseInt(normalizedCode.substring(1));
      
      if (codeNum >= startNum && codeNum <= endNum) {
        return eCodeDatabase[code];
      }
    }
  }
  
  return null;
}

/**
 * Extract E-codes from ingredient list
 * @param {string} ingredientsText - Comma separated list of ingredients
 * @returns {Array} - List of found E-codes with details
 */
function extractECodesFromText(ingredientsText) {
  if (!ingredientsText) return [];
  
  // Regular expression to match E-numbers (E followed by 3-4 digits, optionally followed by a letter)
  const eCodeRegex = /\b[Ee][-\s]?(\d{3,4}[a-z]?)\b/g;
  let match;
  const foundECodes = [];
  const processedECodes = new Set(); // To avoid duplicates
  
  while ((match = eCodeRegex.exec(ingredientsText)) !== null) {
    const eCode = 'E' + match[1];
    const eCodeInfo = getECodeInfo(eCode);
    
    if (eCodeInfo && !processedECodes.has(eCode)) {
      processedECodes.add(eCode);
      foundECodes.push({
        code: eCode,
        ...eCodeInfo
      });
    }
  }
  
  // Also check for ingredient names that might be E-codes
  const ingredients = ingredientsText.split(',').map(item => item.trim());
  for (const ingredient of ingredients) {
    // Check if this ingredient name corresponds to an E-code
    for (const [code, info] of Object.entries(eCodeDatabase)) {
      if (ingredient.toLowerCase().includes(info.name.toLowerCase()) && !processedECodes.has(code)) {
        processedECodes.add(code);
        foundECodes.push({
          code,
          ...info
        });
      }
    }
  }
  
  return foundECodes;
}

/**
 * Categorize E-codes based on their potential risks
 * @param {Array} eCodes - Array of E-code objects 
 * @returns {Object} - Categorized E-codes
 */
function categorizeECodesByRisk(eCodes) {
  const categorized = {
    high: [],
    moderate: [],
    low: []
  };
  
  eCodes.forEach(eCode => {
    // Check if it has reported allergen issues
    const hasAllergyMention = eCode.potentialIssues.some(issue => 
      issue.toLowerCase().includes('allerg') || 
      issue.toLowerCase().includes('sensitivity') ||
      issue.toLowerCase().includes('reaction') ||
      issue.toLowerCase().includes('asthma')
    );
    
    // Check if it has other concerning issues
    const hasConcerningIssues = eCode.potentialIssues.some(issue => 
      issue.toLowerCase().includes('carcinogen') || 
      issue.toLowerCase().includes('toxic') ||
      issue.toLowerCase().includes('disrupt')
    );
    
    if (hasAllergyMention || hasConcerningIssues) {
      categorized.high.push(eCode);
    } else if (eCode.potentialIssues.some(issue => !issue.includes('safe'))) {
      categorized.moderate.push(eCode);
    } else {
      categorized.low.push(eCode);
    }
  });
  
  return categorized;
}

// Export the database and utility functions
export {
  eCodeDatabase,
  getECodeInfo,
  extractECodesFromText,
  categorizeECodesByRisk
};