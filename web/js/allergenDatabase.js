/**
 * Comprehensive database of common food allergens,
 * their symptoms, and severity levels
 */

const allergenDatabase = {
  // Milk allergy (not the same as lactose intolerance)
  "milk": {
    name: "Milk",
    description: "An immune system reaction to proteins in cow's milk",
    commonIn: [
      "Dairy products", "Butter", "Cheese", "Cream", "Yogurt", 
      "Ice cream", "Pudding", "Custard", "Some processed meats",
      "Many baked goods"
    ],
    symptoms: {
      mild: [
        "Hives", "Itching around the lips or mouth", "Mild swelling",
        "Runny nose", "Sneezing", "Watery eyes"
      ],
      moderate: [
        "Abdominal cramps", "Diarrhea", "Nausea", "Vomiting",
        "Coughing", "Wheezing"
      ],
      severe: [
        "Difficulty breathing", "Swelling of the throat", "Anaphylaxis",
        "Loss of consciousness"
      ]
    },
    onsetTime: "Usually within minutes to 2 hours after consumption",
    crossReactivity: ["Goat's milk", "Sheep's milk"],
    notes: "Different from lactose intolerance, which is an inability to digest lactose sugar rather than an immune response to milk proteins"
  },
  
  // Wheat
  "wheat": {
    name: "Wheat",
    description: "An immune system reaction to proteins found in wheat",
    commonIn: [
      "Bread", "Pasta", "Cereals", "Flour", "Baked goods",
      "Many processed foods", "Soy sauce", "Beer", "Some cosmetics"
    ],
    symptoms: {
      mild: [
        "Hives", "Itching", "Swelling of the lips and tongue",
        "Nasal congestion", "Headache", "Atopic dermatitis"
      ],
      moderate: [
        "Abdominal cramps", "Diarrhea", "Nausea", "Vomiting",
        "Asthma symptoms"
      ],
      severe: [
        "Anaphylaxis", "Exercise-induced anaphylaxis",
        "Anxiety", "Confusion", "Difficulty swallowing"
      ]
    },
    onsetTime: "Minutes to hours after consumption",
    crossReactivity: ["Barley", "Rye", "Oats (due to processing contamination)"],
    notes: "Different from celiac disease, which is an autoimmune disorder triggered by gluten"
  },
  
  // Eggs
  "egg": {
    name: "Egg",
    description: "An immune system reaction to proteins in eggs, particularly egg whites",
    commonIn: [
      "Baked goods", "Pasta", "Some processed meats", "Mayonnaise",
      "Marshmallows", "Frostings", "Some vaccines", "Some medications"
    ],
    symptoms: {
      mild: [
        "Skin rash", "Hives", "Nasal congestion", "Runny nose",
        "Sneezing", "Red or watery eyes"
      ],
      moderate: [
        "Digestive problems", "Cramps", "Nausea", "Vomiting",
        "Coughing", "Wheezing"
      ],
      severe: [
        "Chest tightness", "Difficulty breathing", "Swelling of the throat",
        "Anaphylaxis", "Drop in blood pressure"
      ]
    },
    onsetTime: "Usually within minutes to a few hours after consumption",
    crossReactivity: ["Chicken meat (less common)"],
    notes: "Some people allergic to eggs can tolerate well-cooked eggs in baked goods but not lightly cooked eggs"
  },
  
  // Peanuts
  "peanut": {
    name: "Peanut",
    description: "An immune system reaction to proteins in peanuts, a legume",
    commonIn: [
      "Peanut butter", "Mixed nuts", "Many baked goods", "Candy",
      "Some Asian cuisine", "Some vegetarian meat substitutes",
      "Some sauces and marinades"
    ],
    symptoms: {
      mild: [
        "Skin reactions", "Hives", "Redness", "Itching around the mouth"
      ],
      moderate: [
        "Runny nose", "Stomach cramps", "Nausea", "Vomiting",
        "Shortness of breath", "Wheezing"
      ],
      severe: [
        "Constricted airways", "Swollen throat", "Rapid pulse",
        "Drop in blood pressure", "Dizziness", "Anaphylaxis",
        "Loss of consciousness"
      ]
    },
    onsetTime: "Usually within minutes after exposure",
    crossReactivity: ["Other legumes", "Tree nuts (in some cases)"],
    notes: "One of the most common causes of severe food allergic reactions; even small amounts can cause a reaction"
  },
  
  // Tree nuts
  "nuts": {
    name: "Tree Nuts",
    description: "An immune system reaction to proteins in tree nuts",
    commonIn: [
      "Almonds", "Walnuts", "Cashews", "Pistachios", "Hazelnuts",
      "Nut oils", "Nut butters", "Many baked goods", "Cereals",
      "Some cosmetics and lotions"
    ],
    symptoms: {
      mild: [
        "Abdominal pain", "Cramps", "Nausea", "Vomiting",
        "Hives", "Itching"
      ],
      moderate: [
        "Difficulty swallowing", "Shortness of breath", "Nasal congestion",
        "Itchy, watery eyes"
      ],
      severe: [
        "Swelling of the throat", "Severe drop in blood pressure",
        "Dizziness", "Lightheadedness", "Anaphylaxis",
        "Loss of consciousness"
      ]
    },
    onsetTime: "Usually within minutes after consumption",
    crossReactivity: ["Other tree nuts", "Peanuts (in some cases)"],
    notes: "People can be allergic to just one type of tree nut or to many; generally advised to avoid all tree nuts if allergic to one"
  },
  
  // Fish
  "fish": {
    name: "Fish",
    description: "An immune system reaction to proteins in fish",
    commonIn: [
      "All fish varieties", "Fish sauce", "Caesar dressing",
      "Worcestershire sauce", "Some Asian cuisines",
      "Omega-3 supplements", "Some fertilizers"
    ],
    symptoms: {
      mild: [
        "Hives", "Skin rash", "Nasal congestion", "Runny nose",
        "Sneezing", "Itchy, watery eyes"
      ],
      moderate: [
        "Digestive issues", "Nausea", "Stomach cramps", "Indigestion",
        "Headaches", "Asthma symptoms"
      ],
      severe: [
        "Swelling of the lips, tongue, or throat", "Difficulty breathing",
        "Drop in blood pressure", "Dizziness", "Anaphylaxis"
      ]
    },
    onsetTime: "Usually within minutes to an hour after consumption",
    crossReactivity: ["Other fish species (often)", "Shellfish (sometimes)"],
    notes: "Fish allergy often persists throughout life; cooking fish can release proteins into the air, causing reactions in some highly sensitive individuals"
  },
  
  // Shellfish
  "shellfish": {
    name: "Shellfish",
    description: "An immune system reaction to proteins in shellfish",
    commonIn: [
      "Shrimp", "Crab", "Lobster", "Clams", "Oysters", "Mussels",
      "Fish sauce", "Some Asian cuisines", "Some vitamin supplements"
    ],
    symptoms: {
      mild: [
        "Hives", "Itching", "Eczema", "Redness of the skin",
        "Nasal congestion", "Runny nose"
      ],
      moderate: [
        "Abdominal pain", "Diarrhea", "Nausea", "Vomiting",
        "Headache", "Lightheadedness"
      ],
      severe: [
        "Constriction of airways", "Swelling of the throat", 
        "Rapid pulse", "Drop in blood pressure", "Dizziness",
        "Loss of consciousness", "Anaphylaxis"
      ]
    },
    onsetTime: "Usually within minutes after consumption or exposure",
    crossReactivity: ["Different types of shellfish", "Rarely with fish"],
    notes: "One of the most common food allergies in adults; cooking vapors can cause reactions in highly sensitive individuals"
  },
  
  // Soy
  "soy": {
    name: "Soy",
    description: "An immune system reaction to proteins in soybeans",
    commonIn: [
      "Tofu", "Soy milk", "Soy sauce", "Edamame", "Tempeh", 
      "Many processed foods", "Vegetable oil", "Vegetable shortening",
      "Some infant formulas"
    ],
    symptoms: {
      mild: [
        "Tingling in the mouth", "Hives", "Itching", "Eczema",
        "Skin redness"
      ],
      moderate: [
        "Abdominal pain", "Diarrhea", "Nausea", "Vomiting",
        "Runny nose", "Wheezing", "Asthma"
      ],
      severe: [
        "Difficulty breathing", "Drop in blood pressure", 
        "Rapid pulse", "Dizziness", "Anaphylaxis"
      ]
    },
    onsetTime: "Usually within minutes to a few hours after consumption",
    crossReactivity: ["Other legumes", "Peanuts"],
    notes: "Many children outgrow soy allergies; highly refined soy oil is generally considered safe for most people with soy allergy"
  },
  
  // Gluten (special case)
  "gluten": {
    name: "Gluten",
    description: "A protein found in wheat, barley, and rye that causes immune reactions in some individuals",
    commonIn: [
      "Bread", "Pasta", "Cereals", "Baked goods", "Beer",
      "Many processed foods", "Some medications", "Some supplements",
      "Some cosmetics"
    ],
    symptoms: {
      celiacDisease: [
        "Diarrhea", "Abdominal pain", "Bloating", "Gas", 
        "Weight loss", "Fatigue", "Anemia", "Headaches",
        "Joint pain", "Dermatitis herpetiformis (skin rash)"
      ],
      nonCeliacSensitivity: [
        "Abdominal pain", "Bloating", "Diarrhea", "Constipation",
        "Headaches", "Fatigue", "Brain fog", "Depression", 
        "Joint pain", "Numbness in legs, arms or fingers"
      ],
      wheatAllergy: [
        "Swelling, itching or irritation of the mouth or throat",
        "Hives", "Nasal congestion", "Difficulty breathing",
        "Cramps", "Nausea", "Vomiting", "Diarrhea", "Anaphylaxis"
      ]
    },
    onsetTime: "Varies widely: minutes for wheat allergy; hours to days for celiac disease and non-celiac gluten sensitivity",
    crossReactivity: ["Wheat", "Barley", "Rye", "Triticale"],
    notes: "Not a traditional allergy but an autoimmune disorder (celiac) or sensitivity; requires complete avoidance for those with celiac disease"
  },
  
  // Sesame
  "sesame": {
    name: "Sesame",
    description: "An immune system reaction to proteins in sesame seeds",
    commonIn: [
      "Sesame seeds", "Tahini", "Hummus", "Halva", "Baked goods with seeds",
      "Some Asian and Middle Eastern cuisines", "Some oils and dressings"
    ],
    symptoms: {
      mild: [
        "Itchy mouth", "Hives", "Itchy eyes", "Eczema", 
        "Runny or blocked nose"
      ],
      moderate: [
        "Swelling in the face or throat", "Difficulty swallowing",
        "Abdominal pain", "Nausea", "Vomiting", "Diarrhea"
      ],
      severe: [
        "Wheezing", "Difficulty breathing", "Drop in blood pressure", 
        "Rapid heartbeat", "Dizziness", "Confusion", "Anaphylaxis"
      ]
    },
    onsetTime: "Usually within minutes after consumption",
    crossReactivity: ["Tree nuts (occasionally)", "Other seeds"],
    notes: "An emerging major allergen; reactions can be severe and sesame can be hidden in many foods under different names"
  },
  
  // Sulfites
  "sulfite": {
    name: "Sulfites",
    description: "Preservatives used in foods and beverages that can trigger reactions",
    commonIn: [
      "Wine", "Dried fruits", "Preserved vegetables", "Pickled foods",
      "Many processed foods", "Some medications", "Shrimp (treated)"
    ],
    symptoms: {
      mild: [
        "Headache", "Rash", "Hives", "Itching", "Flushing"
      ],
      moderate: [
        "Digestive issues", "Stomach cramps", "Diarrhea", "Nausea"
      ],
      severe: [
        "Difficulty breathing", "Wheezing", "Asthma attack",
        "Drop in blood pressure", "Anaphylaxis (rare)"
      ]
    },
    onsetTime: "Usually within 15-30 minutes after consumption",
    crossReactivity: ["None specific"],
    notes: "More common in people with asthma; not a true allergy but an intolerance or sensitivity"
  },
  
  // Lactose (special case)
  "lactose": {
    name: "Lactose",
    description: "An intolerance to lactose sugar due to insufficient lactase enzyme",
    commonIn: [
      "Milk", "Cheese", "Yogurt", "Ice cream", "Butter",
      "Many processed foods", "Some medications"
    ],
    symptoms: {
      common: [
        "Bloating", "Gas", "Abdominal cramps", "Diarrhea", 
        "Nausea", "Borborygmi (stomach rumbling)"
      ]
    },
    onsetTime: "Usually within 30 minutes to 2 hours after consumption",
    crossReactivity: ["None"],
    notes: "Not an allergy but an intolerance; severity depends on amount consumed and individual's lactase production"
  }
};

// Export the database
export { allergenDatabase };