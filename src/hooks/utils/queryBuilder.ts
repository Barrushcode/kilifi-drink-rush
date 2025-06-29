
import { supabase } from '@/integrations/supabase/client';

export const buildOrFilters = (searchTerm: string, selectedCategory: string): string[] => {
  const orFilters: string[] = [];
  
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
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true })
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  if (orFilters.length > 0) {
    return baseQuery.or(orFilters.join(','));
  }

  return baseQuery;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"')
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  const filteredQuery = orFilters.length > 0 
    ? baseQuery.or(orFilters.join(','))
    : baseQuery;

  return filteredQuery
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);
};
