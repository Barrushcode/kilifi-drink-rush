

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
  let query = supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true })
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000)
    .filter('"Product image URL"', 'not.is', null)
    .filter('"Product image URL"', 'neq', '');

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query;
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  let query = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"')
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000)
    .filter('"Product image URL"', 'not.is', null)
    .filter('"Product image URL"', 'neq', '');

  if (orFilters.length > 0) {
    query = query.or(orFilters.join(','));
  }

  return query.order('Title', { ascending: true }).range(startIndex, endIndex);
};

