import React, { createContext, useState, useEffect } from 'react';
import { getUserPreferences, saveUserPreferences } from '../services/storageService';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user preferences when the app starts
    async function loadUser() {
      try {
        const userPreferences = await getUserPreferences();
        
        if (userPreferences) {
          setUser(userPreferences);
        } else {
          // Set default user preferences if none exist
          const defaultUser = {
            name: '',
            allergies: [],
            preferences: {
              diet: [],
              recipeTypes: []
            }
          };
          setUser(defaultUser);
          await saveUserPreferences(defaultUser);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const updateUser = async (updatedUser) => {
    try {
      setUser(updatedUser);
      await saveUserPreferences(updatedUser);
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
