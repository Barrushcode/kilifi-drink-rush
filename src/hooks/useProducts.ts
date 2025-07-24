
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName, GroupedProduct } from '@/utils/productGroupingUtils';
import { useProductCache } from './useProductCache';
import { correctProductName } from '@/utils/nameCorrectionUtils';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [productsByOriginalOrder, setProductsByOriginalOrder] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { cachedData, saveToCache, clearCache } = useProductCache();

  const fetchAllProducts = async () => {
    const allProducts = [];
    let hasMore = true;
    let offset = 0;
    const batchSize = 1000;

    while (hasMore) {
    const { data, error } = await supabase
      .from('productprice')
        .select('Title, Description, Price, Category')
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
      
      // Optimized batch processing - smaller batches for better UX
      const batchSize = 50; // Reduced from 100
      for (let i = 0; i < allProductsData.length; i += batchSize) {
        const batch = allProductsData.slice(i, i + batchSize);
        console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allProductsData.length / batchSize)}`);
        
        // Process batch with optimized image checking
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
          
          // Optimized image logic: Check storage first, fallback to database URL
          let productImage: string | null = null;
          
          // First: Try storage bucket (with caching consideration)
          const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');
          if (storageImage) {
            productImage = storageImage;
           }

          // Skip products without any image
          if (!productImage) {
            console.log(`❌ Skipping ${product.Title} - no image available`);
            return null;
          }

           let category = product.Category || getCategoryFromName(product.Title || 'Unknown Product', productPrice);

           if (description.toLowerCase().includes('beer')) {
             category = 'Beer';
           }

          return {
            id: globalIndex + 1,
            name: correctProductName(product.Title || 'Unknown Product'),
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          };
        });

        const batchResults = await Promise.all(batchPromises);
        transformedProducts.push(...batchResults.filter(Boolean));
        
        // Add small delay between batches to prevent UI freezing
        if (i + batchSize < allProductsData.length) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

      const groupedProducts = groupProductsByBaseName(transformedProducts);
      const groupedProductsOrdered = groupProductsByBaseName(transformedProducts, true);

      console.log(`✨ Successfully processed ${transformedProducts.length} products with images`);
      console.log('🎯 Sample grouped products:', groupedProducts.slice(0, 3));

      // Save to cache for faster subsequent loads
      saveToCache(groupedProducts, groupedProductsOrdered);

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
    // Check if we have valid cached data
    if (cachedData && cachedData.products.length > 0) {
      console.log('🚀 Using cached products data');
      setProducts(cachedData.products);
      setProductsByOriginalOrder(cachedData.productsByOriginalOrder);
      setLoading(false);
    } else {
      // No cache or invalid cache, fetch fresh data
      fetchProducts();
    }
  }, [cachedData]);

  const refetch = () => {
    clearCache(); // Clear cache to force fresh fetch
    fetchProducts();
  };

  return {
    products,
    productsByOriginalOrder,
    loading,
    error,
    refetch
  };
};
