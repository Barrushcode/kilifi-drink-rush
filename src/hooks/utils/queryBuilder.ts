
import { supabase } from '@/integrations/supabase/client';

export const buildOrFilters = (searchTerm: string, selectedCategory: string): string[] => {
  const orFilters: string[] = [];
  
  if (searchTerm && searchTerm.trim()) {
    const trimmedSearch = searchTerm.trim();
    orFilters.push(`Title.ilike.%${trimmedSearch}%`);
    orFilters.push(`Description.ilike.%${trimmedSearch}%`);
  }

  return orFilters;
};

export const buildCountQuery = (orFilters: string[], selectedCategory: string) => {
  let query = supabase
    .from('productprice')
    .select('*', { count: 'exact', head: true })
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000);

  // Add category filtering if a specific category is selected
  if (selectedCategory && selectedCategory !== 'All') {
    query = query.eq('Category', selectedCategory);
  }

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number, selectedCategory: string) => {
  let query = supabase
    .from('productprice')
    .select('Title, Description, Price, Category', { count: 'exact' })
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000);

  // Add category filtering if a specific category is selected
  if (selectedCategory && selectedCategory !== 'All') {
    query = query.eq('Category', selectedCategory);
  }

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query.order('Title', { ascending: true }).range(startIndex, endIndex);
};
