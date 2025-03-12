import axios from 'axios';
import { Alert } from 'react-native';

// This service handles barcode scanning and identification

const API_URL = 'https://fi.openfoodfacts.org/api/v0';

export const decodeBarcodeFormat = (type) => {
  // Convert camera barcode format types to human readable format
  const formats = {
    'ean13': 'EAN-13',
    'ean8': 'EAN-8',
    'upc': 'UPC',
    'code128': 'CODE-128',
    'code39': 'CODE-39',
    'code93': 'CODE-93',
    'codabar': 'Codabar',
    'itf14': 'ITF-14',
    'default': 'Unknown'
  };
  
  return formats[type] || formats.default;
};

export const validateFinnishBarcode = (barcode) => {
  // Finnish EAN barcodes typically start with 64 (country code for Finland)
  // or follow the standard EAN-13 format
  
  if (!barcode || barcode.length < 8) {
    return false;
  }
  
  // Check if it's a valid EAN-8, EAN-13 format
  const isValidLength = barcode.length === 8 || barcode.length === 13;
  const isNumeric = /^\d+$/.test(barcode);
  
  return isValidLength && isNumeric;
};

export const identifyProductType = (barcode) => {
  // This function can be expanded to categorize products based on their barcode prefix
  // For example, certain ranges are used for specific product categories
  
  if (barcode.startsWith('64')) {
    return 'Finnish Product';
  } else if (barcode.startsWith('73')) {
    return 'Swedish Product';
  } else if (barcode.startsWith('57')) {
    return 'Danish Product';
  } else {
    return 'International Product';
  }
};

export const fetchBarcodeData = async (barcode) => {
  try {
    // Validate the barcode format first
    if (!validateFinnishBarcode(barcode)) {
      throw new Error('Invalid barcode format');
    }
    
    // Use Open Food Facts API to get product data by barcode
    const response = await axios.get(`${API_URL}/product/${barcode}.json`);
    
    // Check if product was found
    if (response.data.status === 0) {
      throw new Error('Product not found');
    }
    
    return response.data.product;
  } catch (error) {
    console.error('Error fetching barcode data:', error);
    
    // Handle specific error cases
    if (error.response) {
      // API responded with an error status
      if (error.response.status === 404) {
        Alert.alert('Product Not Found', 'This product is not in the Finnish food database.');
      } else {
        Alert.alert('Error', 'Failed to connect to the food database. Please try again.');
      }
    } else if (error.request) {
      // No response received
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
    } else {
      // Other errors
      Alert.alert('Error', error.message);
    }
    
    return null;
  }
};
