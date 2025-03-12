import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../constants/colors';

export default function NutritionTable({ nutritionData }) {
  if (!nutritionData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nutritional information not available</Text>
      </View>
    );
  }

  // Format the value to add units and handle different formats
  const formatValue = (key, value) => {
    if (value === undefined || value === null) return 'N/A';
    
    // Add appropriate units based on the nutrient type
    if (key === 'calories') return `${value} kcal`;
    if (['fat', 'saturatedFat', 'carbohydrates', 'sugars', 'protein', 'salt', 'fiber'].includes(key)) {
      return `${value}g`;
    }
    if (['sodium'].includes(key)) return `${value}mg`;
    
    return value;
  };

  // Get display name for the nutrient
  const getNutrientDisplayName = (key) => {
    const names = {
      calories: 'Calories',
      fat: 'Fat',
      saturatedFat: 'of which Saturates',
      carbohydrates: 'Carbohydrates',
      sugars: 'of which Sugars',
      protein: 'Protein',
      salt: 'Salt',
      fiber: 'Fiber',
      sodium: 'Sodium'
    };
    
    return names[key] || key;
  };

  // Determine row style based on nutrient type (for indentation)
  const getRowStyle = (key) => {
    return ['saturatedFat', 'sugars'].includes(key) ? styles.subRow : styles.row;
  };

  // Order for displaying nutrients
  const nutrientOrder = [
    'calories', 'fat', 'saturatedFat', 'carbohydrates', 
    'sugars', 'fiber', 'protein', 'salt', 'sodium'
  ];

  // Filter and sort nutrients
  const orderedNutrients = nutrientOrder.filter(key => 
    nutritionData[key] !== undefined && nutritionData[key] !== null
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerName}>Nutrient</Text>
        <Text style={styles.headerValue}>Per 100g</Text>
      </View>
      
      <ScrollView style={styles.tableContent}>
        {orderedNutrients.map((key, index) => (
          <View 
            key={key} 
            style={[
              getRowStyle(key),
              index === orderedNutrients.length - 1 && styles.lastRow
            ]}
          >
            <Text 
              style={[
                styles.nutrientName,
                ['saturatedFat', 'sugars'].includes(key) && styles.subNutrient
              ]}
            >
              {getNutrientDisplayName(key)}
            </Text>
            <Text style={styles.nutrientValue}>
              {formatValue(key, nutritionData[key])}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  headerName: {
    flex: 2,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerValue: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    color: colors.primary,
  },
  tableContent: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  nutrientName: {
    flex: 2,
    color: '#444',
  },
  subNutrient: {
    marginLeft: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  nutrientValue: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
    color: '#444',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
});
