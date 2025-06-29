
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
  // Build the query using the raw SQL approach to avoid type complexity
  let query = supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true });

  // Apply basic filters
  query = query.not('Price', 'is', null);
  query = query.gte('Price', 100);
  query = query.lte('Price', 500000);
  query = query.not('"Product image URL"', 'is', null);
  query = query.neq('"Product image URL"', '');

  // Apply OR filters if they exist
  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  // Build the query step by step to avoid type complexity
  let query = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"');

  // Apply basic filters
  query = query.not('Price', 'is', null);
  query = query.gte('Price', 100);
  query = query.lte('Price', 500000);
  query = query.not('"Product image URL"', 'is', null);
  query = query.neq('"Product image URL"', '');

  // Apply OR filters if they exist
  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  // Apply ordering and pagination
  query = query.order('Title', { ascending: true });
  query = query.range(startIndex, endIndex);

  return query;
};
