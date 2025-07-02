
import { supabase } from '@/integrations/supabase/client';

export const buildOrFilters = (searchTerm: string, selectedCategory: string) => {
  const filters = [];
  
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.trim();
    filters.push(
      `Title.ilike.%${term}%`,
      `Description.ilike.%${term}%`,
      `Category.ilike.%${term}%`
    );
  }
  
  if (selectedCategory && selectedCategory !== 'All') {
    filters.push(`Category.ilike.%${selectedCategory}%`);
  }
  
  return filters;
};

export const buildCountQuery = (orFilters: string[], tableName: string = 'Cartegories correct price') => {
  let query = supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
    .not('Price', 'is', null)
    .gt('Price', 0);

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number, tableName: string = 'Cartegories correct price') => {
  let query = supabase
    .from(tableName)
    .select('Title, Description, Price, Category')
    .not('Price', 'is', null)
    .gt('Price', 0)
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};
