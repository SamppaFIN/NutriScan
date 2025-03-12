/**
 * Utility functions for checking allergens and ingredient warnings
 */

// Check if a product contains warnings based on user preferences
export const checkForWarnings = (product, preferences) => {
  if (!product || !preferences) return [];
  
  const warnings = [];
  
  // Check for allergens
  if (product.allergens && preferences.allergens && preferences.allergens.length > 0) {
    const allergenWarnings = product.allergens.filter(allergen => 
      preferences.allergens.some(userAllergen => 
        allergen.toLowerCase() === userAllergen.toLowerCase()
      )
    );
    
    if (allergenWarnings.length > 0) {
      warnings.push({
        type: 'allergen',
        title: 'Allergen Alert',
        description: `This product contains: ${allergenWarnings.join(', ')}`,
        items: allergenWarnings
      });
    }
  }
  
  // Check for restricted E-codes
  if (product.eCodes && preferences.restrictedECodes && preferences.restrictedECodes.length > 0) {
    const eCodeWarnings = product.eCodes
      .filter(eCode => 
        preferences.restrictedECodes.some(userECode => 
          eCode.code.toLowerCase() === userECode.toLowerCase()
        )
      )
      .map(eCode => eCode.code);
    
    if (eCodeWarnings.length > 0) {
      warnings.push({
        type: 'eCode',
        title: 'E-Code Alert',
        description: `This product contains E-codes you want to avoid: ${eCodeWarnings.join(', ')}`,
        items: eCodeWarnings
      });
    }
  }
  
  // Check for high sugar content if that preference is enabled
  if (preferences.sugarAlert && 
      product.nutritionalInfo && 
      product.nutritionalInfo.sugars && 
      product.nutritionalInfo.sugars > 10) {
    warnings.push({
      type: 'sugar',
      title: 'High Sugar Content',
      description: `This product contains ${product.nutritionalInfo.sugars}g of sugar per 100g`,
      value: product.nutritionalInfo.sugars
    });
  }
  
  return warnings;
};

// Check if a specific ingredient is in a product
export const hasIngredient = (product, ingredientName) => {
  if (!product || !product.ingredients) return false;
  
  return product.ingredients
    .toLowerCase()
    .includes(ingredientName.toLowerCase());
};

// Extract allergens from ingredients text
export const extractAllergensFromText = (ingredientsText) => {
  // Common allergens to check for
  const commonAllergens = [
    'maito', 'vehnä', 'ohra', 'ruis', 'kaura', 'kananmuna', 'kala', 
    'äyriäinen', 'pähkinä', 'soija', 'seesaminsiemen', 'selleri', 
    'sinappi', 'lupiini', 'nilviäinen', 'gluteeni', 'laktoosi'
  ];
  
  if (!ingredientsText) return [];
  
  const lowerCaseText = ingredientsText.toLowerCase();
  return commonAllergens.filter(allergen => 
    lowerCaseText.includes(allergen)
  );
};
