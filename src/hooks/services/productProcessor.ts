
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';
import { Product, RawProduct, GroupedProduct } from '../types/productTypes';

export const processRawProducts = async (
  data: RawProduct[], 
  startIndex: number
): Promise<GroupedProduct[]> => {
  console.log(`📦 Processing ${data.length} products with optimized image loading...`);
  
  // Process products in parallel with image lookups
  const productPromises = data.map(async (product, index) => {
    if (typeof product.Price !== 'number' || isNaN(product.Price)) {
      console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title);
      return null;
    }

    const productPrice = product.Price;
    const description = product.Description || '';
    const category = product.Category || 'Uncategorized';

    // Start image lookup immediately (will be cached/deduplicated)
    const storageImagePromise = getSupabaseProductImageUrl(product.Title || 'Unknown Product');
    
    return {
      product,
      productPrice,
      description,
      category,
      index: startIndex + index + 1,
      storageImagePromise
    };
  });

  // Wait for all initial processing
  const processedData = await Promise.all(productPromises);
  
  // Filter out invalid products
  const validProducts = processedData.filter(Boolean);
  
  // Wait for all image lookups to complete
  const finalProducts: Product[] = [];
  
  for (const item of validProducts) {
    if (!item) continue;
    
    const storageImage = await item.storageImagePromise;
    
    // Skip products without images for now
    if (!storageImage) {
      console.log(`❌ Skipping ${item.product.Title} - no image available`);
      continue;
    }

    finalProducts.push({
      id: item.index,
      name: item.product.Title || 'Unknown Product',
      price: `KES ${item.productPrice.toLocaleString()}`,
      description: item.description,
      category: item.category,
      image: storageImage
    });
  }

  console.log(`✨ Successfully processed ${finalProducts.length} products with images`);
  return groupProductsByBaseName(finalProducts);
};
