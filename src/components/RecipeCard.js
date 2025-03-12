import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  ScrollView,
  Linking
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function RecipeCard({ recipe, fridgeItems = [], freezerItems = [], fullWidth = false }) {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Calculate which ingredients the user has in inventory
  const inventoryItems = [
    ...(fridgeItems || []).map(item => item.name.toLowerCase()),
    ...(freezerItems || []).map(item => item.name.toLowerCase())
  ];
  
  const hasIngredients = recipe.ingredients.filter(
    ingredient => inventoryItems.some(item => 
      ingredient.toLowerCase().includes(item)
    )
  );
  
  const missingIngredients = recipe.ingredients.filter(
    ingredient => !inventoryItems.some(item => 
      ingredient.toLowerCase().includes(item)
    )
  );

  const openRecipe = () => {
    if (recipe.url) {
      Linking.openURL(recipe.url);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container, 
          fullWidth ? styles.fullWidthCard : styles.horizontalCard
        ]} 
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color="#888" />
              <Text style={styles.metaText}>{recipe.cookTime || '30 min'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="layers" size={14} color="#888" />
              <Text style={styles.metaText}>{recipe.ingredients.length} ingredients</Text>
            </View>
          </View>
          
          {hasIngredients.length > 0 && (
            <View style={styles.inventoryMatch}>
              <Feather name="check-circle" size={14} color={colors.green} />
              <Text style={styles.inventoryMatchText}>
                {hasIngredients.length} items in your inventory
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{recipe.title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {recipe.description && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{recipe.description}</Text>
                </View>
              )}

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {recipe.ingredients.map((ingredient, index) => {
                  const isInInventory = inventoryItems.some(item => 
                    ingredient.toLowerCase().includes(item)
                  );
                  
                  return (
                    <View key={index} style={styles.ingredientRow}>
                      <Text style={[
                        styles.ingredientText,
                        isInInventory && styles.ingredientInInventory
                      ]}>
                        • {ingredient}
                      </Text>
                      {isInInventory && (
                        <Feather name="check" size={16} color={colors.green} />
                      )}
                    </View>
                  );
                })}
              </View>

              {recipe.instructions && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  {recipe.instructions.map((step, index) => (
                    <View key={index} style={styles.instructionStep}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.instructionText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}

              {recipe.url && (
                <TouchableOpacity 
                  style={styles.viewButton} 
                  onPress={openRecipe}
                >
                  <Text style={styles.viewButtonText}>View Full Recipe</Text>
                  <Feather name="external-link" size={16} color="white" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalCard: {
    width: 250,
    marginRight: 16,
    margin: 4,
  },
  fullWidthCard: {
    marginBottom: 16,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  inventoryMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  inventoryMatchText: {
    fontSize: 12,
    color: colors.green,
    marginLeft: 4,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    flex: 1,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  ingredientInInventory: {
    color: colors.green,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    flex: 1,
  },
  viewButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
