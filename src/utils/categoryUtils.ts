
import { analyzeProductDescription } from './enhancedCategoryUtils';

// Enhanced category detection with description support
export const getCategoryFromName = (name: string, price: number, description?: string): string => {
  if (!name) return 'Other';
  
  // Use enhanced analysis if description is available
  if (description) {
    const analysis = analyzeProductDescription(name, description, price);
    
    // Return the analyzed category with high confidence
    if (analysis.confidence > 0.8) {
      return analysis.category;
    }
  }
  
  // Fallback to original logic for compatibility
  const lowerName = name.toLowerCase();
  
  // Check for pack/set indicators first
  const isMultiPack = lowerName.includes('pack') || lowerName.includes('set') || 
                    lowerName.includes('bundle') || lowerName.includes('case') ||
                    /\d+\s*(x|×)\s*\d+/i.test(lowerName);
  
  // Beer categories
  if (lowerName.includes('beer') || lowerName.includes('lager') || lowerName.includes('ale')) {
    if (isMultiPack || lowerName.includes('6') || price > 2000) {
      return '6-Packs & Beer Sets';
    }
    return 'Beer';
  }
  
  // Wine categories
  if (lowerName.includes('wine') || lowerName.includes('merlot') || lowerName.includes('cabernet') || 
      lowerName.includes('chardonnay') || lowerName.includes('sauvignon')) {
    if (isMultiPack || lowerName.includes('set') || price > 3000) {
      return 'Wine Sets & Collections';
    }
    return 'Wine';
  }
  
  // Whiskey/Whisky categories
  if (lowerName.includes('whiskey') || lowerName.includes('whisky') || lowerName.includes('bourbon') || 
      lowerName.includes('scotch')) {
    if (isMultiPack || lowerName.includes('set') || price > 5000) {
      return 'Whiskey Collections';
    }
    return 'Whiskey';
  }
  
  // Vodka categories
  if (lowerName.includes('vodka')) {
    if (isMultiPack || price > 4000) {
      return 'Vodka Premium Sets';
    }
    return 'Vodka';
  }
  
  // Champagne/Sparkling
  if (lowerName.includes('champagne') || lowerName.includes('prosecco') || lowerName.includes('sparkling')) {
    if (isMultiPack || price > 4000) {
      return 'Champagne & Sparkling Sets';
    }
    return 'Champagne';
  }
  
  // Gin categories
  if (lowerName.includes('gin')) {
    if (isMultiPack || price > 3500) {
      return 'Gin Premium Collections';
    }
    return 'Gin';
  }
  
  // Cognac/Brandy
  if (lowerName.includes('cognac') || lowerName.includes('brandy') || lowerName.includes('hennessy') || 
      lowerName.includes('remy martin')) {
    return 'Cognac & Premium Brandy';
  }
  
  // Rum categories
  if (lowerName.includes('rum')) {
    if (isMultiPack || price > 3000) {
      return 'Rum Collections';
    }
    return 'Rum';
  }
  
  // Tequila categories
  if (lowerName.includes('tequila')) {
    if (isMultiPack || price > 3000) {
      return 'Tequila Premium Sets';
    }
    return 'Tequila';
  }
  
  // Liqueur
  if (lowerName.includes('liqueur')) {
    return 'Liqueur';
  }
  
  // Juice
  if (lowerName.includes('juice')) {
    return 'Juices';
  }
  
  // Default premium category for expensive items
  if (price > 5000) {
    return 'Premium Collection';
  }
  
  return 'Spirits';
};
