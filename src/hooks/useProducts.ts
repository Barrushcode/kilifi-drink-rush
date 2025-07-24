
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
import { getSupabaseProductImageUrl } from '@/utils/enhancedSupabaseImageUrl';
import { groupProductsByBaseName, GroupedProduct } from '@/utils/productGroupingUtils';
import { useProductCache } from './useProductCache';
import { correctProductName } from '@/utils/nameCorrectionUtils';
import '@/utils/debugStorageAccess';

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

          // Always include products - don't skip if no image found
          if (!productImage) {
            console.log(`⚠️ No Supabase image found for ${product.Title} - will use category placeholder`);
            // Use category-specific placeholder
            if (description.toLowerCase().includes('beer')) {
              productImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center';
            } else if (product.Title?.toLowerCase().includes('whiskey') || product.Title?.toLowerCase().includes('whisky')) {
              productImage = 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop&crop=center';
            } else if (product.Title?.toLowerCase().includes('vodka')) {
              productImage = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=300&fit=crop&crop=center';
            } else if (product.Title?.toLowerCase().includes('wine')) {
              productImage = 'https://images.unsplash.com/photo-1506377247717-84a0f8d814f4?w=300&h=300&fit=crop&crop=center';
            } else if (product.Title?.toLowerCase().includes('rum')) {
              productImage = 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=300&h=300&fit=crop&crop=center';
            } else if (product.Title?.toLowerCase().includes('gin')) {
              productImage = 'https://images.unsplash.com/photo-1544145762-54623c6b8e91?w=300&h=300&fit=crop&crop=center';
            } else {
              productImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop&crop=center';
            }
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
