
import { useMemo } from 'react';
import { Product } from '@/integrations/supabase/types';

interface OptimizedProduct extends Product {
  searchText?: string;
  categoryMatch?: boolean;
}

export const useOptimizedProducts = (products: Product[] | undefined) => {
  return useMemo(() => {
    if (!products) return [];
    
    return products.map((product): OptimizedProduct => ({
      ...product,
      searchText: `${product.name || ''} ${product.category || ''} ${product.brand || ''}`.toLowerCase(),
      categoryMatch: false
    }));
  }, [products]);
};
