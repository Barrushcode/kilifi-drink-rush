
import { useMemo } from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface UseClientSideFilterProps {
  products: GroupedProduct[];
  searchTerm: string;
  selectedCategory: string;
}

export const useClientSideFilter = ({ products, searchTerm, selectedCategory }: UseClientSideFilterProps) => {
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter - simple string matching
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        // Search in product name, category, and description of variants
        const nameMatch = product.baseName.toLowerCase().includes(searchLower);
        const categoryMatch = product.category.toLowerCase().includes(searchLower);
        const variantMatch = product.variants.some(variant => 
          variant.originalProduct.name.toLowerCase().includes(searchLower) ||
          (variant.originalProduct.description && variant.originalProduct.description.toLowerCase().includes(searchLower))
        );
        
        return nameMatch || categoryMatch || variantMatch;
      });
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const productCategoryLC = product.category.toLowerCase();
        const selectedCategoryLC = selectedCategory.toLowerCase();
        return productCategoryLC.includes(selectedCategoryLC) || 
               selectedCategoryLC.includes(productCategoryLC);
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  return filteredProducts;
};
