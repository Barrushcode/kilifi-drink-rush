
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName, GroupedProduct } from '@/utils/productGroupingUtils';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

interface UseFullTextSearchReturn {
  searchResults: GroupedProduct[];
  isSearching: boolean;
  searchError: string | null;
  hasSearched: boolean;
}

interface SupabaseProduct {
  Title: string | null;
  Description: string | null;
  Price: number | null;
  "Product image URL": string | null;
}

export const useFullTextSearch = (searchTerm: string, debounceMs: number = 300): UseFullTextSearchReturn => {
  const [searchResults, setSearchResults] = useState<GroupedProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearchTerm = useMemo(() => {
    return searchTerm?.trim() || '';
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length === 0) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError(null);
        setHasSearched(true);
        
        console.log('🔍 Full-text search for:', debouncedSearchTerm);

        const { data, error } = await supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"')
          .or(`Title.ilike.%${debouncedSearchTerm}%,Description.ilike.%${debouncedSearchTerm}%`)
          .not('Price', 'is', null)
          .gte('Price', 100)
          .lte('Price', 500000)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '')
          .order('Title', { ascending: true })
          .limit(50);

        if (error) throw error;

        console.log(`📦 Search found ${data?.length || 0} products for "${debouncedSearchTerm}"`);

        if (!data || data.length === 0) {
          setSearchResults([]);
          return;
        }

        const processedProducts: Product[] = [];
        
        for (let index = 0; index < data.length; index++) {
          const product = data[index] as SupabaseProduct;
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            continue;
          }

          const productPrice = product.Price;
          const description = product.Description || '';

          const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');

          let productImage: string | null = null;
          if (storageImage) {
            productImage = storageImage;
          } else if (product["Product image URL"] && typeof product["Product image URL"] === "string" && product["Product image URL"].trim().length > 0) {
            productImage = product["Product image URL"];
          }

          if (!productImage) {
            continue;
          }

          const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice, description);

          processedProducts.push({
            id: index + 1,
            name: product.Title || 'Unknown Product',
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          });
        }

        const groupedProducts = groupProductsByBaseName(processedProducts);
        setSearchResults(groupedProducts);
        
        console.log(`✨ Search grouped results: ${groupedProducts.length} products`);

      } catch (error) {
        console.error('💥 Search error:', error);
        setSearchError('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => clearTimeout(searchTimeout);
  }, [debouncedSearchTerm, debounceMs]);

  return {
    searchResults,
    isSearching,
    searchError,
    hasSearched
  };
};
