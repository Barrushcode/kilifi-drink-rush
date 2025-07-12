
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
    return 'Beer (6-Packs)';
  }
  
  // Wine categories  
  if (lowerName.includes('wine') || lowerName.includes('merlot') || lowerName.includes('cabernet') || 
      lowerName.includes('chardonnay') || lowerName.includes('sauvignon') || lowerName.includes('sake')) {
    return 'Wine';
  }
  
  // Whiskey/Whisky categories
  if (lowerName.includes('whiskey') || lowerName.includes('whisky') || lowerName.includes('bourbon') || 
      lowerName.includes('scotch')) {
    return 'Whisky';
  }
  
  // Vodka categories
  if (lowerName.includes('vodka')) {
    return 'Vodka';
  }
  
  // Champagne/Sparkling
  if (lowerName.includes('champagne') || lowerName.includes('prosecco') || lowerName.includes('sparkling')) {
    return 'Champagne';
  }
  
  // Gin categories
  if (lowerName.includes('gin')) {
    return 'Gin';
  }
  
  // Cognac/Brandy
  if (lowerName.includes('cognac') || lowerName.includes('brandy') || lowerName.includes('hennessy') || 
      lowerName.includes('remy martin')) {
    return 'Cognac';
  }
  
  // Rum categories
  if (lowerName.includes('rum')) {
    return 'Rum';
  }
  
  // Tequila categories
  if (lowerName.includes('tequila')) {
    return 'Tequila';
  }
  
  // Liqueur
  if (lowerName.includes('liqueur') || lowerName.includes('spirit')) {
    return 'Liqueur';
  }
  
  // Mixers and soft drinks
  if (lowerName.includes('mixer') || lowerName.includes('bitter') || lowerName.includes('tonic') ||
      lowerName.includes('soda') || lowerName.includes('soft drink') || lowerName.includes('ready to drink')) {
    return 'Mixer';
  }
  
  // Soft drinks
  if (lowerName.includes('juice') || lowerName.includes('water') || lowerName.includes('drink')) {
    return 'Soft Drinks';
  }
  
  // Default
  return 'Liqueur';
};
