import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_PREFERENCES: 'finnish_food_scanner_user_prefs',
  RECENT_PRODUCTS: 'finnish_food_scanner_recent_products',
  FRIDGE_INVENTORY: 'finnish_food_scanner_fridge_inventory'
};

// Maximum number of recent products to store
const MAX_RECENT_PRODUCTS = 10;

/**
 * Get user preferences from AsyncStorage
 * @returns {Object} The user preferences object
 */
export const getUserPreferences = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return null;
  }
};

/**
 * Save user preferences to AsyncStorage
 * @param {Object} userPreferences - The user preferences to save
 */
export const saveUserPreferences = async (userPreferences) => {
  try {
    const jsonValue = JSON.stringify(userPreferences);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, jsonValue);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

/**
 * Get recent products from AsyncStorage
 * @returns {Array} Array of recent products
 */
export const getRecentProducts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_PRODUCTS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting recent products:', error);
    return [];
  }
};

/**
 * Save a product to the recent products list
 * @param {Object} product - The product to save
 */
export const saveRecentProduct = async (product) => {
  try {
    if (!product || !product.id) {
      throw new Error('Invalid product data');
    }
    
    // Get existing products
    const existingProducts = await getRecentProducts();
    
    // Remove the product if it already exists in the list
    const filteredProducts = existingProducts.filter(p => p.id !== product.id);
    
    // Add the new product at the beginning of the array
    const updatedProducts = [product, ...filteredProducts];
    
    // Limit the number of recent products
    const limitedProducts = updatedProducts.slice(0, MAX_RECENT_PRODUCTS);
    
    // Save the updated list
    const jsonValue = JSON.stringify(limitedProducts);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENT_PRODUCTS, jsonValue);
  } catch (error) {
    console.error('Error saving recent product:', error);
    throw error;
  }
};

/**
 * Clear all recent products
 */
export const clearRecentProducts = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.RECENT_PRODUCTS);
  } catch (error) {
    console.error('Error clearing recent products:', error);
    throw error;
  }
};

/**
 * Get fridge and freezer inventory
 * @returns {Array} Array of inventory items
 */
export const getFridgeInventory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.FRIDGE_INVENTORY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting fridge inventory:', error);
    return [];
  }
};

/**
 * Update the fridge and freezer inventory
 * @param {Array} inventory - The new inventory array
 */
export const updateFridgeInventory = async (inventory) => {
  try {
    if (!Array.isArray(inventory)) {
      throw new Error('Inventory must be an array');
    }
    
    const jsonValue = JSON.stringify(inventory);
    await AsyncStorage.setItem(STORAGE_KEYS.FRIDGE_INVENTORY, jsonValue);
  } catch (error) {
    console.error('Error updating fridge inventory:', error);
    throw error;
  }
};

/**
 * Add a single item to the fridge inventory
 * @param {string} item - The item to add
 */
export const addToFridgeInventory = async (item) => {
  try {
    if (!item || typeof item !== 'string') {
      throw new Error('Invalid inventory item');
    }
    
    const inventory = await getFridgeInventory();
    
    // Check if the item already exists
    if (!inventory.includes(item)) {
      inventory.push(item);
      await updateFridgeInventory(inventory);
    }
  } catch (error) {
    console.error('Error adding item to fridge inventory:', error);
    throw error;
  }
};

/**
 * Remove a single item from the fridge inventory
 * @param {string} item - The item to remove
 */
export const removeFromFridgeInventory = async (item) => {
  try {
    const inventory = await getFridgeInventory();
    const updatedInventory = inventory.filter(i => i !== item);
    await updateFridgeInventory(updatedInventory);
  } catch (error) {
    console.error('Error removing item from fridge inventory:', error);
    throw error;
  }
};

/**
 * Clear the entire inventory
 */
export const clearFridgeInventory = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FRIDGE_INVENTORY);
  } catch (error) {
    console.error('Error clearing fridge inventory:', error);
    throw error;
  }
};
