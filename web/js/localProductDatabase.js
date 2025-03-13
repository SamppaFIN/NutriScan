/**
 * Local database for storing and retrieving frequently scanned products
 * This allows for offline functionality and faster lookups for common items
 */

class LocalProductDatabase {
  constructor() {
    this.storageKey = 'finnishFoodScanner_products';
    this.productsMap = new Map();
    this.loadFromStorage();
  }
  
  /**
   * Load products from local storage
   */
  loadFromStorage() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (storedData) {
        const products = JSON.parse(storedData);
        products.forEach(product => {
          if (product.barcode) {
            this.productsMap.set(product.barcode, product);
          }
        });
        console.log(`Loaded ${this.productsMap.size} products from local storage`);
      }
    } catch (error) {
      console.error('Error loading local product database:', error);
    }
  }
  
  /**
   * Save current products to local storage
   */
  saveToStorage() {
    try {
      const products = Array.from(this.productsMap.values());
      localStorage.setItem(this.storageKey, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving to local product database:', error);
    }
  }
  
  /**
   * Add or update a product in the database
   * @param {Object} product - Product information
   * @returns {boolean} - Success status
   */
  addProduct(product) {
    if (!product || !product.barcode) {
      console.error('Cannot add product without barcode');
      return false;
    }
    
    this.productsMap.set(product.barcode, {
      ...product,
      lastScanned: new Date().toISOString()
    });
    
    this.saveToStorage();
    return true;
  }
  
  /**
   * Look up a product by barcode
   * @param {string} barcode - Product barcode
   * @returns {Object|null} - Product information or null if not found
   */
  getProductByBarcode(barcode) {
    if (!barcode) return null;
    return this.productsMap.get(barcode) || null;
  }
  
  /**
   * Get all stored products
   * @returns {Array} - Array of products
   */
  getAllProducts() {
    return Array.from(this.productsMap.values());
  }
  
  /**
   * Get recently scanned products
   * @param {number} limit - Maximum number of products to return
   * @returns {Array} - Array of recent products
   */
  getRecentProducts(limit = 10) {
    return Array.from(this.productsMap.values())
      .sort((a, b) => {
        // Sort by last scanned date, most recent first
        const dateA = a.lastScanned ? new Date(a.lastScanned) : new Date(0);
        const dateB = b.lastScanned ? new Date(b.lastScanned) : new Date(0);
        return dateB - dateA;
      })
      .slice(0, limit);
  }
  
  /**
   * Search products by name or brand
   * @param {string} query - Search term
   * @returns {Array} - Matching products
   */
  searchProducts(query) {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.productsMap.values())
      .filter(product => {
        return (
          product.name?.toLowerCase().includes(lowerQuery) ||
          product.brand?.toLowerCase().includes(lowerQuery)
        );
      });
  }
  
  /**
   * Clear all stored products
   */
  clearAllProducts() {
    this.productsMap.clear();
    localStorage.removeItem(this.storageKey);
  }
  
  /**
   * Get database statistics
   * @returns {Object} - Statistics about the database
   */
  getStats() {
    return {
      totalProducts: this.productsMap.size,
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Prepopulate with common Finnish products
   * This is used to provide initial offline functionality
   */
  prepopulateWithCommonProducts() {
    const commonProducts = [
      {
        barcode: '6410405103420',
        name: 'Valio Laktoositon Rasvaton Maito',
        brand: 'Valio',
        origin: 'Finland',
        ingredients: 'Milk, vitamin D',
        allergens: ['Milk'],
        nutritionalValues: {
          calories: '33 kcal/100ml',
          protein: '3.3g/100ml',
          carbohydrates: '4.9g/100ml',
          fat: '0g/100ml'
        }
      },
      {
        barcode: '6410400085752',
        name: 'Valio Eila Kevytmaitojuoma 1,5%',
        brand: 'Valio',
        origin: 'Finland',
        ingredients: 'Milk, Lactase enzyme, Vitamin D',
        allergens: ['Milk'],
        nutritionalValues: {
          calories: '46 kcal/100ml',
          protein: '3.2g/100ml',
          carbohydrates: '4.9g/100ml',
          fat: '1.5g/100ml'
        }
      },
      {
        barcode: '6410402013721',
        name: 'Fazer Puikula Rye Bread',
        brand: 'Fazer',
        origin: 'Finland',
        ingredients: 'Wholegrain rye flour, water, wheat flour, rye malt, salt, yeast, E300, E472e',
        allergens: ['Wheat', 'Rye'],
        nutritionalValues: {
          calories: '215 kcal/100g',
          protein: '6.9g/100g',
          carbohydrates: '40g/100g',
          fat: '1.0g/100g'
        }
      },
      {
        barcode: '6413300012861',
        name: 'Rainbow Porkkana',
        brand: 'Rainbow',
        origin: 'Finland',
        ingredients: 'Carrots',
        allergens: [],
        nutritionalValues: {
          calories: '34 kcal/100g',
          protein: '0.6g/100g',
          carbohydrates: '6.4g/100g',
          fat: '0.3g/100g'
        }
      },
      {
        barcode: '6407800000576',
        name: 'HK Sininen Lenkki',
        brand: 'HK',
        origin: 'Finland',
        ingredients: 'Pork (56%), water, potato starch, salt, stabilizers (E450, E452), spices (black pepper, white pepper, ginger, coriander, nutmeg, paprika, cardamom), dextrose, antioxidant (E315), preservative (E250)',
        allergens: [],
        nutritionalValues: {
          calories: '240 kcal/100g',
          protein: '11g/100g',
          carbohydrates: '3g/100g',
          fat: '20g/100g'
        }
      },
      {
        barcode: '6408430000156',
        name: 'Oivariini Normaalisuolainen',
        brand: 'Valio',
        origin: 'Finland',
        ingredients: 'Butter (50%), rapeseed oil, water, salt (1.2%), emulsifier (E471), preservative (E202), acidifier (E270), vitamin A, D vitamin',
        allergens: ['Milk'],
        nutritionalValues: {
          calories: '720 kcal/100g',
          protein: '0.5g/100g',
          carbohydrates: '0.7g/100g',
          fat: '80g/100g'
        }
      },
      {
        barcode: '6413600000623',
        name: 'Pirkka Kananmunat 10 kpl',
        brand: 'Pirkka',
        origin: 'Finland',
        ingredients: 'Eggs',
        allergens: ['Egg'],
        nutritionalValues: {
          calories: '143 kcal/100g',
          protein: '12.5g/100g',
          carbohydrates: '0.7g/100g',
          fat: '10.8g/100g'
        }
      },
      {
        barcode: '6410401068409',
        name: 'Fazer Ruisleipä',
        brand: 'Fazer',
        origin: 'Finland',
        ingredients: 'Wholegrain rye flour, water, salt, yeast',
        allergens: ['Rye'],
        nutritionalValues: {
          calories: '212 kcal/100g',
          protein: '7g/100g',
          carbohydrates: '42g/100g',
          fat: '1g/100g'
        }
      },
      {
        barcode: '6410440105130',
        name: 'Juhlamokka Kahvi',
        brand: 'Paulig',
        origin: 'Finland',
        ingredients: 'Ground roasted coffee',
        allergens: [],
        nutritionalValues: {
          calories: '0 kcal/100g',
          protein: '0g/100g',
          carbohydrates: '0g/100g',
          fat: '0g/100g'
        }
      },
      {
        barcode: '6410500090830',
        name: 'Elovena Kaurapuuro',
        brand: 'Elovena',
        origin: 'Finland',
        ingredients: 'Wholegrain oats',
        allergens: ['Oats'],
        nutritionalValues: {
          calories: '370 kcal/100g',
          protein: '13g/100g',
          carbohydrates: '59g/100g',
          fat: '7g/100g'
        }
      }
    ];
    
    commonProducts.forEach(product => {
      this.addProduct(product);
    });
    
    console.log(`Prepopulated database with ${commonProducts.length} common Finnish products`);
  }
}

// Create and export an instance
const localProductDB = new LocalProductDatabase();

// Prepopulate with common products if the database is empty
if (localProductDB.getAllProducts().length === 0) {
  localProductDB.prepopulateWithCommonProducts();
}

export { localProductDB };