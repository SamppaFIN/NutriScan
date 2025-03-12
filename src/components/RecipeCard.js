import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const RecipeCard = ({ recipe, onPress, fridgeInventory = [] }) => {
  // Calculate how many ingredients are available in fridge
  const ingredientsInFridge = recipe.ingredients 
    ? recipe.ingredients.filter(ing => fridgeInventory.includes(ing.name)).length 
    : 0;
  
  const totalIngredients = recipe.ingredients ? recipe.ingredients.length : 0;
  
  // Calculate the percentage of available ingredients
  const availabilityPercentage = totalIngredients > 0 
    ? Math.round((ingredientsInFridge / totalIngredients) * 100) 
    : 0;
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.cookTime}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Feather name="users" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{recipe.servings} servings</Text>
          </View>
        </View>
        
        {fridgeInventory.length > 0 && (
          <View style={styles.availabilityContainer}>
            <Text style={styles.availabilityText}>
              Ingredients in fridge: {ingredientsInFridge}/{totalIngredients}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${availabilityPercentage}%` },
                  availabilityPercentage > 70 ? styles.highAvailability :
                  availabilityPercentage > 30 ? styles.mediumAvailability :
                  styles.lowAvailability
                ]}
              />
            </View>
          </View>
        )}
      </View>
      
      <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  availabilityContainer: {
    marginTop: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: `${theme.colors.border}50`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  highAvailability: {
    backgroundColor: theme.colors.success,
  },
  mediumAvailability: {
    backgroundColor: theme.colors.warning,
  },
  lowAvailability: {
    backgroundColor: theme.colors.error,
  }
});

export default RecipeCard;
