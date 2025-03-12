import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  Switch 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PreferencesContext } from '../context/PreferencesContext';
import AllergenTag from '../components/AllergenTag';
import colors from '../constants/colors';
import { commonAllergens } from '../constants/eCodes';

export default function PreferencesScreen() {
  const { preferences, updatePreferences } = useContext(PreferencesContext);
  const [newAllergen, setNewAllergen] = useState('');
  const [newECode, setNewECode] = useState('');

  const addAllergen = () => {
    if (!newAllergen.trim()) return;
    
    // Check if allergen already exists
    if (preferences.allergens.includes(newAllergen.trim())) {
      Alert.alert('Already added', 'This allergen is already in your list');
      return;
    }
    
    const updatedAllergens = [...preferences.allergens, newAllergen.trim()];
    updatePreferences({ ...preferences, allergens: updatedAllergens });
    setNewAllergen('');
  };

  const removeAllergen = (allergen) => {
    const updatedAllergens = preferences.allergens.filter(item => item !== allergen);
    updatePreferences({ ...preferences, allergens: updatedAllergens });
  };

  const addECode = () => {
    if (!newECode.trim()) return;
    
    // Format E-code (ensure it starts with E)
    let formattedECode = newECode.trim().toUpperCase();
    if (!formattedECode.startsWith('E')) {
      formattedECode = 'E' + formattedECode;
    }
    
    // Check if E-code already exists
    if (preferences.restrictedECodes.includes(formattedECode)) {
      Alert.alert('Already added', 'This E-code is already in your list');
      return;
    }
    
    const updatedECodes = [...preferences.restrictedECodes, formattedECode];
    updatePreferences({ ...preferences, restrictedECodes: updatedECodes });
    setNewECode('');
  };

  const removeECode = (eCode) => {
    const updatedECodes = preferences.restrictedECodes.filter(item => item !== eCode);
    updatePreferences({ ...preferences, restrictedECodes: updatedECodes });
  };

  const toggleSugarAlert = () => {
    updatePreferences({ 
      ...preferences, 
      sugarAlert: !preferences.sugarAlert 
    });
  };

  const addCommonAllergen = (allergen) => {
    if (preferences.allergens.includes(allergen)) {
      removeAllergen(allergen);
    } else {
      const updatedAllergens = [...preferences.allergens, allergen];
      updatePreferences({ ...preferences, allergens: updatedAllergens });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergen Alerts</Text>
        <Text style={styles.sectionDescription}>
          Get warnings when products contain these allergens
        </Text>
        
        <View style={styles.allergenInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add an allergen..."
            value={newAllergen}
            onChangeText={setNewAllergen}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addAllergen}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.commonTitle}>Common Allergens</Text>
        <View style={styles.tagsContainer}>
          {commonAllergens.map((allergen, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => addCommonAllergen(allergen)}
            >
              <AllergenTag 
                text={allergen}
                isSelected={preferences.allergens.includes(allergen)}
              />
            </TouchableOpacity>
          ))}
        </View>

        {preferences.allergens.length > 0 && (
          <>
            <Text style={styles.selectedTitle}>Your Selected Allergens</Text>
            <View style={styles.tagsContainer}>
              {preferences.allergens.map((allergen, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeAllergen(allergen)}
                >
                  <AllergenTag 
                    text={allergen}
                    isWarning={true}
                    onDelete={() => removeAllergen(allergen)}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restricted E-Codes</Text>
        <Text style={styles.sectionDescription}>
          Get warnings when products contain these E-codes
        </Text>
        
        <View style={styles.allergenInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add an E-code (e.g. E150)..."
            value={newECode}
            onChangeText={setNewECode}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addECode}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {preferences.restrictedECodes.length > 0 ? (
          <View style={styles.tagsContainer}>
            {preferences.restrictedECodes.map((eCode, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => removeECode(eCode)}
              >
                <AllergenTag 
                  text={eCode}
                  isWarning={true}
                  onDelete={() => removeECode(eCode)}
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No restricted E-codes added yet</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Preferences</Text>

        <View style={styles.preferenceItem}>
          <View>
            <Text style={styles.preferenceLabel}>Sugar Alert</Text>
            <Text style={styles.preferenceDescription}>
              Warn me about products with high sugar content
            </Text>
          </View>
          <Switch
            value={preferences.sugarAlert}
            onValueChange={toggleSugarAlert}
            trackColor={{ false: '#d0d0d0', true: colors.primaryLight }}
            thumbColor={preferences.sugarAlert ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  section: {
    margin: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  allergenInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 46,
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  commonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#666',
    width: '85%',
  },
});
