/**
 * Service for retrieving product information from Finnish grocery products
 */
import { mockProductDatabase } from './mockData';

// Get product information based on barcode
export const getProductInfo = async (barcode) => {
  try {
    // In a real application, this would make an API call to a Finnish food database
    // For demo purposes, we'll create a simulated delay and return data from our mock database
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find product in mock database
    const product = findProductByBarcode(barcode);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    return product;
  } catch (error) {
    console.error('Error fetching product info:', error);
    throw error;
  }
};

// Find product by barcode in mock database
// In a real app, this would be an API call to a Finnish food database
function findProductByBarcode(barcode) {
  // Try to find the product in our mock database
  const product = mockProductDatabase.find(p => p.barcode === barcode);
  
  // If product is not found, generate a random one (for demo purposes)
  if (!product) {
    return generateRandomProduct(barcode);
  }
  
  return product;
}

// Generate a random product for demonstration purposes
// In a real app, this function would not exist
function generateRandomProduct(barcode) {
  // This is just for demonstration - in a real app you would 
  // only return actual product data from your database
  const products = [
    {
      name: "Ruisleipä",
      manufacturer: "Vaasan",
      ingredients: "Ruisjauho, vesi, vehnäjauho, suola, hiiva",
      allergens: ["Ruis", "Vehnä"],
      eCodes: [
        { code: "E300", name: "Askorbiinihappo", warning: false },
        { code: "E440", name: "Pektiini", warning: false }
      ],
      nutritionalInfo: {
        calories: 215,
        fat: 1.5,
        saturatedFat: 0.2,
        carbohydrates: 41,
        sugars: 2,
        fiber: 8.5,
        protein: 6.5,
        salt: 1.2
      }
    },
    {
      name: "Rasvaton maito",
      manufacturer: "Valio",
      ingredients: "Rasvaton maito, D-vitamiini",
      allergens: ["Maito"],
      eCodes: [],
      nutritionalInfo: {
        calories: 33,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 4.8,
        sugars: 4.8,
        protein: 3.3,
        salt: 0.1
      }
    },
    {
      name: "Kaurahiutaleet",
      manufacturer: "Elovena",
      ingredients: "Täysjyväkaura",
      allergens: ["Kaura"],
      eCodes: [],
      nutritionalInfo: {
        calories: 370,
        fat: 7,
        saturatedFat: 1.3,
        carbohydrates: 58,
        sugars: 1,
        fiber: 10,
        protein: 14,
        salt: 0
      }
    }
  ];
  
  const randomIndex = Math.floor(Math.random() * products.length);
  const product = products[randomIndex];
  
  return {
    ...product,
    barcode,
    id: `product-${barcode}`,
    scannedTime: new Date().toISOString()
  };
}

// This mock data function would not exist in a real app
// It should fetch data from an actual Finnish food database API
export const mockProductDatabase = [
  {
    id: "product-1",
    barcode: "6410405102058",
    name: "Ruisleipä",
    manufacturer: "Vaasan",
    ingredients: "Ruisjauho, vesi, vehnäjauho, suola, hiiva",
    allergens: ["Ruis", "Vehnä"],
    eCodes: [
      { code: "E300", name: "Askorbiinihappo", warning: false },
      { code: "E440", name: "Pektiini", warning: false }
    ],
    nutritionalInfo: {
      calories: 215,
      fat: 1.5,
      saturatedFat: 0.2,
      carbohydrates: 41,
      sugars: 2,
      fiber: 8.5,
      protein: 6.5,
      salt: 1.2
    },
    scannedTime: "2023-05-20T15:22:36.123Z"
  },
  {
    id: "product-2",
    barcode: "6413300000349",
    name: "Rasvaton maito",
    manufacturer: "Valio",
    ingredients: "Rasvaton maito, D-vitamiini",
    allergens: ["Maito"],
    eCodes: [],
    nutritionalInfo: {
      calories: 33,
      fat: 0,
      saturatedFat: 0,
      carbohydrates: 4.8,
      sugars: 4.8,
      protein: 3.3,
      salt: 0.1
    },
    scannedTime: "2023-05-21T09:15:42.567Z"
  },
  {
    id: "product-3",
    barcode: "6410405073884",
    name: "Kaurahiutaleet",
    manufacturer: "Elovena",
    ingredients: "Täysjyväkaura",
    allergens: ["Kaura"],
    eCodes: [],
    nutritionalInfo: {
      calories: 370,
      fat: 7,
      saturatedFat: 1.3,
      carbohydrates: 58,
      sugars: 1,
      fiber: 10,
      protein: 14,
      salt: 0
    },
    scannedTime: "2023-05-19T17:30:22.890Z"
  }
];
