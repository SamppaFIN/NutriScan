import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';
import { UserContext } from '../context/UserContext';
import { getRecipesByIngredients, getRecipeSuggestions } from '../services/recipeService';
import { getFridgeInventory } from '../services/storageService';
import { theme } from '../styles/theme';

const RecipesScreen = ({ route, navigation }) => {
  const { selectedRecipe } = route.params || {};
  const { user } = useContext(UserContext);
  
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fridgeInventory, setFridgeInventory] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipeDetail, setRecipeDetail] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  useEffect(() => {
    loadFridgeInventory();
    loadInitialRecipes();
    
    if (selectedRecipe) {
      setRecipeDetail(selectedRecipe);
      setShowRecipeModal(true);
    }
  }, [selectedRecipe]);

  const loadFridgeInventory = async () => {
    try {
      const inventory = await getFridgeInventory();
      setFridgeInventory(inventory || []);
    } catch (error) {
      console.error('Error loading fridge inventory:', error);
    }
  };

  const loadInitialRecipes = async () => {
    setLoading(true);
    try {
      const suggestions = await getRecipeSuggestions(user?.preferences);
      setRecipes(suggestions || []);
    } catch (error) {
      console.error('Error loading recipe suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async () => {
    if (!searchQuery.trim() && selectedIngredients.length === 0) {
      return loadInitialRecipes();
    }
    
    setLoading(true);
    try {
      const results = await getRecipesByIngredients(
        searchQuery, 
        selectedIngredients
      );
      setRecipes(results || []);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleRecipePress = (recipe) => {
    setRecipeDetail(recipe);
    setShowRecipeModal(true);
  };

  const renderIngredientChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.ingredientChip,
        selectedIngredients.includes(item) && styles.ingredientChipSelected
      ]}
      onPress={() => toggleIngredient(item)}
    >
      <Text 
        style={[
          styles.ingredientChipText,
          selectedIngredients.includes(item) && styles.ingredientChipTextSelected
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderRecipeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showRecipeModal}
      onRequestClose={() => setShowRecipeModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{recipeDetail?.title}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRecipeModal(false)}
            >
              <Feather name="x" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <Text style={styles.recipeDescription}>
              {recipeDetail?.description}
            </Text>
            
            <View style={styles.recipeMeta}>
              <View style={styles.recipeMetaItem}>
                <Feather name="clock" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.recipeMetaText}>{recipeDetail?.cookTime}</Text>
              </View>
              <View style={styles.recipeMetaItem}>
                <Feather name="users" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.recipeMetaText}>{recipeDetail?.servings} servings</Text>
              </View>
              <View style={styles.recipeMetaItem}>
                <Feather name="bar-chart-2" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.recipeMetaText}>{recipeDetail?.difficulty}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipeDetail?.ingredients?.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Feather 
                  name="check-circle" 
                  size={16} 
                  color={fridgeInventory.includes(ingredient.name) ? theme.colors.success : theme.colors.textSecondary} 
                />
                <Text style={styles.ingredientText}>
                  {ingredient.amount} {ingredient.name}
                </Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipeDetail?.instructions?.map((step, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Nutrition Information</Text>
            <View style={styles.nutritionContainer}>
              {recipeDetail?.nutrition && Object.entries(recipeDetail.nutrition).map(([key, value]) => (
                <View key={key} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{value}</Text>
                  <Text style={styles.nutritionKey}>{key}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Recipe Suggestions" 
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes or ingredients..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={searchRecipes}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  loadInitialRecipes();
                }}
              >
                <Feather name="x" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={searchRecipes}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        
        {fridgeInventory.length > 0 && (
          <View style={styles.fridgeSection}>
            <Text style={styles.fridgeSectionTitle}>
              In Your Fridge
            </Text>
            <FlatList
              data={fridgeInventory}
              renderItem={renderIngredientChip}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        
        {loading ? (
          <LoadingIndicator />
        ) : recipes.length > 0 ? (
          <FlatList
            data={recipes}
            renderItem={({ item }) => (
              <RecipeCard 
                recipe={item} 
                onPress={() => handleRecipePress(item)}
                fridgeInventory={fridgeInventory}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.recipesList}
          />
        ) : (
          <EmptyState
            icon="book-open"
            title="No recipes found"
            message="Try different ingredients or search terms"
          />
        )}
      </View>
      
      {renderRecipeModal()}
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
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fridgeSection: {
    marginBottom: 16,
  },
  fridgeSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  ingredientChip: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  ingredientChipSelected: {
    backgroundColor: theme.colors.primary,
  },
  ingredientChipText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  ingredientChipTextSelected: {
    color: 'white',
  },
  recipesList: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  recipeDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text,
    marginBottom: 16,
  },
  recipeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  recipeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  recipeMetaText: {
    marginLeft: 6,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  ingredientText: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 30,
  },
  nutritionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  nutritionKey: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }
});

export default RecipesScreen;
