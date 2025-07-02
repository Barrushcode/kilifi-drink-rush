
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';
import { Product, RawProduct, GroupedProduct } from '../types/productTypes';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

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
    
    // Use fallback image if no storage image is found
    const productImage = storageImage || FALLBACK_IMAGE;

    finalProducts.push({
      id: item.index,
      name: item.product.Title || 'Unknown Product',
      price: `KES ${item.productPrice.toLocaleString()}`,
      description: item.description,
      category: item.category,
      image: productImage
    });
  }

  console.log(`✨ Successfully processed ${finalProducts.length} products (${finalProducts.filter(p => p.image === FALLBACK_IMAGE).length} using fallback images)`);
  return groupProductsByBaseName(finalProducts);
};
