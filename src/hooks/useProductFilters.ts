import { useMemo } from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';
import { useCategories } from '@/hooks/useCategories';

// Category normalization map
const CATEGORY_MAPPING: Record<string, string> = {
  'whiskey': 'Whisky',
  'whisky': 'Whisky', 
  'wine': 'Wine',
  'wines': 'Wine',
  'beer': 'Beer (6-Packs)',
  'beers': 'Beer (6-Packs)',
  '6 pack': 'Beer (6-Packs)',
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
  // Get categories from Supabase
  const { categories } = useCategories();

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
      
      // Handle Beer (6-Packs) special case - match if selected category contains "Beer" and product is beer
      const isBeerMatch = selectedCategory.includes('Beer') && 
        (normalizedProductCategory.toLowerCase().includes('beer') || product.category.toLowerCase().includes('beer'));
      
      const matchesCategory = 
        isBeerMatch ||
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
