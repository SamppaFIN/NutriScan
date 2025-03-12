import axios from 'axios';

// Base API endpoint for recipe service
// In a production app, this would be a real recipe API
const RECIPE_API_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = process.env.RECIPE_API_KEY || 'default_key';

// Mock data for development
const MOCK_RECIPES = [
  {
    id: 1,
    title: 'Classic Finnish Salmon Soup (Lohikeitto)',
    description: 'A creamy and hearty Finnish salmon soup with potatoes, carrots, and dill.',
    cookTime: '30 min',
    servings: 4,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Salmon fillet', amount: '500g' },
      { name: 'Potatoes', amount: '4 medium' },
      { name: 'Carrots', amount: '2' },
      { name: 'Leek', amount: '1 small' },
      { name: 'Butter', amount: '2 tbsp' },
      { name: 'Fish stock', amount: '1 liter' },
      { name: 'Heavy cream', amount: '200ml' },
      { name: 'Fresh dill', amount: '1 bunch' },
      { name: 'Bay leaf', amount: '2' },
      { name: 'Salt', amount: 'to taste' },
      { name: 'White pepper', amount: 'to taste' }
    ],
    instructions: [
      'Dice the potatoes and carrots into bite-sized cubes.',
      'Slice the leek thinly, using only the white and light green parts.',
      'Melt butter in a large pot over medium heat. Add the leek and sauté until soft.',
      'Add potatoes, carrots, fish stock, and bay leaves to the pot. Bring to a simmer.',
      'Cook until the vegetables are almost tender, about 10-15 minutes.',
      'Cut the salmon into cubes, removing any skin and bones.',
      'Add the salmon and cream to the pot. Simmer gently for 5 minutes until the salmon is cooked.',
      'Season with salt and white pepper. Add chopped fresh dill before serving.'
    ],
    nutrition: {
      calories: '420 kcal',
      protein: '28g',
      fat: '24g',
      carbs: '22g'
    }
  },
  {
    id: 2,
    title: 'Karelian Pies (Karjalanpiirakat)',
    description: 'Traditional Finnish pastries with rye crust and rice porridge filling.',
    cookTime: '90 min',
    servings: 12,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Rye flour', amount: '200g' },
      { name: 'All-purpose flour', amount: '100g' },
      { name: 'Water', amount: '200ml' },
      { name: 'Salt', amount: '1 tsp' },
      { name: 'Short grain rice', amount: '200g' },
      { name: 'Milk', amount: '500ml' },
      { name: 'Butter', amount: '50g' },
      { name: 'Eggs', amount: '1' }
    ],
    instructions: [
      'For the filling: Cook rice in milk until soft and creamy, about 40 minutes. Let cool.',
      'For the dough: Mix rye flour, all-purpose flour, and salt. Add water to form a soft dough.',
      'Roll the dough out very thin. Cut into oval shapes.',
      'Spread the rice porridge onto each oval, leaving the edges free.',
      'Fold the edges of the dough over the filling and pinch to create the traditional shape.',
      'Bake at 250°C (480°F) for 10-15 minutes until the edges are crisp.',
      'Mix melted butter with a beaten egg and brush over the hot pies.'
    ],
    nutrition: {
      calories: '180 kcal',
      protein: '4g',
      fat: '6g',
      carbs: '28g'
    }
  },
  {
    id: 3,
    title: 'Finnish Squeaky Cheese (Leipäjuusto)',
    description: 'Traditional Finnish cheese dessert with cloudberry jam.',
    cookTime: '45 min',
    servings: 6,
    difficulty: 'Medium',
    ingredients: [
      { name: 'Milk', amount: '2 liters' },
      { name: 'Rennet', amount: '1 tablet' },
      { name: 'Salt', amount: '1 tsp' },
      { name: 'Cloudberry jam', amount: '200g' }
    ],
    instructions: [
      'Heat the milk to 37°C (98°F).',
      'Dissolve the rennet in a small amount of water and add to the milk.',
      'Let the milk sit for about 30 minutes until it curdles.',
      'Cut the curd into cubes and stir gently for 10-15 minutes.',
      'Drain the curds in a colander lined with cheesecloth.',
      'Press the curds into a round shape and place in a 200°C (400°F) oven.',
      'Bake until golden brown on both sides, flipping halfway through.',
      'Serve warm or cold with cloudberry jam.'
    ],
    nutrition: {
      calories: '150 kcal',
      protein: '8g',
      fat: '10g',
      carbs: '4g'
    }
  },
  {
    id: 4,
    title: 'Rye Bread (Ruisleipä)',
    description: 'Traditional dense Finnish rye bread with sourdough starter.',
    cookTime: '3 hours',
    servings: 2,
    difficulty: 'Hard',
    ingredients: [
      { name: 'Rye flour', amount: '500g' },
      { name: 'Sourdough starter', amount: '200g' },
      { name: 'Water', amount: '300ml' },
      { name: 'Salt', amount: '2 tsp' },
      { name: 'Malt extract', amount: '1 tbsp' }
    ],
    instructions: [
      'Mix the sourdough starter with water and rye flour. Let it ferment overnight.',
      'Add the salt and malt extract. Knead into a firm dough.',
      'Shape into a round loaf and place on a baking sheet.',
      'Let rise for 2-3 hours in a warm place.',
      'Bake at 220°C (430°F) for 50-60 minutes until the crust is dark and the bread sounds hollow when tapped.'
    ],
    nutrition: {
      calories: '220 kcal',
      protein: '6g',
      fat: '1g',
      carbs: '45g'
    }
  },
  {
    id: 5,
    title: 'Blueberry Pie (Mustikkapiirakka)',
    description: 'Sweet Finnish blueberry pie with a buttery crust.',
    cookTime: '60 min',
    servings: 8,
    difficulty: 'Easy',
    ingredients: [
      { name: 'Butter', amount: '150g' },
      { name: 'Sugar', amount: '100g' },
      { name: 'Eggs', amount: '1' },
      { name: 'All-purpose flour', amount: '250g' },
      { name: 'Baking powder', amount: '1 tsp' },
      { name: 'Blueberries', amount: '500g' },
      { name: 'Potato starch', amount: '2 tbsp' },
      { name: 'Vanilla sugar', amount: '2 tbsp' }
    ],
    instructions: [
      'Cream together butter and sugar. Add the egg and mix well.',
      'Combine flour and baking powder, then add to the butter mixture to form a dough.',
      'Press 2/3 of the dough into a pie dish, creating a rim around the edges.',
      'Mix blueberries with potato starch and vanilla sugar.',
      'Pour the blueberry mixture into the pie crust.',
      'Crumble the remaining dough on top of the pie.',
      'Bake at 200°C (400°F) for 25-30 minutes until golden brown.'
    ],
    nutrition: {
      calories: '320 kcal',
      protein: '4g',
      fat: '15g',
      carbs: '42g'
    }
  }
];

/**
 * Get recipe suggestions based on user preferences
 * @param {Object} userPreferences - The user's dietary preferences
 * @returns {Array} An array of recipe suggestions
 */
export const getRecipeSuggestions = async (userPreferences = {}) => {
  try {
    // In a real app, we would make an API call here
    // For this demo, we'll filter the mock recipes based on user preferences
    
    let recipes = [...MOCK_RECIPES];
    
    // Filter based on dietary preferences if provided
    if (userPreferences && userPreferences.diet && userPreferences.diet.length > 0) {
      const dietPreferences = userPreferences.diet.map(p => p.toLowerCase());
      
      // Simple filtering - in a real app this would be more sophisticated
      recipes = recipes.filter(recipe => {
        // Check if recipe matches any of the user's diet preferences
        // This is a simplified example - a real app would have more detailed data
        const recipeDescription = recipe.description.toLowerCase();
        return dietPreferences.some(diet => recipeDescription.includes(diet));
      });
    }
    
    return recipes;
  } catch (error) {
    console.error('Error getting recipe suggestions:', error);
    return [];
  }
};

/**
 * Get recipes that use a specific product
 * @param {string} productName - The name of the product
 * @returns {Array} An array of recipes that use the product
 */
export const getRecipesForProduct = async (productName) => {
  try {
    if (!productName) return [];
    
    // In a real app, we would search the API for recipes with this ingredient
    // For this demo, we'll do a simple text search in our mock data
    
    const searchTerm = productName.toLowerCase();
    
    const matchingRecipes = MOCK_RECIPES.filter(recipe => {
      // Check if the product is mentioned in the ingredients
      return recipe.ingredients.some(
        ingredient => ingredient.name.toLowerCase().includes(searchTerm)
      );
    });
    
    return matchingRecipes;
  } catch (error) {
    console.error('Error getting recipes for product:', error);
    return [];
  }
};

/**
 * Search for recipes based on ingredients
 * @param {string} query - The search query
 * @param {Array} ingredients - List of ingredients to include
 * @returns {Array} An array of recipes matching the search criteria
 */
export const getRecipesByIngredients = async (query = '', ingredients = []) => {
  try {
    // In a real app, we would make an API call like:
    // const response = await axios.get(`${RECIPE_API_URL}/complexSearch`, {
    //   params: {
    //     apiKey: API_KEY,
    //     query: query,
    //     includeIngredients: ingredients.join(','),
    //     number: 10
    //   }
    // });
    // return response.data.results;
    
    // For this demo, we'll search our mock data
    let results = [...MOCK_RECIPES];
    
    // Filter by search query if provided
    if (query && query.trim() !== '') {
      const searchTerm = query.toLowerCase();
      results = results.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) || 
        recipe.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by ingredients if provided
    if (ingredients && ingredients.length > 0) {
      results = results.filter(recipe => {
        return ingredients.every(ingredient => {
          const ingredientLower = ingredient.toLowerCase();
          return recipe.ingredients.some(ri => 
            ri.name.toLowerCase().includes(ingredientLower)
          );
        });
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

/**
 * Get detailed information for a specific recipe
 * @param {number} recipeId - The ID of the recipe
 * @returns {Object} The recipe details
 */
export const getRecipeDetails = async (recipeId) => {
  try {
    // In a real app, we would make an API call like:
    // const response = await axios.get(`${RECIPE_API_URL}/${recipeId}/information`, {
    //   params: {
    //     apiKey: API_KEY
    //   }
    // });
    // return response.data;
    
    // For this demo, we'll find the recipe in our mock data
    const recipe = MOCK_RECIPES.find(r => r.id === recipeId);
    
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    
    return recipe;
  } catch (error) {
    console.error('Error getting recipe details:', error);
    return null;
  }
};
