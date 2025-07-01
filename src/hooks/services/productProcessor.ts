
import { FiltersImageService } from '@/services/filtersImageService';
import { correctProductName } from '@/utils/nameCorrectionUtils';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';
import { Product, RawProduct, GroupedProduct } from '../types/productTypes';

let filterImagesCache: any[] = [];

export const processRawProducts = async (
  data: RawProduct[], 
  startIndex: number
): Promise<GroupedProduct[]> => {
  // Load filter images once
  if (filterImagesCache.length === 0) {
    filterImagesCache = await FiltersImageService.getAllFilterImages();
  }

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

    // Correct product name for typos
    const correctedName = correctProductName(product.Title || 'Unknown Product');

    // Find matching image from filters bucket
    const matchingImage = FiltersImageService.findBestMatch(correctedName, filterImagesCache);

    // Skip products without matching images
    if (!matchingImage) {
      console.log(`❌ Skipping ${correctedName} - no matching image in filters bucket`);
      continue;
    }

    processedProducts.push({
      id: startIndex + index + 1,
      name: correctedName,
      price: `KES ${productPrice.toLocaleString()}`,
      description,
      category,
      image: matchingImage
    });
  }

  console.log(`✅ Processed ${processedProducts.length} products with matching images`);
  return groupProductsByBaseName(processedProducts);
};
