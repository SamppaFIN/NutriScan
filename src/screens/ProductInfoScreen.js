import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import AllergenTag from '../components/AllergenTag';
import LoadingIndicator from '../components/LoadingIndicator';
import { UserContext } from '../context/UserContext';
import { checkAllergens } from '../utils/allergenChecker';
import { getRecipesForProduct } from '../services/recipeService';
import { theme } from '../styles/theme';

const ProductInfoScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('nutrition');
  const [allergenWarnings, setAllergenWarnings] = useState([]);

  useEffect(() => {
    checkProductAllergens();
    loadRecommendedRecipes();
  }, [product, user]);

  const checkProductAllergens = () => {
    if (product && user?.allergies) {
      const warnings = checkAllergens(product, user.allergies);
      setAllergenWarnings(warnings);
      
      if (warnings.length > 0) {
        Alert.alert(
          'Allergen Warning',
          `This product contains ingredients you're allergic to: ${warnings.join(', ')}`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  const loadRecommendedRecipes = async () => {
    try {
      setLoading(true);
      const recipeResults = await getRecipesForProduct(product.name);
      setRecipes(recipeResults || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNutritionInfo = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Nutrition Information (per 100g)</Text>
      
      <View style={styles.nutritionTable}>
        {product.nutrition && Object.entries(product.nutrition).map(([key, value]) => (
          <View style={styles.nutritionRow} key={key}>
            <Text style={styles.nutritionKey}>{key}</Text>
            <Text style={styles.nutritionValue}>{value}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Macronutrients</Text>
      <View style={styles.macrosContainer}>
        {product.macros && Object.entries(product.macros).map(([key, value]) => (
          <View style={styles.macroItem} key={key}>
            <Text style={styles.macroValue}>{value}</Text>
            <Text style={styles.macroLabel}>{key}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderIngredientsInfo = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <Text style={styles.ingredientsList}>{product.ingredients}</Text>
      
      {allergenWarnings.length > 0 && (
        <View style={styles.allergenWarning}>
          <Feather name="alert-triangle" size={20} color={theme.colors.warning} />
          <Text style={styles.allergenWarningText}>
            Contains allergens you've marked
          </Text>
        </View>
      )}
      
      <Text style={styles.sectionTitle}>E-codes</Text>
      {product.eCodes && product.eCodes.length > 0 ? (
        <View style={styles.eCodesContainer}>
          {product.eCodes.map((eCode) => (
            <View 
              key={eCode.code} 
              style={[
                styles.eCodeItem, 
                eCode.warning && styles.eCodeWarning
              ]}
            >
              <Text style={styles.eCodeText}>{eCode.code}</Text>
              <Text style={styles.eCodeDescription}>{eCode.name}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>No E-codes listed for this product</Text>
      )}
    </View>
  );

  const renderRecipesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Recipe Suggestions</Text>
      
      {loading ? (
        <LoadingIndicator />
      ) : recipes.length > 0 ? (
        recipes.map((recipe) => (
          <TouchableOpacity 
            key={recipe.id} 
            style={styles.recipeCard}
            onPress={() => navigation.navigate('Recipes', { selectedRecipe: recipe })}
          >
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
              <View style={styles.recipeMetaInfo}>
                <View style={styles.recipeMetaItem}>
                  <Feather name="clock" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.recipeMetaText}>{recipe.cookTime}</Text>
                </View>
                <View style={styles.recipeMetaItem}>
                  <Feather name="bar-chart-2" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.recipeMetaText}>{recipe.difficulty}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noRecipes}>
          <Feather name="book" size={40} color={theme.colors.textSecondary} />
          <Text style={styles.noRecipesText}>No recipes found for this product</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Product Information" 
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
          
          <View style={styles.badgesContainer}>
            {product.badges && product.badges.map((badge) => (
              <View key={badge} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
          
          {allergenWarnings.length > 0 && (
            <View style={styles.allergenTags}>
              {allergenWarnings.map((allergen) => (
                <AllergenTag key={allergen} name={allergen} />
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
            onPress={() => setActiveTab('nutrition')}
          >
            <Text style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>
              Nutrition
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ingredients' && styles.activeTab]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text style={[styles.tabText, activeTab === 'ingredients' && styles.activeTabText]}>
              Ingredients
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
            onPress={() => setActiveTab('recipes')}
          >
            <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
              Recipes
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'nutrition' && renderNutritionInfo()}
        {activeTab === 'ingredients' && renderIngredientsInfo()}
        {activeTab === 'recipes' && renderRecipesTab()}
      </ScrollView>
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
  productHeader: {
    marginBottom: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  allergenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  tabContent: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.text,
  },
  nutritionTable: {
    marginBottom: 24,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  nutritionKey: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  ingredientsList: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
    marginBottom: 16,
  },
  allergenWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  allergenWarningText: {
    marginLeft: 8,
    color: theme.colors.warning,
    fontWeight: '500',
  },
  eCodesContainer: {
    marginBottom: 24,
  },
  eCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    marginBottom: 8,
  },
  eCodeWarning: {
    backgroundColor: theme.colors.warningBackground,
  },
  eCodeText: {
    fontWeight: 'bold',
    marginRight: 8,
    color: theme.colors.text,
  },
  eCodeDescription: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  noDataText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  recipeCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.text,
  },
  recipeDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  recipeMetaInfo: {
    flexDirection: 'row',
  },
  recipeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  recipeMetaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  noRecipes: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  noRecipesText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }
});

export default ProductInfoScreen;
