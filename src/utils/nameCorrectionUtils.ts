
/**
 * Map of known product name typos to corrections.
 * Comprehensive list based on actual database analysis.
 */
const PRODUCT_NAME_CORRECTIONS: Record<string, string> = {
  // Original corrections
  "bllack ram": "Black Ram",
  "johny walker": "Johnnie Walker",
  "hennessey": "Hennessy",
  "moet chandon": "Moët & Chandon",
  "captain morgon": "Captain Morgan",
  "jonnie walker": "Johnnie Walker",
  "ballentines": "Ballantine's",
  "vokka": "Vodka",
  "chamdor": "Chamdor",
  "red lable": "Red Label",
  "chivas regal": "Chivas Regal",
  "jamesno": "Jameson",
  "red winee": "Red Wine",
  
  // Extended corrections based on database analysis
  "johnnie walker red lable": "Johnnie Walker Red Label",
  "johnnie walker black lable": "Johnnie Walker Black Label",
  "absolute vodka": "Absolut Vodka",
  "absolute blue": "Absolut Blue",
  "ballantines finest": "Ballantine's Finest",
  "ballantines 12": "Ballantine's 12",
  "ballantines 17": "Ballantine's 17",
  "ballantines 21": "Ballantine's 21",
  "ballantines 30": "Ballantine's 30",
  "hennessy vs": "Hennessy V.S",
  "hennessy vsop": "Hennessy V.S.O.P",
  "hennessy xo": "Hennessy X.O",
  "jameson irish whiskey": "Jameson Irish Whiskey",
  "jameson black barrel": "Jameson Black Barrel",
  "jameson caskmates": "Jameson Caskmates",
  "jameson crested": "Jameson Crested",
  "chivas regal 12": "Chivas Regal 12",
  "chivas regal 18": "Chivas Regal 18",
  "chivas regal 25": "Chivas Regal 25",
  "smirnoff red": "Smirnoff Red",
  "smirnoff blue": "Smirnoff Blue",
  "smirnoff green": "Smirnoff Green",
  "captain morgan spiced": "Captain Morgan Spiced",
  "captain morgan black": "Captain Morgan Black",
  "moet et chandon": "Moët & Chandon",
  "dom perignon": "Dom Pérignon",
  
  // Common spacing and casing issues
  "johnniewalker": "Johnnie Walker",
  "captainmorgan": "Captain Morgan",
  "chivasregal": "Chivas Regal",
  "ballantines": "Ballantine's",
  "glenlivet": "The Glenlivet",
  "glenfiddich": "Glenfiddich",
  "macallan": "The Macallan",
  "glenmorangie": "Glenmorangie",
  
  // Wine corrections
  "kw v": "KWV",
  "kwv wine": "KWV Wine",
  "nederburg": "Nederburg",
  "boschendal": "Boschendal",
  "klein constantia": "Klein Constantia",
  "hamilton russell": "Hamilton Russell",
  
  // Beer corrections
  "castle lager": "Castle Lager",
  "castle lite": "Castle Lite",
  "black label": "Black Label",
  "hunters dry": "Hunter's Dry",
  "windhoek lager": "Windhoek Lager",
  "amstel lager": "Amstel Lager",
  "heineken lager": "Heineken",
  "corona extra": "Corona Extra",
  "stella artois": "Stella Artois",
  
  // Cognac and brandy corrections
  "martell vs": "Martell V.S",
  "martell vsop": "Martell V.S.O.P",
  "remy martin": "Rémy Martin",
  "courvoisier": "Courvoisier",
  "klipdrift": "Klipdrift",
  "wellington brandy": "Wellington Brandy",
  
  // Rum corrections
  "bacardi white": "Bacardi White",
  "bacardi gold": "Bacardi Gold",
  "bacardi black": "Bacardi Black",
  "havana club": "Havana Club",
  
  // Gin corrections
  "bombay sapphire": "Bombay Sapphire",
  "tanqueray": "Tanqueray",
  "hendricks": "Hendrick's",
  "beefeater": "Beefeater",
  
  // Tequila corrections
  "jose cuervo": "José Cuervo",
  "patron silver": "Patrón Silver",
  "patron gold": "Patrón Gold"
};

/**
 * Brand name patterns for fuzzy matching
 */
const BRAND_PATTERNS = [
  { pattern: /johnnie?\s*walker/gi, replacement: "Johnnie Walker" },
  { pattern: /absolut(?:e?)\s*(?:vodka)?/gi, replacement: "Absolut" },
  { pattern: /ballant(?:ine)?s?\s*(?:'s)?/gi, replacement: "Ballantine's" },
  { pattern: /henness(?:e?y)/gi, replacement: "Hennessy" },
  { pattern: /jameso?n/gi, replacement: "Jameson" },
  { pattern: /chivas\s*regal/gi, replacement: "Chivas Regal" },
  { pattern: /captain\s*morg(?:a?n)/gi, replacement: "Captain Morgan" },
  { pattern: /smirnof+/gi, replacement: "Smirnoff" },
  { pattern: /mo[eë]t\s*(?:&|et)?\s*chandon/gi, replacement: "Moët & Chandon" },
  { pattern: /r[eé]my\s*martin/gi, replacement: "Rémy Martin" },
  { pattern: /patr[oó]n/gi, replacement: "Patrón" },
  { pattern: /jos[eé]\s*cuervo/gi, replacement: "José Cuervo" },
  { pattern: /hendricks?/gi, replacement: "Hendrick's" },
  { pattern: /dom\s*p[eé]rignon/gi, replacement: "Dom Pérignon" }
];

/**
 * Returns the corrected product name for display.
 * Uses exact matching first, then fuzzy pattern matching.
 */
export function correctProductName(name: string): string {
  if (!name || typeof name !== 'string') {
    return 'Unknown Product';
  }

  const normalized = name.trim().toLowerCase();
  
  // First: exact matching from corrections dictionary
  if (PRODUCT_NAME_CORRECTIONS.hasOwnProperty(normalized)) {
    return PRODUCT_NAME_CORRECTIONS[normalized];
  }
  
  // Second: check if any correction key is contained in the name
  for (const typo in PRODUCT_NAME_CORRECTIONS) {
    if (normalized.includes(typo)) {
      return name.replace(new RegExp(typo, "ig"), PRODUCT_NAME_CORRECTIONS[typo]);
    }
  }
  
  // Third: apply brand pattern matching
  let correctedName = name;
  for (const { pattern, replacement } of BRAND_PATTERNS) {
    if (pattern.test(correctedName)) {
      correctedName = correctedName.replace(pattern, replacement);
    }
  }
  
  // Fourth: normalize spacing and capitalization
  correctedName = correctedName
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize each word
  
  // Fifth: fix common label/lable typos
  correctedName = correctedName.replace(/\blable\b/gi, 'Label');
  
  return correctedName;
}

/**
 * Additional utility to check if a name needs correction
 */
export function hasTypos(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  
  const normalized = name.trim().toLowerCase();
  
  // Check exact matches in corrections
  if (PRODUCT_NAME_CORRECTIONS.hasOwnProperty(normalized)) {
    return true;
  }
  
  // Check if any typo pattern exists
  for (const typo in PRODUCT_NAME_CORRECTIONS) {
    if (normalized.includes(typo)) {
      return true;
    }
  }
  
  // Check brand patterns
  for (const { pattern } of BRAND_PATTERNS) {
    if (pattern.test(name) && pattern.test(name) !== name.match(pattern)?.[0]) {
      return true;
    }
  }
  
  return false;
}
