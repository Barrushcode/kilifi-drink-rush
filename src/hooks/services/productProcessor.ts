
import { getCategoryFromName } from '@/utils/categoryUtils';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';
import { Product, RawProduct } from '../types/productTypes';

export const processRawProducts = async (
  data: RawProduct[], 
  startIndex: number
): Promise<Product[]> => {
  const processedProducts: Product[] = [];
  
  for (let index = 0; index < data.length; index++) {
    const product = data[index];
    
    if (typeof product.Price !== 'number' || isNaN(product.Price)) {
      console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title);
      continue;
    }

    const productPrice = product.Price;
    const description = product.Description || '';

    // Get Supabase image
    const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');

    let productImage: string | null = null;
    if (storageImage) {
      productImage = storageImage;
    } else if (product["Product image URL"] && typeof product["Product image URL"] === "string" && product["Product image URL"].trim().length > 0) {
      productImage = product["Product image URL"];
    }

    // Skip products without images
    if (!productImage) {
      console.log(`❌ Skipping ${product.Title} - no image available`);
      continue;
    }

    // Enhanced category detection using both name and description
    const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice, description);

    processedProducts.push({
      id: startIndex + index + 1,
      name: product.Title || 'Unknown Product',
      price: `KES ${productPrice.toLocaleString()}`,
      description,
      category,
      image: productImage
    });
  }

  return groupProductsByBaseName(processedProducts);
};
