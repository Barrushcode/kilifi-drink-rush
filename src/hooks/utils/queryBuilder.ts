
import { supabase } from '@/integrations/supabase/client';

export const buildOrFilters = (searchTerm: string, selectedCategory: string) => {
  const orFilters = [];
  
  if (selectedCategory !== 'All') {
    orFilters.push(`Description.ilike.%${selectedCategory}%`);
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
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true })
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  let query = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"')
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);
};
