/**
 * Service for retrieving recipe suggestions based on products
 */

// Get recipe suggestions based on product name and ingredients
export const getProductRecipes = async (productName, ingredients) => {
  try {
    // In a real application, this would make an API call to a recipe database
    // For demo purposes, we'll use mock data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get recipes based on product and ingredients
    const recipes = findRecipesForProduct(productName, ingredients);
    
    return recipes;
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
    return [];
  }
};

// Get recipes based on search query and available ingredients
export const getRecipes = async (query, availableIngredients = []) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Search recipes
    let recipes = searchRecipes(query);
    
    // If available ingredients provided, prioritize recipes that use them
    if (availableIngredients && availableIngredients.length > 0) {
      recipes = sortRecipesByIngredientMatch(recipes, availableIngredients);
    }
    
    return recipes;
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

// Find recipes that can use the given product
function findRecipesForProduct(productName, ingredients) {
  // Extract key ingredient terms
  const terms = extractIngredientTerms(productName, ingredients);
  
  // Filter recipes that contain any of the terms
  return mockRecipes.filter(recipe => {
    const recipeText = recipe.title.toLowerCase() + ' ' + 
                       recipe.ingredients.join(' ').toLowerCase();
    
    return terms.some(term => recipeText.includes(term));
  });
}

// Extract key ingredient terms from product data
function extractIngredientTerms(productName, ingredients) {
  const terms = [];
  
  // Add product name
  if (productName) {
    // Clean up product name (remove manufacturer, packaging details)
    const cleanName = productName
      .toLowerCase()
      .replace(/\d+\s*g|\d+\s*kg|\d+\s*ml|\d+\s*l/g, '') // Remove weight/volume
      .replace(/\(.*?\)/g, '') // Remove text in parentheses
      .split(' ')
      .filter(word => word.length > 3) // Only meaningful words
      .map(word => word.trim());
    
    terms.push(...cleanName);
  }
  
  // Parse ingredients string
  if (ingredients) {
    const ingredientList = ingredients
      .toLowerCase()
      .split(/,|;/)
      .map(item => item.trim())
      .filter(item => 
        item.length > 3 && 
        !item.includes('e-') && 
        !item.includes('e\d') &&
        !item.startsWith('vesi') &&
        !item.startsWith('suola')
      );
    
    terms.push(...ingredientList);
  }
  
  return [...new Set(terms)]; // Remove duplicates
}

// Search recipes by query
function searchRecipes(query) {
  if (!query) return [];
  
  const searchTerms = query.toLowerCase().split(' ');
  
  return mockRecipes.filter(recipe => {
    const recipeText = recipe.title.toLowerCase() + ' ' + 
                       recipe.ingredients.join(' ').toLowerCase() + ' ' +
                       (recipe.description || '').toLowerCase();
    
    return searchTerms.some(term => recipeText.includes(term));
  });
}

// Sort recipes based on how many ingredients match the available ingredients
function sortRecipesByIngredientMatch(recipes, availableIngredients) {
  const lowerCaseAvailable = availableIngredients.map(item => item.toLowerCase());
  
  return [...recipes].sort((a, b) => {
    const aMatches = a.ingredients.filter(ingredient => 
      lowerCaseAvailable.some(item => ingredient.toLowerCase().includes(item))
    ).length;
    
    const bMatches = b.ingredients.filter(ingredient => 
      lowerCaseAvailable.some(item => ingredient.toLowerCase().includes(item))
    ).length;
    
    return bMatches - aMatches;
  });
}

// Mock recipe database - in a real app this would be fetched from an API
const mockRecipes = [
  {
    id: 1,
    title: "Ruisleipätoastit vuohenjuustolla",
    description: "Herkullinen ja helppo välipala ruisleivästä ja vuohenjuustosta",
    ingredients: [
      "4 viipaletta ruisleipää",
      "200g vuohenjuustoa",
      "2 tomaattia",
      "1 ruukku rucolaa",
      "2 rkl oliiviöljyä",
      "Mustapippuria maun mukaan"
    ],
    instructions: [
      "Leikkaa tomaatit ohuiksi viipaleiksi",
      "Levitä vuohenjuusto ruisleipäviipaleille",
      "Lisää tomaattiviipaleet ja rucola",
      "Pirskota päälle oliiviöljyä ja mustapippuria",
      "Tarjoile välittömästi"
    ],
    cookTime: "10 min",
    url: "https://www.k-ruoka.fi/reseptit/ruisleivat-vuohenjuustolla"
  },
  {
    id: 2,
    title: "Kaurapuuro marjoilla",
    description: "Perinteinen suomalainen aamiainen kaurahiutaleista",
    ingredients: [
      "1 dl kaurahiutaleita",
      "2 dl vettä",
      "Ripaus suolaa",
      "1 dl mustikoita tai muita marjoja",
      "1 rkl hunajaa",
      "0.5 dl maitoa tai kasvisperäistä vaihtoehtoa"
    ],
    instructions: [
      "Keitä kaurahiutaleet vedessä suolan kanssa noin 5 minuuttia, kunnes puuro on sopivan paksua",
      "Kaada puuro kulhoon ja lisää päälle marjat, hunaja ja maito",
      "Nauti lämpimänä"
    ],
    cookTime: "8 min",
    url: "https://www.valio.fi/reseptit/perinteinen-kaurapuuro/"
  },
  {
    id: 3,
    title: "Mansikka-banaanismoothie",
    description: "Raikas ja terveellinen smoothie aamiaiseksi tai välipalaksi",
    ingredients: [
      "2 dl maitoa",
      "1 banaani",
      "1 dl pakastemansikoita",
      "1 rkl hunajaa",
      "0.5 dl kaurahiutaleita"
    ],
    instructions: [
      "Laita kaikki ainekset tehosekoittimeen",
      "Sekoita tasaiseksi smoothieksi",
      "Tarjoile välittömästi"
    ],
    cookTime: "5 min",
    url: "https://www.k-ruoka.fi/reseptit/mansikka-banaanismoothie"
  },
  {
    id: 4,
    title: "Ruisleipä-lohivoileivät",
    description: "Nopea ja maistuva voileipä savulohesta ja ruisleivästä",
    ingredients: [
      "4 viipaletta ruisleipää",
      "200g savulohta",
      "100g tuorejuustoa",
      "1 punasipuli",
      "1 sitruuna",
      "1 nippu tilliä",
      "Mustapippuria maun mukaan"
    ],
    instructions: [
      "Levitä tuorejuusto ruisleipäviipaleille",
      "Lisää savulohiviipaleet",
      "Leikkaa punasipuli ohuiksi renkaiksi ja asettele lohiviipaleiden päälle",
      "Purista sitruunamehua pinnalle ja koristele tillillä",
      "Mausta mustapippurilla"
    ],
    cookTime: "10 min",
    url: "https://www.valio.fi/reseptit/ruisleipa-lohivoileivat/"
  },
  {
    id: 5,
    title: "Karjalanpaisti",
    description: "Perinteinen suomalainen liharuoka",
    ingredients: [
      "500g naudanlihaa",
      "500g porsaanlihaa",
      "2 sipulia",
      "2 porkkanaa",
      "5 kokonaista maustepippuria",
      "3 laakerinlehteä",
      "2 tl suolaa",
      "1 l vettä"
    ],
    instructions: [
      "Leikkaa lihat paloiksi",
      "Kuori ja paloittele sipulit ja porkkanat",
      "Laita kaikki ainekset pataan ja lisää mausteet",
      "Lisää vettä niin, että ainekset peittyvät",
      "Hauduta 150 asteessa 3-4 tuntia",
      "Tarjoile keitettyjen perunoiden kanssa"
    ],
    cookTime: "4 h",
    url: "https://www.k-ruoka.fi/reseptit/karjalanpaisti"
  }
];
