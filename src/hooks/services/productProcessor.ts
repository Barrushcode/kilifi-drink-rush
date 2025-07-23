
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';
import { Product, RawProduct, GroupedProduct } from '../types/productTypes';
import { correctProductName } from '@/utils/nameCorrectionUtils';

// Get category-specific placeholder images
const getCategoryPlaceholder = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('whiskey') || categoryLower.includes('whisky')) {
    return 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop&crop=center';
  }
  if (categoryLower.includes('vodka')) {
    return 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=300&fit=crop&crop=center';
  }
  if (categoryLower.includes('wine')) {
    return 'https://images.unsplash.com/photo-1506377247717-84a0f8d814f4?w=300&h=300&fit=crop&crop=center';
  }
  if (categoryLower.includes('beer')) {
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center';
  }
  if (categoryLower.includes('rum')) {
    return 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=300&h=300&fit=crop&crop=center';
  }
  if (categoryLower.includes('gin')) {
    return 'https://images.unsplash.com/photo-1544145762-54623c6b8e91?w=300&h=300&fit=crop&crop=center';
  }
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop&crop=center';
};

export const processRawProducts = async (
  data: RawProduct[], 
  startIndex: number
): Promise<GroupedProduct[]> => {
  const processedProducts: Product[] = [];
  
  for (let index = 0; index < data.length; index++) {
    const product = data[index];
    
    if (typeof product.Price !== 'number' || isNaN(product.Price)) {
      console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title);
      continue;
    }

    const productPrice = product.Price;
    const description = product.Description || '';
    const category = product.Category || 'General';

    // Get Supabase image with improved matching
    const productTitle = product.Title || 'Unknown Product';
    const storageImage = await getSupabaseProductImageUrl(productTitle);

    let productImage: string | null = null;
    if (storageImage) {
      productImage = storageImage;
      console.log(`✅ Found Supabase image for "${productTitle}": ${storageImage}`);
    } else {
      console.log(`❌ No Supabase image found for "${productTitle}"`);
      // Use category-specific placeholder image if no storage image found
      const categoryImage = getCategoryPlaceholder(category);
      productImage = categoryImage;
    }

    // Clean up description by removing common typos and fixing basic issues
    const cleanDescription = description
      .replace(/\s+/g, ' ') // Remove extra spaces
      .replace(/\b(wich|whitch)\b/gi, 'which') // Fix "which" typos
      .replace(/\b(there|their)\b(?=\s+(is|are))/gi, 'there') // Fix there/their context
      .replace(/\b(its|it's)\b(?!\s+(?:going|been|time))/gi, 'its') // Fix its/it's
      .replace(/\bwith\s+a\s+smooth\b/gi, 'with a smooth') // Standardize descriptions
      .replace(/\b(flavour|flavor)\b/gi, 'flavor') // Standardize spelling
      .replace(/\b(colour|color)\b/gi, 'color') // Standardize spelling
      .trim();

    processedProducts.push({
      id: startIndex + index + 1,
      name: correctProductName(product.Title || 'Unknown Product').toUpperCase(), // Make title all caps
      price: `KES ${productPrice.toLocaleString()}`,
      description: cleanDescription,
      category,
      image: productImage
    });
  }

  return groupProductsByBaseName(processedProducts, true); // Preserve Supabase order
};
