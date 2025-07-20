import { supabase } from '@/integrations/supabase/client';

export interface IngredientProduct {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  category: string;
  quantity: number;
  isMatched: boolean;
  originalIngredient: string;
}

export interface ParsedIngredient {
  quantity: string;
  ingredient: string;
  originalText: string;
}

// Parse ingredient text to extract quantity and ingredient name
export const parseIngredients = (ingredientText: string): ParsedIngredient[] => {
  if (!ingredientText) return [];
  
  const ingredients = ingredientText.split(',').map(item => item.trim());
  
  return ingredients.map(ingredient => {
    // Match patterns like "45ml vodka", "30ml cranberry juice", "1 oz lime juice"
    const match = ingredient.match(/^(\d+(?:\.\d+)?(?:ml|oz|cl|dash|splash)?)\s+(.+)$/i);
    
    if (match) {
      return {
        quantity: match[1],
        ingredient: match[2].trim(),
        originalText: ingredient
      };
    }
    
    return {
      quantity: '1',
      ingredient: ingredient,
      originalText: ingredient
    };
  });
};

// Match ingredients to products in the database
export const matchIngredientsToProducts = async (ingredients: ParsedIngredient[]): Promise<IngredientProduct[]> => {
  try {
    // Fetch all products
    const { data: products, error } = await supabase
      .from('productprice')
      .select('id, Title, Price, Category')
      .order('Title');

    if (error) throw error;

    const matchedProducts: IngredientProduct[] = [];

    for (const ingredient of ingredients) {
      const ingredientLower = ingredient.ingredient.toLowerCase();
      let matchedProduct = null;

      // Try to find exact or partial matches
      if (products) {
        matchedProduct = products.find(product => {
          const titleLower = product.Title.toLowerCase();
          
          // Check for vodka variants
          if (ingredientLower.includes('vodka')) {
            return titleLower.includes('vodka') && product.Category?.toLowerCase().includes('vodka');
          }
          
          // Check for rum variants
          if (ingredientLower.includes('rum')) {
            return titleLower.includes('rum') || product.Category?.toLowerCase().includes('rum');
          }
          
          // Check for gin variants
          if (ingredientLower.includes('gin')) {
            return titleLower.includes('gin') || product.Category?.toLowerCase().includes('gin');
          }
          
          // Check for whiskey/whisky variants
          if (ingredientLower.includes('whiskey') || ingredientLower.includes('whisky')) {
            return titleLower.includes('whiskey') || titleLower.includes('whisky') || 
                   product.Category?.toLowerCase().includes('whiskey') || 
                   product.Category?.toLowerCase().includes('whisky');
          }
          
          // Check for wine variants
          if (ingredientLower.includes('wine')) {
            return titleLower.includes('wine') || product.Category?.toLowerCase().includes('wine');
          }
          
          // Check for beer variants
          if (ingredientLower.includes('beer')) {
            return titleLower.includes('beer') || product.Category?.toLowerCase().includes('beer');
          }
          
          // Check for liqueur variants
          if (ingredientLower.includes('liqueur') || ingredientLower.includes('triple sec') || 
              ingredientLower.includes('coffee liqueur')) {
            return titleLower.includes('liqueur') || titleLower.includes('kahlua') || 
                   titleLower.includes('cointreau') || titleLower.includes('triple sec');
          }
          
          // For mixers and other ingredients, try partial matching
          const ingredientWords = ingredientLower.split(' ');
          return ingredientWords.some(word => 
            word.length > 3 && titleLower.includes(word)
          );
        });
      }

      if (matchedProduct) {
        matchedProducts.push({
          id: `${matchedProduct.id}-ingredient`,
          name: matchedProduct.Title,
          price: matchedProduct.Price || 0,
          priceFormatted: `KES ${(matchedProduct.Price || 0).toLocaleString()}`,
          category: matchedProduct.Category || 'Unknown',
          quantity: 1, // Default quantity, user can adjust
          isMatched: true,
          originalIngredient: ingredient.originalText
        });
      } else {
        // Add unmatched ingredient for user reference
        matchedProducts.push({
          id: `unmatched-${Date.now()}-${Math.random()}`,
          name: ingredient.ingredient,
          price: 0,
          priceFormatted: 'Not available',
          category: 'Mixer/Garnish',
          quantity: 1,
          isMatched: false,
          originalIngredient: ingredient.originalText
        });
      }
    }

    return matchedProducts;
  } catch (error) {
    console.error('Error matching ingredients to products:', error);
    return [];
  }
};