
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
  // Start with base query
  const query = supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true });

  // Apply basic filters
  const filteredQuery = query
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Apply OR filters if any exist
  if (orFilters.length > 0) {
    return filteredQuery.or(orFilters.join(','));
  }

  return filteredQuery;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  // Start with base query
  const query = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"');

  // Apply basic filters
  const filteredQuery = query
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Apply OR filters if any exist
  let finalQuery = filteredQuery;
  if (orFilters.length > 0) {
    finalQuery = filteredQuery.or(orFilters.join(','));
  }

  // Apply ordering and range
  return finalQuery
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);
};
