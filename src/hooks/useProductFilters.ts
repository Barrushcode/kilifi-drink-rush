import { useMemo } from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';

// These are the ONLY categories that will be shown in filters/order
const FIXED_CATEGORIES = [
  'Whisky',
  'Wine',
  'Beers',
  'Champagne',
  'Liqueur',
  'Tequila',
  'Gin',
  'Cognac',
  'Brandy',
  'Rum',
  'Vodka',
  'Juices', // Added Juices here
];

export const useProductFilters = (products: GroupedProduct[], searchTerm: string, selectedCategory: string) => {
  // Only show the fixed categories + All for filtering
  const categories = useMemo(() => ['All', ...FIXED_CATEGORIES], []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search in base name and all variant sizes
      const matchesSearch = product.baseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variants.some(variant =>
          variant.originalProduct.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      if (selectedCategory === 'All') {
        return matchesSearch;
      }
      // Enhanced: match if productCategory includes selectedCategory OR selectedCategory includes productCategory (case-insensitive)
      const productCategoryLC = product.category.toLowerCase();
      const selectedCategoryLC = selectedCategory.toLowerCase();
      const matchesCategory =
        productCategoryLC.includes(selectedCategoryLC) ||
        selectedCategoryLC.includes(productCategoryLC);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return {
    categories,
    filteredProducts
  };
};
