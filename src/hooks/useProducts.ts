import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
import { findMatchingImage } from '@/services/imageMatchingService';
import { groupProductsByBaseName, GroupedProduct } from '@/utils/productGroupingUtils';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

interface RefinedImage {
  id: number;
  'Product Name': string | null;
  'Final Image URL': string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [productsByOriginalOrder, setProductsByOriginalOrder] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Import the AI image generation service
  // NOTE: Path may need to be adjusted if your file is elsewhere!
  // import inline here to avoid circular reference
  const { AIImageGenerationService } = require('@/services/aiImageGenerationService');

  const fetchAllProducts = async () => {
    const allProducts = [];
    let hasMore = true;
    let offset = 0;
    const batchSize = 1000;

    while (hasMore) {
      const { data, error } = await supabase
        .from('allthealcoholicproducts')
        .select('Title, Description, Price')
        .order('Title', { ascending: true })
        .range(offset, offset + batchSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allProducts.push(...data);
        console.log(`📦 Fetched batch ${Math.floor(offset / batchSize) + 1}: ${data.length} products (total so far: ${allProducts.length})`);
        
        if (data.length < batchSize) {
          hasMore = false;
        } else {
          offset += batchSize;
        }
      } else {
        hasMore = false;
      }
    }

    return allProducts;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Starting to fetch products...');

      const allProductsData = await fetchAllProducts();

      const transformedProducts: Product[] = [];
      
      // Process products in batches
      const batchSize = 20; // Lower batch size to avoid rate limiting
      for (let i = 0; i < allProductsData.length; i += batchSize) {
        const batch = allProductsData.slice(i, i + batchSize);
        console.log(`📦 [AI MODE] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allProductsData.length / batchSize)}`);
        
        const batchPromises = batch.map(async (product, batchIndex) => {
          const globalIndex = i + batchIndex;
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title, 'Raw:', product.Price);
            return null;
          }

          const productPrice = product.Price;

          if (productPrice < 100 || productPrice > 500000) {
            console.warn('[⚠️ OUT-OF-BOUNDS PRICE]', product.Title, 'Price:', productPrice);
          }

          const description = product.Description || '';
          let category = getCategoryFromName(product.Title || 'Unknown Product', productPrice);

          if (description.toLowerCase().includes('beer')) {
            category = 'Beer';
          }

          // Always generate an AI image and ignore database images
          let productImage = "";
          let aiResult = null;
          try {
            aiResult = await AIImageGenerationService.generateProductImage(
              product.Title || 'Unknown Product',
              category
            );
            productImage = aiResult;
            if (aiResult.cached) {
              console.log(`[AI IMAGE][CACHED]: ${product.Title} → ${productImage}`);
            } else {
              console.log(`[AI IMAGE][FRESH]: ${product.Title} → ${productImage}`);
            }
          } catch (error) {
            console.error('[AI IMAGE ERROR]:', product.Title, error);
            // As a last resort, just use the fallback for the category
            productImage = AIImageGenerationService.getFallbackImage(category);
          }

          return {
            id: globalIndex + 1,
            name: product.Title || 'Unknown Product',
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          };
        });

        const batchResults = await Promise.all(batchPromises);
        transformedProducts.push(...batchResults.filter(Boolean));
      }

      const groupedProducts = groupProductsByBaseName(transformedProducts);
      const groupedProductsOrdered = groupProductsByBaseName(transformedProducts, true);

      console.log(`✨ [AI MODE] Successfully processed ${transformedProducts.length} products (AI images only)`);
      console.log('🎯 Sample grouped products:', groupedProducts.slice(0, 3));

      setProducts(groupedProducts);
      setProductsByOriginalOrder(groupedProductsOrdered);
    } catch (error) {
      console.error('💥 Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    productsByOriginalOrder,
    loading,
    error,
    refetch: fetchProducts
  };
};
