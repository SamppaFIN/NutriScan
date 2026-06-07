/**
 * i18n — Localization module for NutriScan
 * Default language: Finnish (fi)
 * Detects browser language, falls back to fi
 */

const i18n = {
  lang: 'fi',
  strings: {},

  init() {
    const browserLang = (navigator.language || navigator.userLanguage || 'fi').split('-')[0];
    this.lang = ['fi', 'en'].includes(browserLang) ? browserLang : 'fi';
    console.log(`🌐 i18n: using language "${this.lang}" (browser: ${browserLang})`);
    return this.lang;
  },

  t(key, ...args) {
    let str = this.strings[this.lang]?.[key] || this.strings['en']?.[key] || key;
    args.forEach((arg, i) => { str = str.replace(`{${i}}`, arg); });
    return str;
  },

  strings: {
    fi: {
      // App
      appName: 'NutriScan',
      tagline: 'Skannaa. Tiedä. Syö turvallisesti.',
      taglineSub: 'Välittömät allergeeni- ja ravintotiedot Open Food Factsista.',

      // Top bar / Menu
      menu: 'Valikko',
      home: 'Etusivu',
      cameraScan: 'Kameraskannaus',
      uploadImage: 'Lataa kuva',
      barcodeLookup: 'Viivakoodihaku',
      manualEntry: 'Syötä tiedot',
      allergenBank: 'Allergeenipankki',
      recipeBank: 'Reseptipankki',
      features: 'Ominaisuudet',
      about: 'Tietoja',
      settings: 'Asetukset',

      // Method selector
      camera: 'Kamera',
      upload: 'Lataa',
      barcode: 'Viivakoodi',
      manual: 'Käsin',

      // Camera
      tapToStart: 'Aloita napauttamalla',
      capture: 'Ota kuva',
      retake: 'Uusi kuva',
      analyze: 'Analysoi',

      // Upload
      uploadTitle: 'Lataa kuva',
      tapOrDrop: 'Napauta tai pudota kuva tähän',
      analyzeImage: 'Analysoi kuva',

      // Barcode
      barcodeTitle: 'Viivakoodi',
      enterBarcode: 'Syötä viivakoodinumero…',
      lookUp: 'Hae',
      orText: '— tai —',
      scanWithCamera: 'Skannaa kameralla',
      productNotFound: 'Tuotetta ei löytynyt',
      productNotFoundDesc: 'Tuotetta viivakoodilla {0} ei löytynyt.',
      notInDb: 'Tuote ei ehkä ole vielä Open Food Facts -tietokannassa.',
      addToOff: 'Lisää Open Food Factsiin',
      enterManually: 'Syötä käsin',
      scanAgain: 'Skannaa uudelleen',

      // Manual
      manualTitle: 'Syötä tuotteen tiedot',
      barcodeOptional: 'Viivakoodi (valinnainen)',
      productName: 'Tuotteen nimi',
      brand: 'Valmistaja',
      ingredients: 'Ainesosat (pilkuilla erotettuna)',
      submit: 'Lähetä',

      // Product details
      overview: 'Yleisnäkymä',
      allergens: 'Allergeenit',
      eNumbers: 'E-Numerot',
      brandLabel: 'Valmistaja',
      origin: 'Alkuperä',
      ingredientsLabel: 'Ainesosat',
      identifiedAllergens: 'Tunnistetut allergeenit',
      identifiedENumbers: 'Tunnistetut E-numerot',
      nutritionalValues: 'Ravintosisältö',
      calories: 'Kalorit',
      protein: 'Proteiini',
      carbohydrates: 'Hiilihydraatit',
      fat: 'Rasva',
      getRecipeSuggestions: 'Hae reseptiehdotukset',
      suggestedRecipes: '🍳 Reseptiehdotukset',
      loading: 'Haetaan tuotetta…',
      loadingRecipes: 'Ladataan reseptejä…',
      noAllergens: 'Ei tunnistettuja allergeeneja tässä tuotteessa.',
      noECodes: 'Ei E-numeroita tässä tuotteessa.',
      noRecipes: 'Ei reseptejä tälle tuotteelle.',
      noRecipesFound: 'Reseptejä ei löytynyt. Kokeile toista hakusanaa.',
      recipeSourcesUnavailable: 'Reseptilähteet eivät ole käytettävissä. Aseta API-avaimet asetuksissa.',

      // Allergen details
      symptoms: 'Oireet',
      mild: 'Lievät',
      moderate: 'Kohtalaiset',
      severe: 'Vakavat',
      foundIn: 'Löytyy',
      onset: 'Tyypillinen alkamisaika',

      // E-code details
      category: 'Kategoria',
      eOrigin: 'Alkuperä',
      eFunction: 'Käyttötarkoitus',
      highRisk: '⚠️ Korkea riski',
      mediumRisk: 'Kohtalainen riski',
      safeAdditive: '✓ Turvallinen',

      // Recipe Bank
      recipeBankTitle: '🍳 Reseptipankki',
      recipeBankDesc: 'Selaa reseptejä useista lähteistä. Syötä tuotteen nimi löytääksesi reseptejä.',
      searchRecipes: 'Hae reseptejä…',
      search: 'Hae',
      quickPicks: '📌 Pikavalinnat',
      availableSources: 'Saatavilla olevat lähteet',
      servings: 'annosta',
      prepTime: 'Valmistusaika',

      // Features
      featuresTitle: '✨ Ominaisuudet',
      scanMethods: '🔍 Skannausmenetelmät',
      allergenDetection: '⚠️ Allergeenien tunnistus',
      eNumbersTracked: '🧪 Seuratut E-numerot',
      recipeSuggestions: '🍳 Reseptiehdotukset',
      poweredBy: 'Palvelun tarjoaa',

      // Toasts
      cameraPermission: 'Kameraa ei voitu käyttää. Tarkista käyttöoikeudet.',
      selectValidImage: 'Valitse kelvollinen kuvatiedosto.',
      enterBarcodeNumber: 'Syötä viivakoodinumero.',
      fillAllFields: 'Täytä kaikki pakolliset kentät.',
      errorAnalyzing: 'Kuvan analysointi epäonnistui. Yritä uudelleen.',
      enterApiName: 'Syötä vähintään API:n nimi ja URL.',
      apiAdded: 'Mukautettu API "{0}" lisätty!',
      settingsSaved: 'Asetukset tallennettu!',
      settingsFailed: 'Asetusten tallennus epäonnistui. Yritä uudelleen.',
      aboutText: 'NutriScan — Välitön elintarvikeskanneri. Käyttää Open Food Facts -tietokantaa. GitHub Pages -isännöity. Ei vaadi API-avaimia.',
    },

    en: {
      appName: 'NutriScan',
      tagline: 'Scan. Know. Eat safely.',
      taglineSub: 'Instant allergen & nutrition info from Open Food Facts.',

      menu: 'Menu',
      home: 'Home',
      cameraScan: 'Camera Scan',
      uploadImage: 'Upload Image',
      barcodeLookup: 'Barcode Lookup',
      manualEntry: 'Manual Entry',
      allergenBank: 'Allergen Bank',
      recipeBank: 'Recipe Bank',
      features: 'Features',
      about: 'About',
      settings: 'Settings',

      camera: 'Camera',
      upload: 'Upload',
      barcode: 'Barcode',
      manual: 'Manual',

      tapToStart: 'Tap to start camera',
      capture: 'Capture',
      retake: 'Retake',
      analyze: 'Analyze',

      uploadTitle: 'Upload Image',
      tapOrDrop: 'Tap or drop image here',
      analyzeImage: 'Analyze Image',

      barcodeTitle: 'Barcode',
      enterBarcode: 'Enter barcode number…',
      lookUp: 'Look Up',
      orText: '— or —',
      scanWithCamera: 'Scan with Camera',
      productNotFound: 'Product Not Found',
      productNotFoundDesc: 'We couldn\'t find a product with barcode: {0}.',
      notInDb: 'The product may not yet be in the Open Food Facts database.',
      addToOff: 'Add to Open Food Facts',
      enterManually: 'Enter Manually',
      scanAgain: 'Scan Again',

      manualTitle: 'Manual Entry',
      barcodeOptional: 'Barcode (optional)',
      productName: 'Product name',
      brand: 'Brand',
      ingredients: 'Ingredients (comma separated)',
      submit: 'Submit',

      overview: 'Overview',
      allergens: 'Allergens',
      eNumbers: 'E-Numbers',
      brandLabel: 'Brand',
      origin: 'Origin',
      ingredientsLabel: 'Ingredients',
      identifiedAllergens: 'Identified Allergens',
      identifiedENumbers: 'Identified E-Numbers',
      nutritionalValues: 'Nutritional Values',
      calories: 'Calories',
      protein: 'Protein',
      carbohydrates: 'Carbohydrates',
      fat: 'Fat',
      getRecipeSuggestions: 'Get Recipe Suggestions',
      suggestedRecipes: '🍳 Suggested Recipes',
      loading: 'Looking up product…',
      loadingRecipes: 'Loading recipes…',
      noAllergens: 'No allergens detected in this product.',
      noECodes: 'No E-numbers detected in this product.',
      noRecipes: 'No recipes found for this product.',
      noRecipesFound: 'No recipes found. Try a different search term.',
      recipeSourcesUnavailable: 'Recipe sources not available. Set API keys in Settings.',

      symptoms: 'Symptoms',
      mild: 'Mild',
      moderate: 'Moderate',
      severe: 'Severe',
      foundIn: 'Found in',
      onset: 'Typical onset',

      category: 'Category',
      eOrigin: 'Origin',
      eFunction: 'Function',
      highRisk: '⚠️ High Risk',
      mediumRisk: 'Moderate Risk',
      safeAdditive: '✓ Safe',

      recipeBankTitle: '🍳 Recipe Bank',
      recipeBankDesc: 'Browse recipes from multiple sources. Enter a product name to find matching recipes.',
      searchRecipes: 'Search recipes…',
      search: 'Search',
      quickPicks: '📌 Quick Picks',
      availableSources: 'Available Sources',
      servings: 'servings',
      prepTime: 'Prep Time',

      featuresTitle: '✨ Features',
      scanMethods: '🔍 Scan Methods',
      allergenDetection: '⚠️ Allergen Detection',
      eNumbersTracked: '🧪 E-Numbers Tracked',
      recipeSuggestions: '🍳 Recipe Suggestions',
      poweredBy: 'Powered by',

      cameraPermission: 'Could not access camera. Check permissions.',
      selectValidImage: 'Please select a valid image file.',
      enterBarcodeNumber: 'Please enter a barcode number.',
      fillAllFields: 'Please fill out all required fields.',
      errorAnalyzing: 'Error analyzing image. Please try again.',
      enterApiName: 'Please enter at least API name and URL.',
      apiAdded: 'Custom API "{0}" added successfully!',
      settingsSaved: 'Settings saved successfully!',
      settingsFailed: 'Failed to save settings. Please try again.',
      aboutText: 'NutriScan — Instant food product scanner. Uses Open Food Facts database. GitHub Pages hosted. No API keys needed.',
    }
  }
};

// Auto-init
i18n.init();

// Export globally
window.i18n = i18n;
window.t = (key, ...args) => i18n.t(key, ...args);
