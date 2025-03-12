import React, { createContext, useState, useEffect } from 'react';
import { savePreferences, loadPreferences } from '../utils/storageUtils';

// Create context
export const PreferencesContext = createContext();

// Provider component
export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    allergens: [],
    restrictedECodes: [],
    sugarAlert: false,
  });
  
  const [loading, setLoading] = useState(true);

  // Load preferences on initial render
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const savedPreferences = await loadPreferences();
        if (savedPreferences) {
          setPreferences(savedPreferences);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPreferences();
  }, []);

  // Update preferences and save to storage
  const updatePreferences = async (newPreferences) => {
    try {
      setPreferences(newPreferences);
      await savePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  // Add an allergen to the list
  const addAllergen = async (allergen) => {
    if (!allergen || preferences.allergens.includes(allergen)) return;

    try {
      const newPreferences = {
        ...preferences,
        allergens: [...preferences.allergens, allergen],
      };
      
      setPreferences(newPreferences);
      await savePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to add allergen:', error);
    }
  };

  // Remove an allergen from the list
  const removeAllergen = async (allergen) => {
    try {
      const newPreferences = {
        ...preferences,
        allergens: preferences.allergens.filter(item => item !== allergen),
      };
      
      setPreferences(newPreferences);
      await savePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to remove allergen:', error);
    }
  };

  // Add an E-code to the restricted list
  const addRestrictedECode = async (eCode) => {
    if (!eCode || preferences.restrictedECodes.includes(eCode)) return;

    try {
      const newPreferences = {
        ...preferences,
        restrictedECodes: [...preferences.restrictedECodes, eCode],
      };
      
      setPreferences(newPreferences);
      await savePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to add restricted E-code:', error);
    }
  };

  // Remove an E-code from the restricted list
  const removeRestrictedECode = async (eCode) => {
    try {
      const newPreferences = {
        ...preferences,
        restrictedECodes: preferences.restrictedECodes.filter(item => item !== eCode),
      };
      
      setPreferences(newPreferences);
      await savePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to remove restricted E-code:', error);
    }
  };

  // Toggle sugar alert preference
  const toggleSugarAlert = async () => {
    try {
      const newPreferences = {
        ...preferences,
        sugarAlert: !preferences.sugarAlert,
      };
      
      setPreferences(newPreferences);
      await savePreferences(newPreferences);
    } catch (error) {
      console.error('Failed to toggle sugar alert:', error);
    }
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        updatePreferences,
        addAllergen,
        removeAllergen,
        addRestrictedECode,
        removeRestrictedECode,
        toggleSugarAlert,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
