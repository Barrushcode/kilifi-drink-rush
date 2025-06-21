
// Enhanced category detection with description analysis
export interface CategoryMatch {
  category: string;
  confidence: number;
  subcategory?: string;
  features: string[];
}

// Beer-specific keywords and patterns
const BEER_KEYWORDS = {
  lager: ['lager', 'pilsner', 'pils', 'light beer', 'crisp'],
  ale: ['ale', 'ipa', 'pale ale', 'india pale ale', 'hoppy'],
  stout: ['stout', 'porter', 'dark beer', 'guinness'],
  wheat: ['wheat', 'hefeweizen', 'witbier', 'weiss'],
  strong: ['strong', 'double', 'triple', 'imperial', 'high alcohol']
};

// Wine-specific keywords
const WINE_KEYWORDS = {
  red: ['red wine', 'merlot', 'cabernet', 'pinot noir', 'shiraz', 'malbec'],
  white: ['white wine', 'chardonnay', 'sauvignon blanc', 'pinot grigio', 'riesling'],
  rosé: ['rosé', 'rose wine', 'blush'],
  sparkling: ['sparkling', 'champagne', 'prosecco', 'cava'],
  sweet: ['sweet', 'dessert wine', 'port', 'moscato'],
  dry: ['dry', 'crisp', 'mineral']
};

// Spirits keywords
const SPIRITS_KEYWORDS = {
  aged: ['aged', 'years old', 'matured', 'vintage', 'reserve', 'extra old'],
  premium: ['premium', 'luxury', 'exclusive', 'limited edition', 'rare'],
  smooth: ['smooth', 'silk', 'velvet', 'refined'],
  bold: ['bold', 'intense', 'strong', 'robust', 'full-bodied'],
  cocktail: ['mixer', 'cocktail', 'mixing', 'bartender']
};

// Regional indicators
const REGIONAL_KEYWORDS = {
  scottish: ['scotland', 'scottish', 'highland', 'speyside', 'islay'],
  irish: ['ireland', 'irish', 'dublin', 'cork'],
  french: ['france', 'french', 'cognac', 'armagnac', 'bordeaux'],
  italian: ['italy', 'italian', 'grappa', 'limoncello'],
  mexican: ['mexico', 'mexican', 'tequila', 'mezcal'],
  caribbean: ['caribbean', 'jamaica', 'barbados', 'cuba', 'rum'],
  russian: ['russia', 'russian', 'vodka'],
  german: ['germany', 'german', 'schnapps']
};

export const analyzeProductDescription = (name: string, description: string, price: number): CategoryMatch => {
  const fullText = `${name} ${description}`.toLowerCase();
  const features: string[] = [];
  let category = 'Spirits';
  let subcategory = '';
  let confidence = 0.5;

  // Beer Analysis
  if (fullText.includes('beer') || fullText.includes('lager') || fullText.includes('ale')) {
    category = 'Beer';
    confidence = 0.9;
    
    // Determine beer subcategory
    for (const [type, keywords] of Object.entries(BEER_KEYWORDS)) {
      if (keywords.some(keyword => fullText.includes(keyword))) {
        subcategory = type.charAt(0).toUpperCase() + type.slice(1);
        features.push(subcategory);
        confidence = 0.95;
        break;
      }
    }
    
    // Check for pack indicators
    if (fullText.includes('pack') || fullText.includes('case') || /\d+\s*x\s*\d+/i.test(fullText)) {
      return { category: '6-Packs & Beer Sets', confidence: 0.98, features };
    }
  }

  // Wine Analysis
  else if (fullText.includes('wine') || Object.values(WINE_KEYWORDS).flat().some(keyword => fullText.includes(keyword))) {
    category = 'Wine';
    confidence = 0.9;
    
    // Determine wine subcategory
    for (const [type, keywords] of Object.entries(WINE_KEYWORDS)) {
      if (keywords.some(keyword => fullText.includes(keyword))) {
        subcategory = type === 'rosé' ? 'Rosé' : type.charAt(0).toUpperCase() + type.slice(1);
        features.push(subcategory);
        confidence = 0.95;
        break;
      }
    }
    
    // Check for wine sets or expensive bottles
    if (price > 3000 || fullText.includes('set') || fullText.includes('collection')) {
      return { category: 'Wine Sets & Collections', confidence: 0.97, subcategory, features };
    }
  }

  // Whiskey/Whisky Analysis
  else if (fullText.includes('whiskey') || fullText.includes('whisky') || fullText.includes('bourbon') || fullText.includes('scotch')) {
    category = 'Whiskey';
    confidence = 0.9;
    
    // Regional classification
    if (REGIONAL_KEYWORDS.scottish.some(keyword => fullText.includes(keyword))) {
      subcategory = 'Scotch Whisky';
      features.push('Scottish');
    } else if (REGIONAL_KEYWORDS.irish.some(keyword => fullText.includes(keyword))) {
      subcategory = 'Irish Whiskey';
      features.push('Irish');
    } else if (fullText.includes('bourbon')) {
      subcategory = 'Bourbon';
      features.push('American');
    }
    
    // Check for premium/aged indicators
    if (SPIRITS_KEYWORDS.aged.some(keyword => fullText.includes(keyword)) || price > 5000) {
      return { category: 'Whiskey Collections', confidence: 0.96, subcategory, features };
    }
  }

  // Vodka Analysis
  else if (fullText.includes('vodka')) {
    category = 'Vodka';
    confidence = 0.9;
    
    if (SPIRITS_KEYWORDS.premium.some(keyword => fullText.includes(keyword)) || price > 4000) {
      return { category: 'Vodka Premium Sets', confidence: 0.95, features };
    }
  }

  // Gin Analysis
  else if (fullText.includes('gin')) {
    category = 'Gin';
    confidence = 0.9;
    
    if (SPIRITS_KEYWORDS.premium.some(keyword => fullText.includes(keyword)) || price > 3500) {
      return { category: 'Gin Premium Collections', confidence: 0.95, features };
    }
  }

  // Champagne/Sparkling Analysis
  else if (fullText.includes('champagne') || fullText.includes('sparkling') || fullText.includes('prosecco')) {
    category = 'Champagne';
    confidence = 0.9;
    
    if (price > 4000 || fullText.includes('set') || fullText.includes('collection')) {
      return { category: 'Champagne & Sparkling Sets', confidence: 0.96, features };
    }
  }

  // Cognac/Brandy Analysis
  else if (fullText.includes('cognac') || fullText.includes('brandy') || fullText.includes('hennessy') || fullText.includes('remy martin')) {
    category = 'Cognac & Premium Brandy';
    confidence = 0.95;
    
    if (SPIRITS_KEYWORDS.aged.some(keyword => fullText.includes(keyword))) {
      features.push('Aged');
    }
  }

  // Rum Analysis
  else if (fullText.includes('rum')) {
    category = 'Rum';
    confidence = 0.9;
    
    // Check for regional indicators
    if (REGIONAL_KEYWORDS.caribbean.some(keyword => fullText.includes(keyword))) {
      features.push('Caribbean');
    }
    
    if (price > 3000 || SPIRITS_KEYWORDS.aged.some(keyword => fullText.includes(keyword))) {
      return { category: 'Rum Collections', confidence: 0.95, features };
    }
  }

  // Tequila Analysis
  else if (fullText.includes('tequila') || fullText.includes('mezcal')) {
    category = 'Tequila';
    confidence = 0.9;
    
    if (price > 3000 || SPIRITS_KEYWORDS.premium.some(keyword => fullText.includes(keyword))) {
      return { category: 'Tequila Premium Sets', confidence: 0.95, features };
    }
  }

  // Liqueur Analysis
  else if (fullText.includes('liqueur') || fullText.includes('cream') || fullText.includes('coffee') || fullText.includes('fruit')) {
    category = 'Liqueur';
    confidence = 0.8;
  }

  // Juice Analysis
  else if (fullText.includes('juice') || fullText.includes('non-alcoholic') || fullText.includes('mixer')) {
    category = 'Juices';
    confidence = 0.9;
  }

  // Add flavor and quality features
  if (SPIRITS_KEYWORDS.smooth.some(keyword => fullText.includes(keyword))) {
    features.push('Smooth');
  }
  if (SPIRITS_KEYWORDS.bold.some(keyword => fullText.includes(keyword))) {
    features.push('Bold');
  }
  if (SPIRITS_KEYWORDS.premium.some(keyword => fullText.includes(keyword))) {
    features.push('Premium');
  }

  return { category, confidence, subcategory, features };
};
