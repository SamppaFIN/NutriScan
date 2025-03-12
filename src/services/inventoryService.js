/**
 * Service for fetching refrigerator and freezer inventory data
 * 
 * In a real application, this would connect to a user's inventory system
 * For this prototype, we'll use mock data
 */

// Get items in user's refrigerator
export const getFridgeItems = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock refrigerator items
    return [
      { id: 'f1', name: 'Maito', expiryDate: '2023-06-05' },
      { id: 'f2', name: 'Juusto', expiryDate: '2023-06-10' },
      { id: 'f3', name: 'Voi', expiryDate: '2023-06-15' },
      { id: 'f4', name: 'Tomaatti', expiryDate: '2023-06-03' },
      { id: 'f5', name: 'Kurkku', expiryDate: '2023-06-04' },
      { id: 'f6', name: 'Omenat', expiryDate: '2023-06-07' }
    ];
  } catch (error) {
    console.error('Error fetching refrigerator items:', error);
    return [];
  }
};

// Get items in user's freezer
export const getFreezerItems = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock freezer items
    return [
      { id: 'fr1', name: 'Pakastemarjat', expiryDate: '2023-11-15' },
      { id: 'fr2', name: 'Jauheliha', expiryDate: '2023-09-20' },
      { id: 'fr3', name: 'Kalapuikot', expiryDate: '2023-10-10' },
      { id: 'fr4', name: 'Pinaatti', expiryDate: '2023-10-05' }
    ];
  } catch (error) {
    console.error('Error fetching freezer items:', error);
    return [];
  }
};

// Update inventory (add item)
export const addInventoryItem = async (type, item) => {
  // In a real app, this would make an API call to add the item to inventory
  console.log(`Added to ${type}:`, item);
  return { success: true, item };
};

// Update inventory (remove item)
export const removeInventoryItem = async (type, itemId) => {
  // In a real app, this would make an API call to remove the item from inventory
  console.log(`Removed from ${type}:`, itemId);
  return { success: true };
};
