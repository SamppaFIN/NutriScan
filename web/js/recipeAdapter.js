/**
 * Recipe Adapter Module
 * 
 * This module implements the adapter pattern to integrate with multiple
 * recipe sources while providing a unified interface.
 * 
 * Supported recipe sources:
 * - Local recipes (offline)
 * - Spoonacular API
 * - K-Ruoka
 * - Pirkka
 * - Valio
 * - Edamam
 */

class RecipeAdapter {
  constructor() {
    this.apiKeys = {};
    this.providers = {
      local: new LocalRecipeProvider(),
      spoonacular: new SpoonacularProvider(),
      kRuoka: new KRuokaProvider(),
      pirkka: new PirkkaProvider(),
      valio: new ValioProvider(),
      edamam: new EdamamProvider()
    };
    
    // Default order of providers to try
    this.providerOrder = ['local', 'spoonacular', 'kRuoka', 'valio', 'pirkka', 'edamam'];
    
    // Load API keys from local storage if available
    this.loadApiKeys();
  }
  
  /**
   * Set API key for a specific provider
   * @param {string} provider - Provider name
   * @param {string} apiKey - API key
   */
  setApiKey(provider, apiKey) {
    this.apiKeys[provider] = apiKey;
    this.saveApiKeys();
    
    // Update provider with new API key
    if (this.providers[provider] && typeof this.providers[provider].setApiKey === 'function') {
      this.providers[provider].setApiKey(apiKey);
    }
  }
  
  /**
   * Save API keys to local storage
   */
  saveApiKeys() {
    try {
      localStorage.setItem('recipeApiKeys', JSON.stringify(this.apiKeys));
    } catch (e) {
      console.error('Failed to save API keys to local storage:', e);
    }
  }
  
  /**
   * Load API keys from local storage
   */
  loadApiKeys() {
    try {
      const savedKeys = localStorage.getItem('recipeApiKeys');
      if (savedKeys) {
        this.apiKeys = JSON.parse(savedKeys);
        
        // Set API keys for each provider
        Object.entries(this.apiKeys).forEach(([provider, key]) => {
          if (this.providers[provider] && typeof this.providers[provider].setApiKey === 'function') {
            this.providers[provider].setApiKey(key);
          }
        });
      }
    } catch (e) {
      console.error('Failed to load API keys from local storage:', e);
    }
  }
  
  /**
   * Set preferred order of providers
   * @param {Array} orderArray - Array of provider names in preferred order
   */
  setProviderOrder(orderArray) {
    if (Array.isArray(orderArray) && orderArray.length > 0) {
      // Filter to make sure only valid providers are included
      this.providerOrder = orderArray.filter(name => this.providers[name]);
    }
  }
  
  /**
   * Check if a provider has API key set (if required)
   * @param {string} providerName - Name of the provider
   * @returns {boolean} - Whether provider can be used
   */
  canUseProvider(providerName) {
    const provider = this.providers[providerName];
    if (!provider) return false;
    
    // Check if provider requires API key
    if (provider.requiresApiKey && !this.apiKeys[providerName]) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get a list of available providers that can be used
   * @returns {Array} - List of provider names
   */
  getAvailableProviders() {
    return Object.keys(this.providers).filter(name => this.canUseProvider(name));
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @param {Array} preferredProviders - Optional array of preferred providers to try
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product, preferredProviders = null) {
    const providers = preferredProviders || this.providerOrder;
    
    // Try each provider in order until we get results
    for (const providerName of providers) {
      if (this.canUseProvider(providerName)) {
        try {
          const provider = this.providers[providerName];
          const recipes = await provider.getRecipesForProduct(product);
          
          // If we got recipes, return them with provider info
          if (recipes && recipes.length > 0) {
            return recipes.map(recipe => ({
              ...recipe,
              provider: providerName
            }));
          }
        } catch (error) {
          console.error(`Error fetching recipes from ${providerName}:`, error);
        }
      }
    }
    
    // If we reached here, no provider returned recipes
    return [];
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @param {Array} preferredProviders - Optional array of preferred providers to try
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query, preferredProviders = null) {
    const providers = preferredProviders || this.providerOrder;
    
    // Try each provider in order until we get results
    for (const providerName of providers) {
      if (this.canUseProvider(providerName)) {
        try {
          const provider = this.providers[providerName];
          const recipes = await provider.searchRecipes(query);
          
          // If we got recipes, return them with provider info
          if (recipes && recipes.length > 0) {
            return recipes.map(recipe => ({
              ...recipe,
              provider: providerName
            }));
          }
        } catch (error) {
          console.error(`Error searching recipes from ${providerName}:`, error);
        }
      }
    }
    
    // If we reached here, no provider returned recipes
    return [];
  }
  
  /**
   * Get recipe by ID from a specific provider
   * @param {string} recipeId - Recipe ID
   * @param {string} providerName - Provider name
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId, providerName) {
    if (!this.canUseProvider(providerName)) {
      throw new Error(`Provider ${providerName} is not available`);
    }
    
    const provider = this.providers[providerName];
    try {
      const recipe = await provider.getRecipeById(recipeId);
      if (recipe) {
        return {
          ...recipe,
          provider: providerName
        };
      }
    } catch (error) {
      console.error(`Error fetching recipe from ${providerName}:`, error);
      throw error;
    }
    
    return null;
  }
}

/**
 * Base class for recipe providers
 */
class RecipeProvider {
  constructor() {
    this.requiresApiKey = false;
  }
  
  /**
   * Set API key for the provider
   * @param {string} apiKey - API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product) {
    throw new Error('Not implemented');
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query) {
    throw new Error('Not implemented');
  }
  
  /**
   * Get recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId) {
    throw new Error('Not implemented');
  }
}

/**
 * Local recipe provider (offline)
 */
class LocalRecipeProvider extends RecipeProvider {
  constructor() {
    super();
    this.recipes = [];
    this.loadRecipes();
  }
  
  /**
   * Load recipes from local storage
   */
  loadRecipes() {
    try {
      const savedRecipes = localStorage.getItem('localRecipes');
      if (savedRecipes) {
        this.recipes = JSON.parse(savedRecipes);
      } else {
        // Prepopulate with a few basic recipes
        this.prepopulateRecipes();
      }
    } catch (e) {
      console.error('Failed to load recipes from local storage:', e);
      this.prepopulateRecipes();
    }
  }
  
  /**
   * Save recipes to local storage
   */
  saveRecipes() {
    try {
      localStorage.setItem('localRecipes', JSON.stringify(this.recipes));
    } catch (e) {
      console.error('Failed to save recipes to local storage:', e);
    }
  }
  
  /**
   * Prepopulate with basic Finnish recipes
   */
  prepopulateRecipes() {
    this.recipes = [
      {
        id: 'local-1',
        title: 'Perunasose (Mashed Potatoes)',
        ingredients: [
          '1 kg potatoes',
          '100 ml milk',
          '50 g butter',
          'Salt',
          'White pepper'
        ],
        instructions: [
          'Peel and cut potatoes into chunks.',
          'Boil in salted water until soft, about 15-20 minutes.',
          'Drain and mash the potatoes.',
          'Heat milk and butter together.',
          'Add the milk and butter mixture to the potatoes.',
          'Season with salt and white pepper.'
        ],
        prepTime: '30 minutes',
        servings: 4,
        imageUrl: '',
        matchingProducts: ['potato', 'butter', 'milk']
      },
      {
        id: 'local-2',
        title: 'Karjalanpaisti (Karelian Stew)',
        ingredients: [
          '500 g beef chuck',
          '500 g pork shoulder',
          '2 onions',
          '2 carrots',
          '5 whole allspice berries',
          '2 bay leaves',
          'Salt',
          'Water'
        ],
        instructions: [
          'Cut meat into large chunks.',
          'Slice onions and carrots.',
          'Layer meat and vegetables in a Dutch oven or heavy pot.',
          'Add spices and salt.',
          'Add water to almost cover the ingredients.',
          'Cook in oven at 150°C for 3-4 hours until meat is very tender.'
        ],
        prepTime: '4 hours',
        servings: 6,
        imageUrl: '',
        matchingProducts: ['beef', 'pork', 'onion', 'carrot']
      },
      {
        id: 'local-3',
        title: 'Pannukakku (Finnish Pancake)',
        ingredients: [
          '4 eggs',
          '500 ml milk',
          '250 g flour',
          '100 g sugar',
          '50 g melted butter',
          '1 tsp vanilla sugar',
          'Pinch of salt'
        ],
        instructions: [
          'Beat eggs and sugar together.',
          'Add flour, milk, melted butter, vanilla sugar, and salt.',
          'Mix until smooth.',
          'Pour into a buttered baking dish.',
          'Bake at 200°C for 30 minutes until golden and set.',
          'Serve with jam or fresh berries.'
        ],
        prepTime: '45 minutes',
        servings: 8,
        imageUrl: '',
        matchingProducts: ['egg', 'milk', 'butter', 'flour', 'sugar']
      },
      {
        id: 'local-4',
        title: 'Karelian Piirakat (Karelian Pasties)',
        ingredients: [
          'For the crust:',
          '200 g rye flour',
          '100 g all-purpose flour',
          '1 tsp salt',
          '200 ml water',
          'For the filling:',
          '200 g rice',
          '1 liter milk',
          '1 tsp salt',
          'For the egg butter:',
          '100 g butter',
          '2 hard-boiled eggs',
          'Salt to taste'
        ],
        instructions: [
          'For the filling, cook rice in milk until thick porridge forms (about 45 minutes).',
          'Mix the flours and salt, then add water to make a dough.',
          'Roll the dough into thin ovals.',
          'Spread rice filling on each oval, then fold and pinch the edges.',
          'Bake at 250°C for 10-15 minutes.',
          'Brush with butter while hot.',
          'For the egg butter, mix butter with chopped hard-boiled eggs and salt.'
        ],
        prepTime: '2 hours',
        servings: 15,
        imageUrl: '',
        matchingProducts: ['milk', 'rice', 'egg', 'butter', 'flour']
      },
      {
        id: 'local-5',
        title: 'Hernekeitto (Finnish Pea Soup)',
        ingredients: [
          '500 g dried green peas',
          '2 liters water',
          '1 onion',
          '300 g smoked pork or ham hock',
          '2 carrots',
          '1 tsp marjoram',
          '1 tsp thyme',
          'Salt and pepper to taste',
          'Mustard for serving'
        ],
        instructions: [
          'Soak the peas overnight.',
          'Drain and rinse the peas.',
          'Add peas, diced pork, chopped onion, and diced carrots to a large pot with water.',
          'Bring to a boil and simmer for 2-3 hours until peas are very soft.',
          'Add herbs in the last 30 minutes.',
          'Season with salt and pepper.',
          'Serve with mustard and rye bread.'
        ],
        prepTime: '3 hours (plus soaking time)',
        servings: 8,
        imageUrl: '',
        matchingProducts: ['peas', 'pork', 'onion', 'carrot']
      }
    ];
    
    this.saveRecipes();
  }
  
  /**
   * Add a recipe to local storage
   * @param {Object} recipe - Recipe to add
   */
  addRecipe(recipe) {
    if (!recipe.id) {
      recipe.id = 'local-' + Date.now();
    }
    this.recipes.push(recipe);
    this.saveRecipes();
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product) {
    // Extract product terms to search for
    const searchTerms = [
      product.name.toLowerCase(),
      ...product.ingredients.toLowerCase().split(/[,.\s]+/)
    ].filter(term => term.length > 3);
    
    // Find recipes that match product terms
    return this.recipes.filter(recipe => {
      // Check if any search term matches recipe title
      const titleMatch = searchTerms.some(term => 
        recipe.title.toLowerCase().includes(term)
      );
      
      // Check if the product matches any of the recipe's matching products
      const productMatch = recipe.matchingProducts && recipe.matchingProducts.some(matchProduct => 
        searchTerms.some(term => term.includes(matchProduct) || matchProduct.includes(term))
      );
      
      return titleMatch || productMatch;
    });
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query) {
    const searchTerms = query.toLowerCase().split(/\s+/);
    
    return this.recipes.filter(recipe => {
      // Check if any search term matches recipe title or ingredients
      return searchTerms.some(term => 
        recipe.title.toLowerCase().includes(term) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(term)
        )
      );
    });
  }
  
  /**
   * Get recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId) {
    return this.recipes.find(recipe => recipe.id === recipeId) || null;
  }
}

/**
 * Spoonacular API provider
 */
class SpoonacularProvider extends RecipeProvider {
  constructor() {
    super();
    this.requiresApiKey = true;
    this.baseUrl = 'https://api.spoonacular.com';
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product) {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key not set');
    }
    
    try {
      // Extract ingredients from product
      const ingredients = product.ingredients
        .split(/,\s*/)
        .filter(i => i.length > 2)
        .map(i => i.toLowerCase())
        .filter(i => !i.match(/e\d{3}/i)); // Filter out E-numbers
      
      // Use the most relevant ingredients (first 3)
      const queryIngredients = ingredients.slice(0, 3).join(',');
      
      const response = await fetch(
        `${this.baseUrl}/recipes/findByIngredients?ingredients=${encodeURIComponent(queryIngredients)}&number=5&apiKey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to our recipe format
      return data.map(item => ({
        id: item.id.toString(),
        title: item.title,
        imageUrl: item.image,
        usedIngredientCount: item.usedIngredientCount,
        missedIngredientCount: item.missedIngredientCount,
        ingredients: [
          ...item.usedIngredients.map(i => i.original),
          ...item.missedIngredients.map(i => i.original)
        ]
      }));
    } catch (error) {
      console.error('Spoonacular API error:', error);
      return [];
    }
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query) {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key not set');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=10&apiKey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to our recipe format
      return data.results.map(item => ({
        id: item.id.toString(),
        title: item.title,
        imageUrl: item.image,
        // Note: Basic search doesn't return ingredients, will need another API call to get full details
        ingredients: []
      }));
    } catch (error) {
      console.error('Spoonacular API error:', error);
      return [];
    }
  }
  
  /**
   * Get recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId) {
    if (!this.apiKey) {
      throw new Error('Spoonacular API key not set');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}/recipes/${recipeId}/information?apiKey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to our recipe format
      return {
        id: data.id.toString(),
        title: data.title,
        ingredients: data.extendedIngredients.map(i => i.original),
        instructions: data.analyzedInstructions.length > 0 
          ? data.analyzedInstructions[0].steps.map(s => s.step)
          : [data.instructions],
        prepTime: `${data.readyInMinutes} minutes`,
        servings: data.servings,
        imageUrl: data.image
      };
    } catch (error) {
      console.error('Spoonacular API error:', error);
      return null;
    }
  }
}

/**
 * K-Ruoka API provider
 * Note: This is a simplified implementation as K-Ruoka doesn't have a public API
 * In a real app, this would use web scraping or an official partnership API
 */
class KRuokaProvider extends RecipeProvider {
  constructor() {
    super();
    this.baseUrl = 'https://www.k-ruoka.fi/api/recipe';
    this.requiresApiKey = false; // K-Ruoka doesn't need an API key for basic search
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product) {
    // For demonstration purposes, return an empty array
    // In a real implementation, this would search K-Ruoka's recipe database
    console.log('K-Ruoka provider: This would search for recipes with', product.name);
    return [];
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query) {
    // For demonstration purposes, return an empty array
    // In a real implementation, this would search K-Ruoka's recipe database
    console.log('K-Ruoka provider: This would search for recipes with query:', query);
    return [];
  }
  
  /**
   * Get recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId) {
    // For demonstration purposes, return null
    // In a real implementation, this would fetch a specific recipe
    console.log('K-Ruoka provider: This would fetch recipe with ID:', recipeId);
    return null;
  }
}

/**
 * Pirkka API provider
 * Note: This is a simplified implementation as Pirkka doesn't have a public API
 * In a real app, this would use web scraping or an official partnership API
 */
class PirkkaProvider extends RecipeProvider {
  constructor() {
    super();
    this.baseUrl = 'https://www.pirkka.fi/api/recipe';
    this.requiresApiKey = false;
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product) {
    // For demonstration purposes, return an empty array
    console.log('Pirkka provider: This would search for recipes with', product.name);
    return [];
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query) {
    // For demonstration purposes, return an empty array
    console.log('Pirkka provider: This would search for recipes with query:', query);
    return [];
  }
  
  /**
   * Get recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId) {
    // For demonstration purposes, return null
    console.log('Pirkka provider: This would fetch recipe with ID:', recipeId);
    return null;
  }
}

/**
 * Valio API provider
 * Note: This is a simplified implementation as Valio doesn't have a public API
 * In a real app, this would use web scraping or an official partnership API
 */
class ValioProvider extends RecipeProvider {
  constructor() {
    super();
    this.baseUrl = 'https://www.valio.fi/api/recipe';
    this.requiresApiKey = false;
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product) {
    // For demonstration purposes, return an empty array
    console.log('Valio provider: This would search for recipes with', product.name);
    return [];
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query) {
    // For demonstration purposes, return an empty array
    console.log('Valio provider: This would search for recipes with query:', query);
    return [];
  }
  
  /**
   * Get recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId) {
    // For demonstration purposes, return null
    console.log('Valio provider: This would fetch recipe with ID:', recipeId);
    return null;
  }
}

/**
 * Edamam API provider
 */
class EdamamProvider extends RecipeProvider {
  constructor() {
    super();
    this.requiresApiKey = true;
    this.baseUrl = 'https://api.edamam.com/api/recipes/v2';
    this.appId = null; // Edamam requires both app_id and app_key
  }
  
  /**
   * Set API key and app ID for Edamam
   * @param {string} apiKey - Format should be "app_id|app_key"
   */
  setApiKey(apiKey) {
    const parts = apiKey.split('|');
    if (parts.length === 2) {
      this.appId = parts[0];
      this.apiKey = parts[1];
    } else {
      console.error('Edamam API key format should be "app_id|app_key"');
    }
  }
  
  /**
   * Get recipes for a product
   * @param {Object} product - Product information
   * @returns {Promise<Array>} - Array of recipes
   */
  async getRecipesForProduct(product) {
    if (!this.apiKey || !this.appId) {
      throw new Error('Edamam API key not set correctly');
    }
    
    try {
      // Extract main ingredient from product name
      const mainIngredient = product.name.split(' ')[0].toLowerCase();
      
      const response = await fetch(
        `${this.baseUrl}?type=public&q=${encodeURIComponent(mainIngredient)}&app_id=${this.appId}&app_key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to our recipe format
      return data.hits.map(hit => ({
        id: hit.recipe.uri.split('_')[1], // Extract ID from URI
        title: hit.recipe.label,
        ingredients: hit.recipe.ingredientLines,
        prepTime: hit.recipe.totalTime > 0 ? `${hit.recipe.totalTime} minutes` : 'Not specified',
        servings: hit.recipe.yield,
        imageUrl: hit.recipe.image,
        url: hit.recipe.url
      }));
    } catch (error) {
      console.error('Edamam API error:', error);
      return [];
    }
  }
  
  /**
   * Search for recipes by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of recipes
   */
  async searchRecipes(query) {
    if (!this.apiKey || !this.appId) {
      throw new Error('Edamam API key not set correctly');
    }
    
    try {
      const response = await fetch(
        `${this.baseUrl}?type=public&q=${encodeURIComponent(query)}&app_id=${this.appId}&app_key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to our recipe format
      return data.hits.map(hit => ({
        id: hit.recipe.uri.split('_')[1], // Extract ID from URI
        title: hit.recipe.label,
        ingredients: hit.recipe.ingredientLines,
        prepTime: hit.recipe.totalTime > 0 ? `${hit.recipe.totalTime} minutes` : 'Not specified',
        servings: hit.recipe.yield,
        imageUrl: hit.recipe.image,
        url: hit.recipe.url
      }));
    } catch (error) {
      console.error('Edamam API error:', error);
      return [];
    }
  }
  
  /**
   * Get recipe by ID
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<Object>} - Recipe details
   */
  async getRecipeById(recipeId) {
    if (!this.apiKey || !this.appId) {
      throw new Error('Edamam API key not set correctly');
    }
    
    try {
      const uri = `http://www.edamam.com/ontologies/edamam.owl#recipe_${recipeId}`;
      const response = await fetch(
        `${this.baseUrl}/${encodeURIComponent(uri)}?type=public&app_id=${this.appId}&app_key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform to our recipe format
      return {
        id: recipeId,
        title: data.recipe.label,
        ingredients: data.recipe.ingredientLines,
        instructions: ['See the full recipe at ' + data.recipe.url],
        prepTime: data.recipe.totalTime > 0 ? `${data.recipe.totalTime} minutes` : 'Not specified',
        servings: data.recipe.yield,
        imageUrl: data.recipe.image,
        url: data.recipe.url
      };
    } catch (error) {
      console.error('Edamam API error:', error);
      return null;
    }
  }
}

// Create a global instance of the adapter
window.recipeAdapter = new RecipeAdapter();