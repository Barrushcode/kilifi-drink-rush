import { useMemo } from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';

// These are the ONLY categories that will be shown in filters/order
const FIXED_CATEGORIES = [
  'Whisky',
  'Wine',
  'Beer',
  'Champagne', 
  'Liqueur',
  'Tequila',
  'Gin',
  'Cognac',
  'Brandy',
  'Rum',
  'Vodka',
  'Mixer',
  'Soft Drinks',
];

// Category normalization map
const CATEGORY_MAPPING: Record<string, string> = {
  'whiskey': 'Whisky',
  'whisky': 'Whisky', 
  'wine': 'Wine',
  'wines': 'Wine',
  'beer': 'Beer',
  'beers': 'Beer',
  '6 pack': 'Beer',
  'liqueurs': 'Liqueur',
  'liqueur': 'Liqueur',
  'mixer': 'Mixer',
  'mixers': 'Mixer',
  'bitters': 'Mixer',
  'soft drinks': 'Soft Drinks',
  'ready to drink': 'Soft Drinks',
  'spirit': 'Liqueur',
  'bourbon': 'Whisky',
  'sake': 'Wine',
};

const normalizeCategory = (category: string): string => {
  const normalized = CATEGORY_MAPPING[category.toLowerCase()];
  return normalized || category;
};

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
      // Normalize both categories for comparison
      const normalizedProductCategory = normalizeCategory(product.category);
      const normalizedSelectedCategory = normalizeCategory(selectedCategory);
      
      const matchesCategory = 
        normalizedProductCategory.toLowerCase() === normalizedSelectedCategory.toLowerCase() ||
        normalizedProductCategory.toLowerCase().includes(normalizedSelectedCategory.toLowerCase()) ||
        normalizedSelectedCategory.toLowerCase().includes(normalizedProductCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return {
    categories,
    filteredProducts
  };
};
