
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
    const category = product.Category || 'Uncategorized';

    // Get Supabase image
    const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');

    let productImage: string | null = null;
    if (storageImage) {
      productImage = storageImage;
    }

    // Skip products without images for now, but you can remove this if you want to show all products
    if (!productImage) {
      console.log(`❌ Skipping ${product.Title} - no image available`);
      continue;
    }

    processedProducts.push({
      id: startIndex + index + 1,
      name: correctProductName(product.Title || 'Unknown Product'),
      price: `KES ${productPrice.toLocaleString()}`,
      description,
      category,
      image: productImage
    });
  }

  return groupProductsByBaseName(processedProducts);
};
