import axios from 'axios';
import { fetchBarcodeData } from './barcodeService';

// Finnish food database API (using Open Food Facts as an example)
const API_URL = 'https://fi.openfoodfacts.org/api/v0';

// Mock data for development - replace with real API in production
const MOCK_PRODUCTS = {
  '6410405093554': {
    id: '6410405093554',
    name: 'Valio Kefir',
    brand: 'Valio',
    description: 'Original Finnish kefir',
    ingredients: 'Pasteurized milk, kefir cultures',
    badges: ['Organic', 'Low Fat'],
    nutrition: {
      calories: '58 kcal',
      fat: '1.5 g',
      carbohydrates: '4.5 g',
      protein: '3.3 g',
      salt: '0.1 g'
    },
    macros: {
      protein: '3.3g',
      fat: '1.5g',
      carbs: '4.5g'
    },
    eCodes: [
      { code: 'E202', name: 'Potassium sorbate', warning: false },
      { code: 'E330', name: 'Citric acid', warning: false }
    ]
  },
  '6413300021094': {
    id: '6413300021094',
    name: 'Fazer Ruisleipä',
    brand: 'Fazer',
    description: 'Traditional Finnish rye bread',
    ingredients: 'Rye flour, water, sourdough, salt, yeast',
    badges: ['Whole Grain', 'No Additives'],
    nutrition: {
      calories: '220 kcal',
      fat: '0.8 g',
      carbohydrates: '45 g',
      protein: '6.5 g',
      salt: '1.2 g'
    },
    macros: {
      protein: '6.5g',
      fat: '0.8g',
      carbs: '45g'
    },
    eCodes: []
  },
  '6412000031336': {
    id: '6412000031336',
    name: 'HK Sininen Lenkki',
    brand: 'HK',
    description: 'Classic Finnish sausage',
    ingredients: 'Pork, water, beef, potato starch, salt, spices, stabilizers (E450, E451), antioxidant (E315), preservative (E250)',
    badges: ['Meat Product'],
    nutrition: {
      calories: '230 kcal',
      fat: '19 g',
      carbohydrates: '4 g',
      protein: '11 g',
      salt: '1.8 g'
    },
    macros: {
      protein: '11g',
      fat: '19g',
      carbs: '4g'
    },
    eCodes: [
      { code: 'E450', name: 'Diphosphates', warning: false },
      { code: 'E451', name: 'Triphosphates', warning: false },
      { code: 'E315', name: 'Erythorbic acid', warning: false },
      { code: 'E250', name: 'Sodium nitrite', warning: true }
    ]
  }
};

export const getProductByBarcode = async (barcode) => {
  try {
    // In a real app, this would call the actual API
    // For this demo, we'll use mock data if available, or try the API if not
    
    if (MOCK_PRODUCTS[barcode]) {
      // Return mock data for development
      return MOCK_PRODUCTS[barcode];
    }
    
    // Try to get data from Open Food Facts API
    const productData = await fetchBarcodeData(barcode);
    
    if (!productData) {
      return null;
    }
    
    // Transform the API response into our app's product format
    return transformProductData(productData, barcode);
  } catch (error) {
    console.error('Error getting product by barcode:', error);
    return null;
  }
};

export const searchProducts = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return [];
    }
    
    // For demo purposes, search through mock products
    const results = Object.values(MOCK_PRODUCTS).filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length > 0) {
      return results;
    }
    
    // Call the actual API if needed
    const response = await axios.get(`${API_URL}/search?search_terms=${query}&json=1`);
    
    if (!response.data.products || response.data.products.length === 0) {
      return [];
    }
    
    // Transform the API products into our app's format
    return response.data.products.map(product => transformProductData(product));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

const transformProductData = (apiProduct, barcode = null) => {
  if (!apiProduct) return null;
  
  // Extract e-codes from ingredients
  const eCodes = extractECodes(apiProduct.ingredients_text || '');
  
  return {
    id: barcode || apiProduct.code || apiProduct._id,
    name: apiProduct.product_name || 'Unknown Product',
    brand: apiProduct.brands || 'Unknown Brand',
    description: apiProduct.generic_name || '',
    ingredients: apiProduct.ingredients_text || 'Ingredients not available',
    badges: extractBadges(apiProduct),
    nutrition: {
      calories: extractNutrient(apiProduct, 'energy-kcal') || 'N/A',
      fat: extractNutrient(apiProduct, 'fat') || 'N/A',
      carbohydrates: extractNutrient(apiProduct, 'carbohydrates') || 'N/A',
      protein: extractNutrient(apiProduct, 'proteins') || 'N/A',
      salt: extractNutrient(apiProduct, 'salt') || 'N/A',
      sugar: extractNutrient(apiProduct, 'sugars') || 'N/A',
      fiber: extractNutrient(apiProduct, 'fiber') || 'N/A'
    },
    macros: {
      protein: extractNutrient(apiProduct, 'proteins') || 'N/A',
      fat: extractNutrient(apiProduct, 'fat') || 'N/A',
      carbs: extractNutrient(apiProduct, 'carbohydrates') || 'N/A'
    },
    eCodes: eCodes
  };
};

const extractNutrient = (product, nutrientKey) => {
  if (!product.nutriments) return null;
  
  const value = product.nutriments[nutrientKey];
  const unit = product.nutriments[`${nutrientKey}_unit`] || 'g';
  
  if (value === undefined) return null;
  
  return `${value} ${unit}`;
};

const extractBadges = (product) => {
  const badges = [];
  
  if (product.labels_tags) {
    // Convert labels from format like "en:organic" to just "Organic"
    product.labels_tags.forEach(label => {
      const parts = label.split(':');
      const badgeName = parts[parts.length - 1].replace(/-/g, ' ');
      badges.push(badgeName.charAt(0).toUpperCase() + badgeName.slice(1));
    });
  }
  
  // Add diet badges
  if (product.ingredients_analysis_tags) {
    if (product.ingredients_analysis_tags.includes('en:vegan')) {
      badges.push('Vegan');
    } else if (product.ingredients_analysis_tags.includes('en:vegetarian')) {
      badges.push('Vegetarian');
    }
  }
  
  return badges.slice(0, 3); // Limit to 3 badges
};

const extractECodes = (ingredientsText) => {
  const eCodes = [];
  const eCodeRegex = /E(\d{3})([a-z])?/gi;
  
  let match;
  while ((match = eCodeRegex.exec(ingredientsText)) !== null) {
    const eCode = match[0].toUpperCase();
    
    // Check if this E-code is already added
    if (!eCodes.some(e => e.code === eCode)) {
      const eCodeInfo = getECodeInfo(eCode);
      eCodes.push({
        code: eCode,
        name: eCodeInfo.name,
        warning: eCodeInfo.warning
      });
    }
  }
  
  return eCodes;
};

const getECodeInfo = (eCode) => {
  // This is a simplified list of E-codes - in a real app this would be more comprehensive
  const eCodesDatabase = {
    'E100': { name: 'Curcumin (Turmeric)', warning: false },
    'E101': { name: 'Riboflavin (Vitamin B2)', warning: false },
    'E102': { name: 'Tartrazine', warning: true },
    'E104': { name: 'Quinoline Yellow', warning: true },
    'E110': { name: 'Sunset Yellow FCF', warning: true },
    'E120': { name: 'Cochineal', warning: false },
    'E122': { name: 'Azorubine', warning: true },
    'E124': { name: 'Ponceau 4R', warning: true },
    'E127': { name: 'Erythrosine', warning: true },
    'E129': { name: 'Allura Red AC', warning: true },
    'E131': { name: 'Patent Blue V', warning: true },
    'E132': { name: 'Indigo Carmine', warning: false },
    'E133': { name: 'Brilliant Blue FCF', warning: false },
    'E140': { name: 'Chlorophylls', warning: false },
    'E150A': { name: 'Plain Caramel', warning: false },
    'E150B': { name: 'Caustic Sulphite Caramel', warning: false },
    'E150C': { name: 'Ammonia Caramel', warning: false },
    'E150D': { name: 'Sulphite Ammonia Caramel', warning: false },
    'E160A': { name: 'Alpha-carotene', warning: false },
    'E160B': { name: 'Annatto', warning: false },
    'E160C': { name: 'Paprika Extract', warning: false },
    'E160D': { name: 'Lycopene', warning: false },
    'E160E': { name: 'Beta-apo-8′-carotenal', warning: false },
    'E161B': { name: 'Lutein', warning: false },
    'E162': { name: 'Beetroot Red', warning: false },
    'E163': { name: 'Anthocyanins', warning: false },
    'E170': { name: 'Calcium Carbonate', warning: false },
    'E171': { name: 'Titanium Dioxide', warning: true },
    'E172': { name: 'Iron Oxides and Hydroxides', warning: false },
    'E173': { name: 'Aluminium', warning: true },
    'E174': { name: 'Silver', warning: true },
    'E175': { name: 'Gold', warning: true },
    'E200': { name: 'Sorbic Acid', warning: false },
    'E202': { name: 'Potassium Sorbate', warning: false },
    'E210': { name: 'Benzoic Acid', warning: true },
    'E211': { name: 'Sodium Benzoate', warning: true },
    'E213': { name: 'Calcium Benzoate', warning: true },
    'E214': { name: 'Ethyl Para-hydroxybenzoate', warning: true },
    'E215': { name: 'Sodium Ethyl Para-hydroxybenzoate', warning: true },
    'E219': { name: 'Sodium Methyl Para-hydroxybenzoate', warning: true },
    'E220': { name: 'Sulphur Dioxide', warning: true },
    'E221': { name: 'Sodium Sulphite', warning: true },
    'E223': { name: 'Sodium Metabisulphite', warning: true },
    'E224': { name: 'Potassium Metabisulphite', warning: true },
    'E227': { name: 'Calcium Hydrogen Sulphite', warning: true },
    'E228': { name: 'Potassium Hydrogen Sulphite', warning: true },
    'E234': { name: 'Nisin', warning: false },
    'E235': { name: 'Natamycin', warning: false },
    'E249': { name: 'Potassium Nitrite', warning: true },
    'E250': { name: 'Sodium Nitrite', warning: true },
    'E251': { name: 'Sodium Nitrate', warning: true },
    'E252': { name: 'Potassium Nitrate', warning: true },
    'E300': { name: 'Ascorbic Acid (Vitamin C)', warning: false },
    'E301': { name: 'Sodium Ascorbate', warning: false },
    'E302': { name: 'Calcium Ascorbate', warning: false },
    'E304': { name: 'Fatty Acid Esters of Ascorbic Acid', warning: false },
    'E306': { name: 'Tocopherol-rich Extract', warning: false },
    'E307': { name: 'Alpha-tocopherol', warning: false },
    'E308': { name: 'Gamma-tocopherol', warning: false },
    'E309': { name: 'Delta-tocopherol', warning: false },
    'E310': { name: 'Propyl Gallate', warning: true },
    'E311': { name: 'Octyl Gallate', warning: true },
    'E312': { name: 'Dodecyl Gallate', warning: true },
    'E315': { name: 'Erythorbic Acid', warning: false },
    'E316': { name: 'Sodium Erythorbate', warning: false },
    'E319': { name: 'Tertiary-butyl Hydroquinone (TBHQ)', warning: true },
    'E320': { name: 'Butylated Hydroxyanisole (BHA)', warning: true },
    'E321': { name: 'Butylated Hydroxytoluene (BHT)', warning: true },
    'E322': { name: 'Lecithins', warning: false },
    'E330': { name: 'Citric Acid', warning: false },
    'E331': { name: 'Sodium Citrates', warning: false },
    'E332': { name: 'Potassium Citrates', warning: false },
    'E333': { name: 'Calcium Citrates', warning: false },
    'E334': { name: 'Tartaric Acid (L(+)-)', warning: false },
    'E335': { name: 'Sodium Tartrates', warning: false },
    'E336': { name: 'Potassium Tartrates', warning: false },
    'E337': { name: 'Sodium Potassium Tartrate', warning: false },
    'E338': { name: 'Phosphoric Acid', warning: false },
    'E339': { name: 'Sodium Phosphates', warning: false },
    'E340': { name: 'Potassium Phosphates', warning: false },
    'E341': { name: 'Calcium Phosphates', warning: false },
    'E343': { name: 'Magnesium Phosphates', warning: false },
    'E350': { name: 'Sodium Malates', warning: false },
    'E351': { name: 'Potassium Malate', warning: false },
    'E352': { name: 'Calcium Malates', warning: false },
    'E354': { name: 'Calcium Tartrate', warning: false },
    'E355': { name: 'Adipic Acid', warning: false },
    'E356': { name: 'Sodium Adipate', warning: false },
    'E357': { name: 'Potassium Adipate', warning: false },
    'E363': { name: 'Succinic Acid', warning: false },
    'E380': { name: 'Triammonium Citrate', warning: false },
    'E385': { name: 'Calcium Disodium Ethylene Diamine Tetra-acetate', warning: true },
    'E392': { name: 'Extracts of Rosemary', warning: false },
    'E400': { name: 'Alginic Acid', warning: false },
    'E401': { name: 'Sodium Alginate', warning: false },
    'E402': { name: 'Potassium Alginate', warning: false },
    'E403': { name: 'Ammonium Alginate', warning: false },
    'E404': { name: 'Calcium Alginate', warning: false },
    'E405': { name: 'Propane-1,2-diol Alginate', warning: false },
    'E406': { name: 'Agar', warning: false },
    'E407': { name: 'Carrageenan', warning: false },
    'E407A': { name: 'Processed Eucheuma Seaweed', warning: false },
    'E410': { name: 'Locust Bean Gum', warning: false },
    'E412': { name: 'Guar Gum', warning: false },
    'E413': { name: 'Tragacanth', warning: false },
    'E414': { name: 'Acacia Gum (Gum Arabic)', warning: false },
    'E415': { name: 'Xanthan Gum', warning: false },
    'E416': { name: 'Karaya Gum', warning: false },
    'E417': { name: 'Tara Gum', warning: false },
    'E418': { name: 'Gellan Gum', warning: false },
    'E422': { name: 'Glycerol', warning: false },
    'E440': { name: 'Pectins', warning: false },
    'E442': { name: 'Ammonium Phosphatides', warning: false },
    'E444': { name: 'Sucrose Acetate Isobutyrate', warning: false },
    'E445': { name: 'Glycerol Esters of Wood Rosins', warning: false },
    'E450': { name: 'Diphosphates', warning: false },
    'E451': { name: 'Triphosphates', warning: false },
    'E452': { name: 'Polyphosphates', warning: false },
    'E460': { name: 'Cellulose', warning: false },
    'E461': { name: 'Methyl Cellulose', warning: false },
    'E462': { name: 'Ethyl Cellulose', warning: false },
    'E463': { name: 'Hydroxypropyl Cellulose', warning: false },
    'E464': { name: 'Hydroxypropyl Methyl Cellulose', warning: false },
    'E465': { name: 'Ethyl Methyl Cellulose', warning: false },
    'E466': { name: 'Sodium Carboxy Methyl Cellulose', warning: false },
    'E470A': { name: 'Sodium, Potassium and Calcium Salts of Fatty Acids', warning: false },
    'E470B': { name: 'Magnesium Salts of Fatty Acids', warning: false },
    'E471': { name: 'Mono- and Diglycerides of Fatty Acids', warning: false },
    'E472A': { name: 'Acetic Acid Esters of Mono- and Diglycerides of Fatty Acids', warning: false },
    'E472B': { name: 'Lactic Acid Esters of Mono- and Diglycerides of Fatty Acids', warning: false },
    'E472C': { name: 'Citric Acid Esters of Mono- and Diglycerides of Fatty Acids', warning: false },
    'E472D': { name: 'Tartaric Acid Esters of Mono- and Diglycerides of Fatty Acids', warning: false },
    'E472E': { name: 'Mono- and Diacetyl Tartaric Acid Esters of Mono- and Diglycerides of Fatty Acids', warning: false },
    'E472F': { name: 'Mixed Acetic and Tartaric Acid Esters of Mono- and Diglycerides of Fatty Acids', warning: false },
    'E473': { name: 'Sucrose Esters of Fatty Acids', warning: false },
    'E474': { name: 'Sucroglycerides', warning: false },
    'E475': { name: 'Polyglycerol Esters of Fatty Acids', warning: false },
    'E476': { name: 'Polyglycerol Polyricinoleate', warning: false },
    'E477': { name: 'Propane-1,2-diol Esters of Fatty Acids', warning: false },
    'E481': { name: 'Sodium Stearoyl-2-lactylate', warning: false },
    'E482': { name: 'Calcium Stearoyl-2-lactylate', warning: false },
    'E483': { name: 'Stearyl Tartrate', warning: false },
    'E491': { name: 'Sorbitan Monostearate', warning: false },
    'E492': { name: 'Sorbitan Tristearate', warning: false },
    'E493': { name: 'Sorbitan Monolaurate', warning: false },
    'E494': { name: 'Sorbitan Monooleate', warning: false },
    'E495': { name: 'Sorbitan Monopalmitate', warning: false },
    'E500': { name: 'Sodium Carbonates', warning: false },
    'E501': { name: 'Potassium Carbonates', warning: false },
    'E503': { name: 'Ammonium Carbonates', warning: false },
    'E504': { name: 'Magnesium Carbonates', warning: false },
    'E507': { name: 'Hydrochloric Acid', warning: false },
    'E508': { name: 'Potassium Chloride', warning: false },
    'E509': { name: 'Calcium Chloride', warning: false },
    'E511': { name: 'Magnesium Chloride', warning: false },
    'E512': { name: 'Stannous Chloride', warning: false },
    'E513': { name: 'Sulphuric Acid', warning: false },
    'E514': { name: 'Sodium Sulphates', warning: false },
    'E515': { name: 'Potassium Sulphates', warning: false },
    'E516': { name: 'Calcium Sulphate', warning: false },
    'E517': { name: 'Ammonium Sulphate', warning: false },
    'E520': { name: 'Aluminium Sulphate', warning: true },
    'E521': { name: 'Aluminium Sodium Sulphate', warning: true },
    'E522': { name: 'Aluminium Potassium Sulphate', warning: true },
    'E523': { name: 'Aluminium Ammonium Sulphate', warning: true },
    'E524': { name: 'Sodium Hydroxide', warning: false },
    'E525': { name: 'Potassium Hydroxide', warning: false },
    'E526': { name: 'Calcium Hydroxide', warning: false },
    'E527': { name: 'Ammonium Hydroxide', warning: false },
    'E528': { name: 'Magnesium Hydroxide', warning: false },
    'E529': { name: 'Calcium Oxide', warning: false },
    'E530': { name: 'Magnesium Oxide', warning: false },
    'E535': { name: 'Sodium Ferrocyanide', warning: true },
    'E536': { name: 'Potassium Ferrocyanide', warning: true },
    'E538': { name: 'Calcium Ferrocyanide', warning: true },
    'E541': { name: 'Sodium Aluminium Phosphate', warning: true },
    'E551': { name: 'Silicon Dioxide', warning: false },
    'E552': { name: 'Calcium Silicate', warning: false },
    'E553A': { name: 'Magnesium Silicate', warning: false },
    'E553B': { name: 'Talc', warning: true },
    'E570': { name: 'Fatty Acids', warning: false },
    'E574': { name: 'Gluconic Acid', warning: false },
    'E575': { name: 'Glucono-delta-lactone', warning: false },
    'E576': { name: 'Sodium Gluconate', warning: false },
    'E577': { name: 'Potassium Gluconate', warning: false },
    'E578': { name: 'Calcium Gluconate', warning: false }
  };
  
  // Return info if found, or a default if not found
  return eCodesDatabase[eCode] || { name: 'Unknown additive', warning: false };
};
