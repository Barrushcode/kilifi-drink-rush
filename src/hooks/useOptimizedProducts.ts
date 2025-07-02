
import { useState, useEffect } from 'react';
import { fetchProductsData } from './services/productFetcher';
import { UseOptimizedProductsParams, UseOptimizedProductsReturn, GroupedProduct } from './types/productTypes';

export const useOptimizedProducts = (params: UseOptimizedProductsParams): UseOptimizedProductsReturn => {
  const { searchTerm, selectedCategory, currentPage, itemsPerPage } = params;
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Cache for next page preloading
  const [nextPageCache, setNextPageCache] = useState<Map<string, GroupedProduct[]>>(new Map());

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cacheKey = `${searchTerm}-${selectedCategory}-${currentPage}-${itemsPerPage}`;
        if (nextPageCache.has(cacheKey)) {
          const cachedProducts = nextPageCache.get(cacheKey)!;
          setProducts(cachedProducts);
          setLoading(false);
          console.log('📦 Using cached products for page', currentPage);
          return;
        }

        const result = await fetchProductsData(params, () => isCancelled);
        
        if (result && !isCancelled) {
          setProducts(result.products);
          setTotalCount(result.totalCount);
          
          // Cache current page
          nextPageCache.set(cacheKey, result.products);
          
          // Preload next page if it exists
          const totalPages = Math.ceil(result.totalCount / itemsPerPage);
          if (currentPage < totalPages) {
            const nextPageKey = `${searchTerm}-${selectedCategory}-${currentPage + 1}-${itemsPerPage}`;
            if (!nextPageCache.has(nextPageKey)) {
              // Preload next page in background
              setTimeout(async () => {
                try {
                  const nextPageResult = await fetchProductsData({
                    ...params,
                    currentPage: currentPage + 1
                  }, () => false);
                  
                  if (nextPageResult) {
                    nextPageCache.set(nextPageKey, nextPageResult.products);
                    console.log('🚀 Preloaded page', currentPage + 1);
                  }
                } catch (err) {
                  console.log('Preload failed for next page:', err);
                }
              }, 500); // Delay preload by 500ms
            }
          }
          
          // Limit cache size
          if (nextPageCache.size > 10) {
            const firstKey = nextPageCache.keys().next().value;
            nextPageCache.delete(firstKey);
          }
        }

      } catch (error) {
        if (isCancelled) return;
        console.error('💥 Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage, refetchTrigger]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const refetch = () => {
    setNextPageCache(new Map()); // Clear cache on refetch
    setRefetchTrigger(prev => prev + 1);
  };

  return {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    refetch
  };
};
