
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
  // Build the base query step by step to avoid deep type instantiation
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true });

  // Apply filters one by one
  let query = baseQuery
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Apply OR filters if any exist
  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  // Build the base query step by step to avoid deep type instantiation
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"');

  // Apply filters one by one
  let query = baseQuery
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '');

  // Apply OR filters if any exist
  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  // Apply ordering and range
  return query
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);
};
