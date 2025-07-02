
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName, GroupedProduct } from '@/utils/productGroupingUtils';
import { useProductCache } from './useProductCache';

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
        .from('Cartegories correct price')
        .select('Title, Description, Price, Category')
        .not('Price', 'is', null)
        .gt('Price', 0)
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
      console.log('🚀 Starting to fetch products from "Cartegories correct price" table...');
      
      const allProductsData = await fetchAllProducts();
      const transformedProducts: Product[] = [];
      
      // Optimized batch processing for faster loading
      const batchSize = 25; // Smaller batches for faster UI updates
      for (let i = 0; i < allProductsData.length; i += batchSize) {
        const batch = allProductsData.slice(i, i + batchSize);
        console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allProductsData.length / batchSize)}`);
        
        const batchPromises = batch.map(async (product, batchIndex) => {
          const globalIndex = i + batchIndex;
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title, 'Raw:', product.Price);
            return null;
          }

          const productPrice = product.Price;
          const description = product.Description || '';
          const category = product.Category || getCategoryFromName(product.Title || 'Unknown Product', productPrice);

          // Fast image lookup from storage bucket
          const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');
          
          // Use fallback if no storage image found
          const productImage = storageImage || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

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
        
        // Smaller delay for faster loading
        if (i + batchSize < allProductsData.length) {
          await new Promise(resolve => setTimeout(resolve, 5));
        }
      }

      const groupedProducts = groupProductsByBaseName(transformedProducts);
      const groupedProductsOrdered = groupProductsByBaseName(transformedProducts, true);

      console.log(`✨ Successfully processed ${transformedProducts.length} products from "Cartegories correct price" table`);

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
