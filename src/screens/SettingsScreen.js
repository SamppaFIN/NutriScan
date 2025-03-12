import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import { UserContext } from '../context/UserContext';
import { saveUserPreferences, getUserPreferences } from '../services/storageService';
import { updateFridgeInventory, getFridgeInventory } from '../services/storageService';
import AllergenTag from '../components/AllergenTag';
import { theme } from '../styles/theme';

const COMMON_ALLERGENS = [
  'Gluten', 'Lactose', 'Milk', 'Eggs', 'Nuts', 'Peanuts', 
  'Soy', 'Fish', 'Shellfish', 'Wheat'
];

const DIET_PREFERENCES = [
  'Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-Free',
  'Keto', 'Low Carb', 'Low Fat', 'Paleo'
];

const SettingsScreen = ({ navigation }) => {
  const { user, updateUser } = useContext(UserContext);
  
  const [name, setName] = useState(user?.name || '');
  const [selectedAllergens, setSelectedAllergens] = useState(user?.allergies || []);
  const [dietPreferences, setDietPreferences] = useState(user?.preferences?.diet || []);
  const [fridgeInventory, setFridgeInventory] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [activeTab, setActiveTab] = useState('allergies');

  useEffect(() => {
    loadFridgeInventory();
  }, []);

  const loadFridgeInventory = async () => {
    try {
      const inventory = await getFridgeInventory();
      setFridgeInventory(inventory || []);
    } catch (error) {
      console.error('Error loading fridge inventory:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const updatedUser = {
        ...user,
        name,
        allergies: selectedAllergens,
        preferences: {
          ...user?.preferences,
          diet: dietPreferences
        }
      };
      
      await saveUserPreferences(updatedUser);
      updateUser(updatedUser);
      
      Alert.alert(
        'Settings Saved',
        'Your preferences have been updated successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert(
        'Error',
        'Failed to save your settings. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleAllergen = (allergen) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(item => item !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const toggleDietPreference = (preference) => {
    if (dietPreferences.includes(preference)) {
      setDietPreferences(dietPreferences.filter(item => item !== preference));
    } else {
      setDietPreferences([...dietPreferences, preference]);
    }
  };

  const handleAddFridgeItem = () => {
    if (newItem.trim() === '') return;
    
    const updatedInventory = [...fridgeInventory, newItem.trim()];
    setFridgeInventory(updatedInventory);
    updateFridgeInventory(updatedInventory);
    setNewItem('');
  };

  const handleRemoveFridgeItem = (item) => {
    const updatedInventory = fridgeInventory.filter(i => i !== item);
    setFridgeInventory(updatedInventory);
    updateFridgeInventory(updatedInventory);
  };

  const renderAllergiesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Food Allergies & Intolerances</Text>
      <Text style={styles.sectionDescription}>
        Select items to get warnings when scanning products containing these ingredients
      </Text>
      
      <View style={styles.allergenContainer}>
        {COMMON_ALLERGENS.map((allergen) => (
          <TouchableOpacity
            key={allergen}
            style={[
              styles.allergenItem,
              selectedAllergens.includes(allergen) && styles.allergenItemSelected
            ]}
            onPress={() => toggleAllergen(allergen)}
          >
            <Text 
              style={[
                styles.allergenText,
                selectedAllergens.includes(allergen) && styles.allergenTextSelected
              ]}
            >
              {allergen}
            </Text>
            {selectedAllergens.includes(allergen) && (
              <Feather name="check" size={16} color="white" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Other Food Restrictions</Text>
      <TextInput
        style={styles.customAllergenInput}
        placeholder="Type a custom ingredient to avoid..."
        value={newItem}
        onChangeText={setNewItem}
        onSubmitEditing={() => {
          if (newItem.trim()) {
            toggleAllergen(newItem.trim());
            setNewItem('');
          }
        }}
      />
      
      <View style={styles.selectedContainer}>
        <Text style={styles.sectionSubtitle}>Selected Restrictions:</Text>
        <View style={styles.selectedTags}>
          {selectedAllergens.length > 0 ? (
            selectedAllergens.map((allergen) => (
              <AllergenTag
                key={allergen}
                name={allergen}
                onRemove={() => toggleAllergen(allergen)}
                removable
              />
            ))
          ) : (
            <Text style={styles.noSelectionText}>No restrictions selected</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderPreferencesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Dietary Preferences</Text>
      <Text style={styles.sectionDescription}>
        Select your dietary preferences for better recipe recommendations
      </Text>
      
      <View style={styles.preferencesContainer}>
        {DIET_PREFERENCES.map((preference) => (
          <TouchableOpacity
            key={preference}
            style={[
              styles.preferenceItem,
              dietPreferences.includes(preference) && styles.preferenceItemSelected
            ]}
            onPress={() => toggleDietPreference(preference)}
          >
            <Text 
              style={[
                styles.preferenceText,
                dietPreferences.includes(preference) && styles.preferenceTextSelected
              ]}
            >
              {preference}
            </Text>
            {dietPreferences.includes(preference) && (
              <Feather name="check" size={16} color="white" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>User Profile</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>
    </View>
  );

  const renderInventoryTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Fridge & Freezer Inventory</Text>
      <Text style={styles.sectionDescription}>
        Manage your inventory to get better recipe suggestions based on what you have
      </Text>
      
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inventoryInput}
          placeholder="Add new item..."
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={handleAddFridgeItem}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddFridgeItem}
        >
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inventoryList}>
        {fridgeInventory.length > 0 ? (
          <FlatList
            data={fridgeInventory}
            renderItem={({ item }) => (
              <View style={styles.inventoryItem}>
                <Text style={styles.inventoryItemText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveFridgeItem(item)}>
                  <Feather name="x" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
          />
        ) : (
          <Text style={styles.noInventoryText}>
            Your inventory is empty. Add ingredients that you have in your fridge or freezer.
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Settings" 
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'allergies' && styles.activeTab]}
            onPress={() => setActiveTab('allergies')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'allergies' && styles.activeTabText]}
            >
              Allergies
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'preferences' && styles.activeTab]}
            onPress={() => setActiveTab('preferences')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'preferences' && styles.activeTabText]}
            >
              Preferences
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
            onPress={() => setActiveTab('inventory')}
          >
            <Text 
              style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}
            >
              Inventory
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollContent}>
          {activeTab === 'allergies' && renderAllergiesTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'inventory' && renderInventoryTab()}
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveSettings}
          >
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: theme.colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  allergenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  allergenItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  allergenText: {
    fontSize: 14,
    color: theme.colors.text,
    marginRight: 4,
  },
  allergenTextSelected: {
    color: 'white',
  },
  customAllergenInput: {
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noSelectionText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
  },
  preferencesContainer: {
    marginBottom: 24,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  preferenceItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  preferenceText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  preferenceTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  inventoryInput: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: theme.colors.text,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryList: {
    flex: 1,
    marginBottom: 20,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  inventoryItemText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  noInventoryText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
