/**
 * Service for processing barcode data scanned from products
 */

// Process the barcode data (EAN format)
export const scanBarcode = async (barcodeData) => {
  try {
    // Validate barcode format (EAN-13 or EAN-8)
    if (!/^\d{8,13}$/.test(barcodeData)) {
      throw new Error('Invalid barcode format. Expected EAN-8 or EAN-13 format.');
    }
    
    // Return processed barcode data
    return {
      barcode: barcodeData,
      format: barcodeData.length === 13 ? 'EAN-13' : 'EAN-8',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error processing barcode:', error);
    throw error;
  }
};

// Check if a barcode exists in the database
export const checkBarcodeExists = async (barcode) => {
  // Here we would usually make an API call to check if the barcode exists
  // For simplicity, we're mocking this function
  // In a real app, this would check against a Finnish product database
  return true;
};
