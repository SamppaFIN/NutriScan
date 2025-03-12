import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import RecipeCard from '../components/RecipeCard';
import EmptyStateMessage from '../components/EmptyStateMessage';
import { getRecipes } from '../services/recipeService';
import { getFridgeItems, getFreezerItems } from '../services/inventoryService';
import colors from '../constants/colors';

export default function RecipesScreen({ route }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [fridgeItems, setFridgeItems] = useState([]);
  const [freezerItems, setFreezerItems] = useState([]);
  const [filters, setFilters] = useState({
    useInventory: false,
  });

  // If coming from product info screen, use product data for initial search
  useEffect(() => {
    if (route.params?.productName) {
      setSearchQuery(route.params.productName);
    }
    
    loadInventory();
    loadRecipes();
  }, [route.params]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        loadRecipes();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filters]);

  const loadInventory = async () => {
    try {
      const fridge = await getFridgeItems();
      const freezer = await getFreezerItems();
      setFridgeItems(fridge);
      setFreezerItems(freezer);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
  };

  const loadRecipes = async () => {
    if (!searchQuery.trim() && !filters.useInventory) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let ingredients = [];
      
      if (filters.useInventory) {
        ingredients = [
          ...fridgeItems.map(item => item.name),
          ...freezerItems.map(item => item.name),
        ];
      }
      
      const recipeResults = await getRecipes(searchQuery, ingredients);
      setRecipes(recipeResults);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleInventoryFilter = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      useInventory: !prevFilters.useInventory
    }));
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Feather name="x" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            filters.useInventory && styles.filterButtonActive
          ]}
          onPress={toggleInventoryFilter}
        >
          <Feather 
            name="check-square" 
            size={16} 
            color={filters.useInventory ? 'white' : colors.primary} 
          />
          <Text 
            style={[
              styles.filterButtonText,
              filters.useInventory && styles.filterButtonTextActive
            ]}
          >
            Use my inventory
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Recipe List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              fridgeItems={fridgeItems}
              freezerItems={freezerItems}
              fullWidth
            />
          )}
          keyExtractor={(item, index) => `recipe-${item.id || index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recipesList}
        />
      ) : (
        <EmptyStateMessage 
          icon="book"
          message={searchQuery ? "No recipes found" : "Search for recipes"}
          subMessage={searchQuery 
            ? "Try different ingredients or check your spelling" 
            : "Enter ingredients or dish names to find recipes"
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    marginLeft: 6,
    color: colors.primary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  recipesList: {
    padding: 16,
  },
});
