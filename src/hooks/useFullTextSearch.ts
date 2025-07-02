
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

interface SearchGroupedProduct {
  id: string;
  baseName: string;
  category: string;
  variants: Array<{
    size: string;
    price: number;
    priceFormatted: string;
    originalProduct: Product;
  }>;
  lowestPrice: number;
  lowestPriceFormatted: string;
  representativeImage?: string;
}

interface UseFullTextSearchReturn {
  searchResults: SearchGroupedProduct[];
  isSearching: boolean;
  searchError: string | null;
  hasSearched: boolean;
}

export const useFullTextSearch = (searchTerm: string, debounceMs: number = 300): UseFullTextSearchReturn => {
  const [searchResults, setSearchResults] = useState<SearchGroupedProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // If no search term, clear results
    if (!searchTerm || searchTerm.trim().length === 0) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError(null);
        setHasSearched(true);
        
        const trimmedSearch = searchTerm.trim();
        console.log('🔍 Full-text search for:', trimmedSearch);

        // Perform full-text search across Title and Description using the new table
        const { data, error } = await supabase
          .from('Cartegories correct price')
          .select('Title, Description, Price, Category')
          .or(`Title.ilike.%${trimmedSearch}%,Description.ilike.%${trimmedSearch}%`)
          .not('Price', 'is', null)
          .gte('Price', 100)
          .lte('Price', 500000)
          .order('Title', { ascending: true })
          .limit(50);

        if (error) throw error;

        console.log(`📦 Search found ${data?.length || 0} products for "${trimmedSearch}"`);

        if (!data || data.length === 0) {
          setSearchResults([]);
          return;
        }

        // Process search results
        const processedProducts: Product[] = [];
        
        for (let index = 0; index < data.length; index++) {
          const product = data[index];
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            continue;
          }

          const productPrice = product.Price;
          const description = product.Description || '';
          const category = product.Category || 'Uncategorized';

          // Get Supabase image
          const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');

          let productImage: string | null = null;
          if (storageImage) {
            productImage = storageImage;
          }

          // Skip products without images for now
          if (!productImage) {
            continue;
          }

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
        
        // Transform to our local interface
        const searchGroupedProducts: SearchGroupedProduct[] = groupedProducts.map(group => ({
          id: group.id,
          baseName: group.baseName,
          category: group.category,
          variants: group.variants,
          lowestPrice: group.lowestPrice,
          lowestPriceFormatted: group.lowestPriceFormatted,
          representativeImage: group.variants[0]?.originalProduct?.image || ''
        }));
        
        setSearchResults(searchGroupedProducts);
        
        console.log(`✨ Search grouped results: ${searchGroupedProducts.length} products`);

      } catch (error) {
        console.error('💥 Search error:', error);
        setSearchError('Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, debounceMs);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm, debounceMs]);

  return {
    searchResults,
    isSearching,
    searchError,
    hasSearched
  };
};
