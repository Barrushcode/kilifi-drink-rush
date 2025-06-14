import { useMemo } from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';

export const useProductFilters = (products: GroupedProduct[], searchTerm: string, selectedCategory: string) => {
  // Extract categories from products and prioritize Wine first, then by alphabetical order
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    
    // Sort categories with "Wine" (case-insensitive, or containing "wine") first, then alphabetically
    const sortedCategories = uniqueCategories.sort((a, b) => {
      const aIsWine = a.toLowerCase().includes('wine');
      const bIsWine = b.toLowerCase().includes('wine');
      if (aIsWine && !bIsWine) return -1;
      if (!aIsWine && bIsWine) return 1;
      return a.localeCompare(b);
    });

    return ['All', ...sortedCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search in base name and all variant sizes
      const matchesSearch = product.baseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.variants.some(variant => 
                             variant.originalProduct.name.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return {
    categories,
    filteredProducts
  };
};
