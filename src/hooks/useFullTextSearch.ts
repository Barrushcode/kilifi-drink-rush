
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoryFromName } from '@/utils/categoryUtils';
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

interface GroupedProduct {
  id: string;
  baseName: string;
  category: string;
  variants: Product[];
  lowestPrice: number;
  lowestPriceFormatted: string;
  representativeImage: string;
}

interface UseFullTextSearchReturn {
  searchResults: GroupedProduct[];
  isSearching: boolean;
  searchError: string | null;
  hasSearched: boolean;
}

export const useFullTextSearch = (searchTerm: string, debounceMs: number = 300): UseFullTextSearchReturn => {
  const [searchResults, setSearchResults] = useState<GroupedProduct[]>([]);
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

        // Perform full-text search across Title and Description
        const { data, error } = await supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"')
          .or(`Title.ilike.%${trimmedSearch}%,Description.ilike.%${trimmedSearch}%`)
          .not('Price', 'is', null)
          .gte('Price', 100)
          .lte('Price', 500000)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '')
          .order('Title', { ascending: true })
          .limit(50); // Limit search results for performance

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

          // Get Supabase image
          const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');

          let productImage: string | null = null;
          if (storageImage) {
            productImage = storageImage;
          } else if (product["Product image URL"] && typeof product["Product image URL"] === "string" && product["Product image URL"].trim().length > 0) {
            productImage = product["Product image URL"];
          }

          // Skip products without images
          if (!productImage) {
            continue;
          }

          // Enhanced category detection
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
        const typedGroupedProducts: GroupedProduct[] = groupedProducts.map(group => ({
          id: group.id,
          baseName: group.baseName,
          category: group.category,
          variants: group.variants,
          lowestPrice: group.lowestPrice,
          lowestPriceFormatted: group.lowestPriceFormatted,
          representativeImage: group.representativeImage || group.variants[0]?.image || ''
        }));
        
        setSearchResults(typedGroupedProducts);
        
        console.log(`✨ Search grouped results: ${typedGroupedProducts.length} products`);

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
