import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AllergenTag from '../components/AllergenTag';
import NutritionTable from '../components/NutritionTable';
import WarningBadge from '../components/WarningBadge';
import { PreferencesContext } from '../context/PreferencesContext';
import { checkForWarnings } from '../utils/allergenUtils';
import { getProductRecipes } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import { getFridgeItems, getFreezerItems } from '../services/inventoryService';
import colors from '../constants/colors';

export default function ProductInfoScreen({ route, navigation }) {
  const { product } = route.params;
  const { preferences } = useContext(PreferencesContext);
  const [warnings, setWarnings] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [fridgeItems, setFridgeItems] = useState([]);
  const [freezerItems, setFreezerItems] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

  useEffect(() => {
    // Check for warnings based on user preferences
    const productWarnings = checkForWarnings(product, preferences);
    setWarnings(productWarnings);

    // Load recipes and inventory
    loadRecipes();
    loadInventory();
  }, [product, preferences]);

  const loadRecipes = async () => {
    try {
      setLoadingRecipes(true);
      const recipeResults = await getProductRecipes(product.name, product.ingredients);
      setRecipes(recipeResults);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const loadInventory = async () => {
    try {
      setLoadingInventory(true);
      const fridge = await getFridgeItems();
      const freezer = await getFreezerItems();
      setFridgeItems(fridge);
      setFreezerItems(freezer);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoadingInventory(false);
    }
  };

  const viewAllRecipes = () => {
    navigation.navigate('Recipes', { 
      productName: product.name,
      ingredients: product.ingredients
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Header */}
      <View style={styles.header}>
        <View style={styles.productInfoHeader}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productManufacturer}>{product.manufacturer}</Text>
          <Text style={styles.barcode}>EAN: {product.barcode}</Text>
        </View>
      </View>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <View style={styles.warningsContainer}>
          <Text style={styles.sectionTitle}>Warnings</Text>
          {warnings.map((warning, index) => (
            <WarningBadge key={index} warning={warning} />
          ))}
        </View>
      )}

      {/* Nutritional Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutritional Information</Text>
        <NutritionTable nutritionData={product.nutritionalInfo} />
      </View>

      {/* Ingredients */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <Text style={styles.ingredientsText}>{product.ingredients}</Text>
      </View>

      {/* E-codes */}
      {product.eCodes && product.eCodes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>E-Codes</Text>
          <View style={styles.tagsContainer}>
            {product.eCodes.map((eCode, index) => (
              <AllergenTag 
                key={index} 
                text={eCode.code} 
                description={eCode.name}
                isWarning={eCode.warning} 
              />
            ))}
          </View>
        </View>
      )}

      {/* Allergens */}
      {product.allergens && product.allergens.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergens</Text>
          <View style={styles.tagsContainer}>
            {product.allergens.map((allergen, index) => (
              <AllergenTag 
                key={index} 
                text={allergen} 
                isWarning={preferences.allergens.includes(allergen)} 
              />
            ))}
          </View>
        </View>
      ) : (
        product.ingredients ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergens</Text>
            <Text style={styles.noAllergenNotice}>
              Allergeenitietoja ei ole merkitty tuotetietoihin. Tarkista allergeenit ainesosaluettelosta.
            </Text>
          </View>
        ) : null
      )}

      {/* Recipe Suggestions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recipe Suggestions</Text>
          <TouchableOpacity onPress={viewAllRecipes}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loadingRecipes ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : recipes.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.recipesScroll}
          >
            {recipes.slice(0, 5).map((recipe, index) => (
              <RecipeCard 
                key={index} 
                recipe={recipe} 
                fridgeItems={fridgeItems}
                freezerItems={freezerItems}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noRecipesText}>
            No recipes found for this product
          </Text>
        )}
      </View>

      {/* Inventory Match */}
      {!loadingInventory && (fridgeItems.length > 0 || freezerItems.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matching Items in Your Inventory</Text>
          
          {fridgeItems.length > 0 && (
            <View style={styles.inventorySection}>
              <Text style={styles.inventoryTitle}>
                <Feather name="thermometer" size={16} color={colors.primary} /> Refrigerator
              </Text>
              {fridgeItems.map((item, index) => (
                <Text key={index} style={styles.inventoryItem}>• {item.name}</Text>
              ))}
            </View>
          )}
          
          {freezerItems.length > 0 && (
            <View style={styles.inventorySection}>
              <Text style={styles.inventoryTitle}>
                <Feather name="thermometer-snow" size={16} color={colors.primary} /> Freezer
              </Text>
              {freezerItems.map((item, index) => (
                <Text key={index} style={styles.inventoryItem}>• {item.name}</Text>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  productInfoHeader: {
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  productManufacturer: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  barcode: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  warningsContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5555',
  },
  section: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  ingredientsText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  recipesScroll: {
    marginTop: 10,
  },
  noRecipesText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  noAllergenNotice: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  inventorySection: {
    marginBottom: 15,
  },
  inventoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  inventoryItem: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
    marginBottom: 5,
  },
});
