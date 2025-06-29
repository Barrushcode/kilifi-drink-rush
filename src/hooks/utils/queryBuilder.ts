
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
  // Create base query with explicit typing
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true })
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Handle OR filters separately to avoid deep type instantiation
  if (orFilters.length === 0) {
    return baseQuery;
  }
  
  // Apply OR filter as final step
  return baseQuery.or(orFilters.join(','));
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  // Create base query with all standard filters
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"')
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Apply OR filters if they exist
  const queryWithFilters = orFilters.length > 0 
    ? baseQuery.or(orFilters.join(','))
    : baseQuery;

  // Apply ordering and pagination as final step
  return queryWithFilters
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);
};
