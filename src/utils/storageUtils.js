/**
 * Utility functions for local storage operations
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const STORAGE_KEYS = {
  PREFERENCES: 'food_scanner_preferences',
  RECENTLY_SCANNED: 'food_scanner_recent_products',
};

// Maximum number of recently scanned products to store
const MAX_RECENT_PRODUCTS = 20;

// Save user preferences
export const savePreferences = async (preferences) => {
  try {
    const preferencesJson = JSON.stringify(preferences);
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, preferencesJson);
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
};

// Load user preferences
export const loadPreferences = async () => {
  try {
    const preferencesJson = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (preferencesJson) {
      return JSON.parse(preferencesJson);
    }
    
    // Return default preferences if none found
    return {
      allergens: [],
      restrictedECodes: [],
      sugarAlert: false,
    };
  } catch (error) {
    console.error('Error loading preferences:', error);
    
    // Return default preferences on error
    return {
      allergens: [],
      restrictedECodes: [],
      sugarAlert: false,
    };
  }
};

// Save a scanned product to recently scanned list
export const saveScannedProduct = async (product) => {
  try {
    // Get existing recently scanned products
    const recentProducts = await getRecentlyScannedProducts();
    
    // Filter out duplicate if exists (same barcode)
    const filteredProducts = recentProducts.filter(p => p.barcode !== product.barcode);
    
    // Add new product to the beginning of the list
    const updatedProducts = [
      {
        ...product,
        scannedTime: new Date().toISOString() // Add timestamp
      },
      ...filteredProducts,
    ].slice(0, MAX_RECENT_PRODUCTS); // Keep only the most recent products
    
    // Save updated list
    const productsJson = JSON.stringify(updatedProducts);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENTLY_SCANNED, productsJson);
    
    return true;
  } catch (error) {
    console.error('Error saving scanned product:', error);
    return false;
  }
};

// Get list of recently scanned products
export const getRecentlyScannedProducts = async () => {
  try {
    const productsJson = await AsyncStorage.getItem(STORAGE_KEYS.RECENTLY_SCANNED);
    
    if (productsJson) {
      return JSON.parse(productsJson);
    }
    
    return [];
  } catch (error) {
    console.error('Error loading recently scanned products:', error);
    return [];
  }
};

// Clear all recently scanned products
export const clearRecentlyScannedProducts = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.RECENTLY_SCANNED);
    return true;
  } catch (error) {
    console.error('Error clearing recently scanned products:', error);
    return false;
  }
};

// Clear all app data
export const clearAllAppData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PREFERENCES,
      STORAGE_KEYS.RECENTLY_SCANNED,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing app data:', error);
    return false;
  }
};
