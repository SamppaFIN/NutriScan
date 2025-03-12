/**
 * E-code constants and helper data
 */

// Common E-codes and their descriptions
export const eCodes = {
  'E100': { name: 'Kurkumiini', category: 'Väriaine', warning: false },
  'E101': { name: 'Riboflaviini', category: 'Väriaine', warning: false },
  'E102': { name: 'Tartratsiini', category: 'Väriaine', warning: true },
  'E104': { name: 'Kinoliinikeltainen', category: 'Väriaine', warning: true },
  'E110': { name: 'Paraoranssi', category: 'Väriaine', warning: true },
  'E120': { name: 'Karmiini', category: 'Väriaine', warning: false },
  'E122': { name: 'Atsorubiini', category: 'Väriaine', warning: true },
  'E124': { name: 'Uuskokkiini', category: 'Väriaine', warning: true },
  'E129': { name: 'Alluranpunainen AC', category: 'Väriaine', warning: true },
  'E131': { name: 'Patenttisininen V', category: 'Väriaine', warning: true },
  'E132': { name: 'Indigotiini', category: 'Väriaine', warning: true },
  'E133': { name: 'Briljanttisininen FCF', category: 'Väriaine', warning: true },
  'E142': { name: 'Vihreä S', category: 'Väriaine', warning: true },
  'E150a': { name: 'Sokerikulööri', category: 'Väriaine', warning: false },
  'E150b': { name: 'Emäksinen sulfiittisokerikulööri', category: 'Väriaine', warning: false },
  'E150c': { name: 'Ammoniummenetelmän sokerikulööri', category: 'Väriaine', warning: false },
  'E150d': { name: 'Ammoniumsulfiitin sokerikulööri', category: 'Väriaine', warning: false },
  'E151': { name: 'Briljanttimusta BN', category: 'Väriaine', warning: true },
  'E160a': { name: 'Karotenoidit', category: 'Väriaine', warning: false },
  'E160b': { name: 'Annaatto, biksiini, norbiksiini', category: 'Väriaine', warning: false },
  'E160c': { name: 'Paprikauute, kapsantiini, kapsorubiini', category: 'Väriaine', warning: false },
  'E160d': { name: 'Lykopeeni', category: 'Väriaine', warning: false },
  'E160e': { name: 'Beta-apo-8′-karotenaali', category: 'Väriaine', warning: false },
  'E161b': { name: 'Luteiini', category: 'Väriaine', warning: false },
  'E162': { name: 'Punajuuriväri', category: 'Väriaine', warning: false },
  'E163': { name: 'Antosyaanit', category: 'Väriaine', warning: false },
  'E170': { name: 'Kalsiumkarbonaatti', category: 'Väriaine', warning: false },
  'E171': { name: 'Titaanidioksidi', category: 'Väriaine', warning: true },
  'E172': { name: 'Rautaoksidit ja -hydroksidit', category: 'Väriaine', warning: false },
  'E200': { name: 'Sorbiinihappo', category: 'Säilöntäaine', warning: false },
  'E202': { name: 'Kaliumsorbaatti', category: 'Säilöntäaine', warning: false },
  'E203': { name: 'Kalsiumsorbaatti', category: 'Säilöntäaine', warning: false },
  'E210': { name: 'Bentsoehappo', category: 'Säilöntäaine', warning: true },
  'E211': { name: 'Natriumbentsoaatti', category: 'Säilöntäaine', warning: true },
  'E212': { name: 'Kaliumbentsoaatti', category: 'Säilöntäaine', warning: true },
  'E213': { name: 'Kalsiumbentsoaatti', category: 'Säilöntäaine', warning: true },
  'E220': { name: 'Rikkidioksidi', category: 'Säilöntäaine', warning: true },
  'E221': { name: 'Natriumsulfiitti', category: 'Säilöntäaine', warning: true },
  'E222': { name: 'Natriumvetysulfiitti', category: 'Säilöntäaine', warning: true },
  'E223': { name: 'Natriummetabisulfiitti', category: 'Säilöntäaine', warning: true },
  'E224': { name: 'Kaliummetabisulfiitti', category: 'Säilöntäaine', warning: true },
  'E250': { name: 'Natriumnitriitti', category: 'Säilöntäaine', warning: true },
  'E251': { name: 'Natriumnitraatti', category: 'Säilöntäaine', warning: true },
  'E252': { name: 'Kaliumnitraatti', category: 'Säilöntäaine', warning: true },
  'E260': { name: 'Etikkahappo', category: 'Säilöntäaine', warning: false },
  'E270': { name: 'Maitohappo', category: 'Happamuudensäätöaine', warning: false },
  'E296': { name: 'Omenahappo', category: 'Happamuudensäätöaine', warning: false },
  'E300': { name: 'Askorbiinihappo', category: 'Antioksidantti', warning: false },
  'E301': { name: 'Natriumaskorbaatti', category: 'Antioksidantti', warning: false },
  'E302': { name: 'Kalsiumaskorbaatti', category: 'Antioksidantti', warning: false },
  'E304': { name: 'Askorbyylipalmitaatti', category: 'Antioksidantti', warning: false },
  'E306': { name: 'Tokoferoliuute', category: 'Antioksidantti', warning: false },
  'E307': { name: 'Alfatokoferoli', category: 'Antioksidantti', warning: false },
  'E308': { name: 'Gammatokoferoli', category: 'Antioksidantti', warning: false },
  'E309': { name: 'Deltatokoferoli', category: 'Antioksidantti', warning: false },
  'E310': { name: 'Propyyligallaatti', category: 'Antioksidantti', warning: true },
  'E320': { name: 'Butyylihydroksianisoli', category: 'Antioksidantti', warning: true },
  'E321': { name: 'Butyylihydroksitolueeni', category: 'Antioksidantti', warning: true },
  'E330': { name: 'Sitruunahappo', category: 'Happamuudensäätöaine', warning: false },
  'E331': { name: 'Natriumsitraatit', category: 'Happamuudensäätöaine', warning: false },
  'E332': { name: 'Kaliumsitraatit', category: 'Happamuudensäätöaine', warning: false },
  'E333': { name: 'Kalsiumsitraatit', category: 'Happamuudensäätöaine', warning: false },
  'E334': { name: 'Viinihappo', category: 'Happamuudensäätöaine', warning: false },
  'E335': { name: 'Natriumtartraatit', category: 'Happamuudensäätöaine', warning: false },
  'E336': { name: 'Kaliumtartraatit', category: 'Happamuudensäätöaine', warning: false },
  'E340': { name: 'Kaliumfosfaatit', category: 'Emulgointiaine', warning: false },
  'E341': { name: 'Kalsiumfosfaatit', category: 'Emulgointiaine', warning: false },
  'E407': { name: 'Karrageeni', category: 'Sakeuttamisaine', warning: false },
  'E410': { name: 'Johanneksenleipäpuujauhe', category: 'Sakeuttamisaine', warning: false },
  'E412': { name: 'Guarkumi', category: 'Sakeuttamisaine', warning: false },
  'E414': { name: 'Arabikumi', category: 'Sakeuttamisaine', warning: false },
  'E415': { name: 'Ksantaanikumi', category: 'Sakeuttamisaine', warning: false },
  'E420': { name: 'Sorbitoli', category: 'Makeutusaine', warning: false },
  'E421': { name: 'Mannitoli', category: 'Makeutusaine', warning: false },
  'E422': { name: 'Glyseroli', category: 'Kosteudensäilyttäjä', warning: false },
  'E440': { name: 'Pektiini', category: 'Sakeuttamisaine', warning: false },
  'E441': { name: 'Gelatiini', category: 'Sakeuttamisaine', warning: false },
  'E450': { name: 'Difosfaatit', category: 'Emulgointiaine', warning: false },
  'E460': { name: 'Selluloosa', category: 'Sakeuttamisaine', warning: false },
  'E461': { name: 'Metyyliselluloosa', category: 'Sakeuttamisaine', warning: false },
  'E466': { name: 'Karboksimetyyliselluloosa', category: 'Sakeuttamisaine', warning: false },
  'E471': { name: 'Rasvahappojen mono- ja diglyseridit', category: 'Emulgointiaine', warning: false },
  'E472a': { name: 'Rasvahappojen mono- ja diglyseridien etikkahappoesterit', category: 'Emulgointiaine', warning: false },
  'E500': { name: 'Natriumkarbonaatit', category: 'Nostatusaine', warning: false },
  'E501': { name: 'Kaliumkarbonaatit', category: 'Nostatusaine', warning: false },
  'E503': { name: 'Ammoniumkarbonaatit', category: 'Nostatusaine', warning: false },
  'E504': { name: 'Magnesiumkarbonaatit', category: 'Nostatusaine', warning: false },
  'E621': { name: 'Natriumglutamaatti', category: 'Arominvahvenne', warning: true },
  'E622': { name: 'Kaliumglutamaatti', category: 'Arominvahvenne', warning: true },
  'E623': { name: 'Kalsiumglutamaatti', category: 'Arominvahvenne', warning: true },
  'E631': { name: 'Natriuminosinaatti', category: 'Arominvahvenne', warning: false },
  'E951': { name: 'Aspartaami', category: 'Makeutusaine', warning: true },
  'E954': { name: 'Sakariini', category: 'Makeutusaine', warning: true },
};

// Common allergens in Finnish
export const commonAllergens = [
  'Maito',
  'Vehnä',
  'Ruis',
  'Ohra',
  'Kaura',
  'Kananmuna',
  'Kala',
  'Äyriäiset',
  'Pähkinät',
  'Soija',
  'Sinappi',
  'Seesaminsiemenet',
  'Selleri',
  'Lupiini',
  'Nilviäiset',
  'Gluteeni',
  'Laktoosi'
];

// Get E-code information
export const getECodeInfo = (code) => {
  const formattedCode = code.toUpperCase();
  return eCodes[formattedCode] || { name: 'Tuntematon', category: 'Tuntematon', warning: false };
};

// Check if E-code might cause allergic reactions
export const isAllergenicECode = (code) => {
  const info = getECodeInfo(code);
  return info.warning;
};

// Get category for an E-code
export const getECodeCategory = (code) => {
  const info = getECodeInfo(code);
  return info.category;
};
