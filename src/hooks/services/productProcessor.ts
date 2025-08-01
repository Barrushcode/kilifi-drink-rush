
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';
import { Product, RawProduct, GroupedProduct } from '../types/productTypes';
import { correctProductName } from '@/utils/nameCorrectionUtils';

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

    // Get Supabase image
    const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');

    let productImage: string | null = null;
    if (storageImage) {
      productImage = storageImage;
    }

    // Use placeholder image if no storage image found for faster loading
    if (!productImage) {
      productImage = `https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop&crop=center`;
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
