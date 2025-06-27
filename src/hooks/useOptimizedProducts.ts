
import { useState, useEffect, useMemo } from 'react';
import { useProducts } from './useProducts';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';

export const useOptimizedProducts = (
  searchTerm: string,
  selectedCategory: string,
  priceRange: [number, number],
  currentPage: number,
  productsPerPage: number = 3
) => {
  const { products: allProducts, loading: isLoading, error } = useProducts();
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  // Filter and paginate products
  const { filteredProducts, totalPages, currentProducts } = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return { filteredProducts: [], totalPages: 0, currentProducts: [] };
    }

    // Apply filters
    let filtered = allProducts.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
        product.name?.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Calculate pagination
    const total = Math.ceil(filtered.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      filteredProducts: filtered,
      totalPages: total,
      currentProducts: paginated
    };
  }, [allProducts, searchTerm, selectedCategory, priceRange, currentPage, productsPerPage]);

  // Optimize images for current page products
  const optimizedProducts = useMemo(() => {
    return currentProducts.map(product => ({
      ...product,
      optimizedImageUrl: getSupabaseProductImageUrl(product.name || '')
    }));
  }, [currentProducts]);

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = optimizedProducts.map(async (product) => {
        if (product.optimizedImageUrl && !imageCache[product.optimizedImageUrl]) {
          try {
            const img = new Image();
            img.src = product.optimizedImageUrl;
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
            return { [product.optimizedImageUrl]: product.optimizedImageUrl };
          } catch {
            return {};
          }
        }
        return {};
      });

      const results = await Promise.allSettled(imagePromises);
      const newCache = results.reduce((acc, result) => {
        if (result.status === 'fulfilled') {
          return { ...acc, ...result.value };
        }
        return acc;
      }, {});

      if (Object.keys(newCache).length > 0) {
        setImageCache(prev => ({ ...prev, ...newCache }));
      }
    };

    if (optimizedProducts.length > 0) {
      preloadImages();
    }
  }, [optimizedProducts, imageCache]);

  return {
    products: optimizedProducts,
    isLoading,
    error: error || '',
    totalPages,
    totalProducts: filteredProducts.length,
    hasProducts: optimizedProducts.length > 0
  };
};
