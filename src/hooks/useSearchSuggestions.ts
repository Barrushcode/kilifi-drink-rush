import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebouncedSearch } from './useDebouncedSearch';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category';
  category?: string;
}

export const useSearchSuggestions = (query: string, limit: number = 8) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebouncedSearch(query, 300);

  // Categories to suggest
  const categories = useMemo(() => [
    'Whisky', 'Wine', 'Beer (6-Packs)', 'Champagne', 'Liqueur', 
    'Tequila', 'Gin', 'Cognac', 'Brandy', 'Rum', 'Vodka', 'Mixer', 'Soft Drinks'
  ], []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        // Search for products
        const { data: products, error } = await supabase
          .from('productprice')
          .select('id, Title')
          .ilike('Title', `%${debouncedQuery}%`)
          .limit(limit - 2); // Reserve space for category suggestions

        if (error) throw error;

        const productSuggestions: SearchSuggestion[] = (products || []).map(product => ({
          id: `product-${product.id}`,
          text: product.Title,
          type: 'product' as const,
          category: 'General'
        }));

        // Filter matching categories
        const matchingCategories = categories.filter(category =>
          category.toLowerCase().includes(debouncedQuery.toLowerCase())
        ).slice(0, 2); // Limit to 2 category suggestions

        const categorySuggestions: SearchSuggestion[] = matchingCategories.map(category => ({
          id: `category-${category}`,
          text: category,
          type: 'category' as const
        }));

        // Combine and prioritize: categories first, then products
        setSuggestions([...categorySuggestions, ...productSuggestions]);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, limit, categories]);

  return { suggestions, loading };
};