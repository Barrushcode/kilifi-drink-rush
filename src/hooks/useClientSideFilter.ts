
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

    // Simple JavaScript string matching - no complex logic
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        // Basic string includes matching like plain JavaScript
        const nameMatch = product.baseName.toLowerCase().includes(searchLower);
        const categoryMatch = product.category.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description && product.description.toLowerCase().includes(searchLower);
        
        return nameMatch || categoryMatch || descriptionMatch;
      });
    }

    // Simple category matching
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => {
        const productCategory = product.category.toLowerCase();
        const selectedCategoryLower = selectedCategory.toLowerCase();
        return productCategory.includes(selectedCategoryLower);
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  return filteredProducts;
};
