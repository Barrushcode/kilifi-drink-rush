
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
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true });

  // Apply filters step by step to avoid deep type instantiation
  const filteredQuery = baseQuery
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Apply OR filters if they exist
  if (orFilters.length === 0) {
    return filteredQuery;
  }
  
  return filteredQuery.or(orFilters.join(','));
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  // Start with base query
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"');

  // Apply filters step by step
  const filteredQuery = baseQuery
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Handle OR filters
  const withOrFilters = orFilters.length > 0 
    ? filteredQuery.or(orFilters.join(','))
    : filteredQuery;

  // Apply ordering and pagination
  return withOrFilters
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);
};
