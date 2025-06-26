
import { supabase } from '@/integrations/supabase/client';

export const buildProductsQuery = (searchTerm: string, selectedCategory: string) => {
  console.log('🔍 Building query with filters:', { searchTerm, selectedCategory });

  // Start with base query
  const baseQuery = supabase
    .from('allthealcoholicproducts')
    .select('Title, Description, Price, "Product image URL"')
    .not('Price', 'is', null)
    .gte('Price', 100)
    .lte('Price', 500000)
    .not('"Product image URL"', 'is', null)
    .neq('"Product image URL"', '')
    .order('Title', { ascending: true });

  // Apply category filter if not 'All'
  let query = baseQuery;
  if (selectedCategory !== 'All') {
    console.log('🏷️ Applying category filter:', selectedCategory);
    query = query.ilike('Description', `%${selectedCategory}%`);
  }

  // Apply search filter if provided
  if (searchTerm && searchTerm.trim()) {
    const trimmedSearch = searchTerm.trim();
    console.log('🔍 Applying search filter:', trimmedSearch);
    query = query.or(`Title.ilike.%${trimmedSearch}%,Description.ilike.%${trimmedSearch}%`);
  }

  return query;
};
