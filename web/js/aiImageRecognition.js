/**
 * AI Image Recognition Service for Product Identification
 * This simulates AI-based product recognition using common Finnish grocery products
 */

class AIImageRecognition {
  constructor() {
    // Initialize the model and load product database
    this.isInitialized = false;
    this.modelLoaded = false;
    this.confidenceThreshold = 0.7; // Minimum confidence required for a match
    this.productDatabase = []; // Will be populated from localProductDatabase
  }

  /**
   * Initialize the AI recognition system
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Simulate loading AI model
      console.log('Loading AI product recognition model...');
      
      // Load product database from localProductDatabase if available
      if (window.localProductDB) {
        this.productDatabase = window.localProductDB.getAllProducts();
        console.log(`Loaded ${this.productDatabase.length} products for AI recognition`);
      } else {
        console.warn('Local product database not available');
        // Initialize with some sample products for demonstration
        this.productDatabase = this.getSampleProducts();
      }
      
      // Simulate model loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.modelLoaded = true;
      this.isInitialized = true;
      console.log('AI product recognition initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize AI product recognition:', error);
      return false;
    }
  }

  /**
   * Analyze an image to identify products
   * @param {HTMLImageElement|string} image - Image element or data URL
   * @returns {Promise<Object>} Recognition results
   */
  async analyzeImage(image) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.modelLoaded) {
      throw new Error('AI model not loaded');
    }

    return new Promise((resolve) => {
      console.log('Analyzing image for product recognition...');
      
      // Simulate AI processing time
      setTimeout(() => {
        // For this demo, we'll randomly select a product and simulate recognition
        // In a real implementation, this would use computer vision and machine learning
        const recognizedProducts = this.simulateProductRecognition();
        
        resolve({
          success: true,
          products: recognizedProducts,
          processingTime: Math.floor(Math.random() * 500 + 500) // Simulated processing time in ms
        });
      }, 1500);
    });
  }

  /**
   * Simulate product recognition (for demonstration purposes)
   * In a real app, this would use machine learning on the captured image
   * @returns {Array} Array of recognized products with confidence scores
   */
  simulateProductRecognition() {
    const results = [];
    
    // If we have products in our database
    if (this.productDatabase.length > 0) {
      // Randomly select 1-3 products
      const numProducts = Math.floor(Math.random() * 3) + 1;
      
      // Ensure we don't try to select more products than available
      const maxProducts = Math.min(numProducts, this.productDatabase.length);
      
      // Shuffle the product database to get random products
      const shuffledProducts = [...this.productDatabase].sort(() => 0.5 - Math.random());
      
      // Take the first n products as our "recognized" products
      for (let i = 0; i < maxProducts; i++) {
        const confidence = Math.random() * 0.3 + 0.7; // Random confidence between 0.7 and 1.0
        results.push({
          product: shuffledProducts[i],
          confidence: confidence,
          boundingBox: this.generateRandomBoundingBox() // Simulate where in the image the product was found
        });
      }
    }
    
    return results;
  }

  /**
   * Generate a random bounding box (simulates product location in image)
   * @returns {Object} Bounding box coordinates
   */
  generateRandomBoundingBox() {
    // Generate coordinates between 0 and 1
    const x = Math.random() * 0.5; // Start x in left half of image
    const y = Math.random() * 0.5; // Start y in top half of image
    const width = Math.random() * 0.4 + 0.1; // Width between 0.1 and 0.5
    const height = Math.random() * 0.4 + 0.1; // Height between 0.1 and 0.5
    
    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  }

  /**
   * Sample product data if local database is not available
   * @returns {Array} Sample products for demonstration
   */
  getSampleProducts() {
    return [
      {
        barcode: "6410405103420",
        name: "Valio Maito 3.5%",
        brand: "Valio",
        origin: "Finland",
        ingredients: "Homogenized milk, vitamin D",
        nutritionalValues: {
          calories: "66 kcal/100ml",
          protein: "3.3g/100ml",
          carbohydrates: "4.7g/100ml",
          fat: "3.5g/100ml"
        }
      },
      {
        barcode: "6411402133253",
        name: "Fazer Kaurasydän Monivilja",
        brand: "Fazer",
        origin: "Finland",
        ingredients: "Whole grain oats, water, wheat flour, sugar, yeast, oil, salt",
        nutritionalValues: {
          calories: "240 kcal/100g",
          protein: "9g/100g",
          carbohydrates: "44g/100g",
          fat: "4g/100g"
        }
      },
      {
        barcode: "6416453029934",
        name: "Rainbow Kananmunat L10",
        brand: "Rainbow",
        origin: "Finland",
        ingredients: "Eggs",
        nutritionalValues: {
          calories: "143 kcal/100g",
          protein: "12.6g/100g",
          carbohydrates: "0.7g/100g",
          fat: "10.3g/100g"
        }
      },
      {
        barcode: "6410402019853",
        name: "Elovena Kaurahiutale",
        brand: "Elovena",
        origin: "Finland",
        ingredients: "100% whole grain oats",
        nutritionalValues: {
          calories: "370 kcal/100g",
          protein: "14g/100g",
          carbohydrates: "55g/100g",
          fat: "7g/100g"
        }
      },
      {
        barcode: "6410405030924",
        name: "Valio Oivariini",
        brand: "Valio",
        origin: "Finland",
        ingredients: "Butter, vegetable oil, salt, cream, vitamin D",
        nutritionalValues: {
          calories: "710 kcal/100g",
          protein: "0.5g/100g",
          carbohydrates: "0.6g/100g",
          fat: "79g/100g"
        }
      }
    ];
  }
}

// Initialize the AI recognition system when the script loads
window.aiImageRecognition = new AIImageRecognition();
console.log('AI Image Recognition module loaded');