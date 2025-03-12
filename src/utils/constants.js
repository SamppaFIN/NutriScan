// Common allergens and food restrictions
export const COMMON_ALLERGENS = [
  'Gluten',
  'Lactose',
  'Milk',
  'Eggs',
  'Nuts',
  'Peanuts',
  'Soy',
  'Fish',
  'Shellfish',
  'Wheat',
  'Sulfites',
  'Mustard',
  'Celery',
  'Lupin',
  'Sesame'
];

// Diet preferences
export const DIET_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-Free',
  'Lactose-Free',
  'Keto',
  'Low Carb',
  'Low Fat',
  'Paleo',
  'Organic',
  'No Additives'
];

// Finnish food-related agencies and resources
export const FINNISH_FOOD_RESOURCES = {
  FINNISH_FOOD_AUTHORITY: 'https://www.ruokavirasto.fi/en/',
  FINELI_DATABASE: 'https://fineli.fi/fineli/en/index',
  EVIRA: 'https://www.ruokavirasto.fi/en/about-us/services/guides--instructions/companies/food-sector/'
};

// E-code Categories 
export const E_CODE_CATEGORIES = {
  COLORS: {
    range: 'E100-E199',
    description: 'Food colorings'
  },
  PRESERVATIVES: {
    range: 'E200-E299',
    description: 'Preservatives to prevent food spoilage'
  },
  ANTIOXIDANTS: {
    range: 'E300-E399',
    description: 'Antioxidants and acidity regulators'
  },
  TEXTURE_AGENTS: {
    range: 'E400-E499',
    description: 'Thickeners, stabilizers, and emulsifiers'
  },
  PH_REGULATORS: {
    range: 'E500-E599',
    description: 'Acidity regulators and anti-caking agents'
  },
  FLAVOR_ENHANCERS: {
    range: 'E600-E699',
    description: 'Flavor enhancers and sweeteners'
  },
  ANTIBIOTICS: {
    range: 'E700-E799',
    description: 'Antibiotics (rarely used in food anymore)'
  },
  MISCELLANEOUS: {
    range: 'E900-E999',
    description: 'Miscellaneous additives'
  },
  ADDITIONAL_CHEMICALS: {
    range: 'E1000-E1599',
    description: 'Additional chemicals and compounds'
  }
};

// Finnish nutrition recommendation values (per day)
export const NUTRITION_RECOMMENDATIONS = {
  ADULT: {
    CALORIES: '2000-2500 kcal',
    PROTEIN: '10-20% of energy intake',
    FAT: '25-40% of energy intake',
    CARBS: '45-60% of energy intake',
    FIBER: '25-35g',
    SALT: 'Less than 5g',
    SUGAR: 'Less than 10% of energy intake'
  },
  CHILD: {
    CALORIES: '1400-2000 kcal',
    PROTEIN: '10-20% of energy intake',
    FAT: '25-40% of energy intake',
    CARBS: '45-60% of energy intake',
    FIBER: '15-25g',
    SALT: 'Less than 3-4g',
    SUGAR: 'Less than 10% of energy intake'
  }
};

// App-specific constants
export const APP_CONSTANTS = {
  MAX_RECENT_PRODUCTS: 10,
  DEFAULT_BARCODE_TYPES: ['ean13', 'ean8'],
  SCAN_TIMEOUT: 10000, // milliseconds
  INGREDIENT_REFRESH_INTERVAL: 7, // days
  DATA_VERSION: '1.0.0'
};

// Error messages
export const ERROR_MESSAGES = {
  CAMERA_PERMISSION: 'Camera permission is required to scan barcodes',
  PRODUCT_NOT_FOUND: 'Product not found in the Finnish food database',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  SCAN_TIMEOUT: 'Scan timeout. Please try again',
  GENERAL_ERROR: 'An error occurred. Please try again'
};

// Success messages
export const SUCCESS_MESSAGES = {
  SETTINGS_SAVED: 'Settings saved successfully',
  ITEM_ADDED: 'Item added successfully',
  ITEM_REMOVED: 'Item removed successfully'
};
