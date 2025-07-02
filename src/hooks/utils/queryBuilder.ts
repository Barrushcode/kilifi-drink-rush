
import { supabase } from '@/integrations/supabase/client';

export const buildOrFilters = (searchTerm: string, selectedCategory: string): string[] => {
  const orFilters: string[] = [];
  
  if (selectedCategory !== 'All') {
    orFilters.push(`Category.ilike.%${selectedCategory}%`);
  }
  
  if (searchTerm && searchTerm.trim()) {
    const trimmedSearch = searchTerm.trim();
    orFilters.push(`Title.ilike.%${trimmedSearch}%`);
    orFilters.push(`Description.ilike.%${trimmedSearch}%`);
  }

  return orFilters;
};

export const buildCountQuery = (orFilters: string[]) => {
  let query = supabase
    .from('Product Cartegory')
    .select('*', { count: 'exact', head: true })
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000);

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  let query = supabase
    .from('Product Cartegory')
    .select('Title, Description, Price, Category')
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000);

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query.order('Title', { ascending: true }).range(startIndex, endIndex);
};
