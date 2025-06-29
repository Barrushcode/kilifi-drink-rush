
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
  // Use rpc or a simpler approach to avoid complex type chaining
  const baseFilters = [
    'Price.not.is.null',
    'Price.gte.100',
    'Price.lte.500000',
    '"Product image URL".not.is.null',
    '"Product image URL".neq.'
  ];
  
  let allFilters = baseFilters;
  if (orFilters.length > 0) {
    allFilters.push(`or(${orFilters.join(',')})`);
  }
  
  return supabase
    .from('allthealcoholicproducts')
    .select('*', { count: 'exact', head: true })
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000)
    .filter('"Product image URL"', 'not.is', null)
    .filter('"Product image URL"', 'neq', '')
    .modify((query) => {
      if (orFilters.length > 0) {
        return query.or(orFilters.join(','));
      }
      return query;
    });
};

export const buildDataQuery = (orFilters: string[], startIndex: number, endIndex: number) => {
  return supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"')
    .filter('Price', 'not.is', null)
    .filter('Price', 'gte', 100)
    .filter('Price', 'lte', 500000)
    .filter('"Product image URL"', 'not.is', null)
    .filter('"Product image URL"', 'neq', '')
    .modify((query) => {
      if (orFilters.length > 0) {
        return query.or(orFilters.join(','));
      }
      return query;
    })
    .order('Title', { ascending: true })
    .range(startIndex, endIndex);
};
