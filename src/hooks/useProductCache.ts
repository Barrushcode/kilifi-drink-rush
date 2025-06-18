
import { useState, useEffect } from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface CachedProducts {
  products: GroupedProduct[];
  productsByOriginalOrder: GroupedProduct[];
  timestamp: number;
  version: string;
}

const CACHE_KEY = 'barrushke_products_cache';
const CACHE_VERSION = '1.0';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useProductCache = () => {
  const [cachedData, setCachedData] = useState<CachedProducts | null>(null);

  // Load from cache on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsedCache: CachedProducts = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is valid (not expired and correct version)
        if (
          parsedCache.version === CACHE_VERSION &&
          (now - parsedCache.timestamp) < CACHE_DURATION &&
          parsedCache.products.length > 0
        ) {
          console.log('📦 Loading products from cache:', parsedCache.products.length, 'products');
          setCachedData(parsedCache);
        } else {
          console.log('🗑️ Cache expired or invalid, clearing...');
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('❌ Error loading cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  const saveToCache = (products: GroupedProduct[], productsByOriginalOrder: GroupedProduct[]) => {
    try {
      const cacheData: CachedProducts = {
        products,
        productsByOriginalOrder,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setCachedData(cacheData);
      console.log('💾 Products saved to cache');
    } catch (error) {
      console.error('❌ Error saving to cache:', error);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    setCachedData(null);
    console.log('🗑️ Cache cleared');
  };

  const isCacheValid = (): boolean => {
    if (!cachedData) return false;
    
    const now = Date.now();
    return (
      cachedData.version === CACHE_VERSION &&
      (now - cachedData.timestamp) < CACHE_DURATION &&
      cachedData.products.length > 0
    );
  };

  return {
    cachedData: isCacheValid() ? cachedData : null,
    saveToCache,
    clearCache,
    isCacheValid: isCacheValid()
  };
};
