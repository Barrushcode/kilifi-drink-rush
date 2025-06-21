
import { useState, useEffect, useCallback } from 'react';
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

interface UseOptimizedProductsParams {
  searchTerm: string;
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
}

interface UseOptimizedProductsReturn {
  products: GroupedProduct[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  refetch: () => void;
}

export const useOptimizedProducts = (params: UseOptimizedProductsParams): UseOptimizedProductsReturn => {
  const { searchTerm, selectedCategory, currentPage, itemsPerPage } = params;
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching optimized products with search:', { searchTerm, selectedCategory, currentPage });

      // Build the query with pre-filtering at database level
      let query = supabase
        .from('allthealcoholicproducts')
        .select('Title, Description, Price, "Product image URL"', { count: 'exact' })
        .not('Price', 'is', null)
        .gte('Price', 100)
        .lte('Price', 500000)
        .not('"Product image URL"', 'is', null)
        .neq('"Product image URL"', '');

      // Enhanced search filter - search in both Title and Description
      if (searchTerm && searchTerm.trim()) {
        const trimmedSearch = searchTerm.trim();
        console.log('🔍 Applying search filter for:', trimmedSearch);
        query = query.or(`Title.ilike.%${trimmedSearch}%,Description.ilike.%${trimmedSearch}%`);
      }

      // Get paginated data directly
      const startIndex = (currentPage - 1) * itemsPerPage;
      const { data, error: fetchError, count } = await query
        .order('Title', { ascending: true })
        .range(startIndex, startIndex + itemsPerPage - 1);

      if (fetchError) throw fetchError;

      console.log(`📦 Fetched ${data?.length || 0} products for page ${currentPage} (total: ${count})`);
      setTotalCount(count || 0);

      if (!data || data.length === 0) {
        console.log('📭 No products found for current search/filter criteria');
        setProducts([]);
        return;
      }

      // Process products with parallel image checks
      const processedProducts = await Promise.all(
        data.map(async (product: any, index: number) => {
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title);
            return null;
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
            console.log(`❌ Skipping ${product.Title} - no image available`);
            return null;
          }

          // Enhanced category detection using both name and description
          const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice, description);

          return {
            id: startIndex + index + 1,
            name: product.Title || 'Unknown Product',
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          };
        })
      );

      // Filter out null results
      const validProducts = processedProducts.filter((p): p is Product => p !== null);

      // Apply category filter after processing
      let filteredProducts = validProducts;
      if (selectedCategory !== 'All') {
        filteredProducts = validProducts.filter(product => {
          const productCategoryLC = product.category.toLowerCase();
          const selectedCategoryLC = selectedCategory.toLowerCase();
          return productCategoryLC.includes(selectedCategoryLC) || 
                 selectedCategoryLC.includes(productCategoryLC);
        });
      }

      const groupedProducts = groupProductsByBaseName(filteredProducts);
      
      console.log(`✨ Search results: ${groupedProducts.length} grouped products found`);
      if (searchTerm) {
        console.log(`🎯 Search term "${searchTerm}" matched ${groupedProducts.length} results`);
      }
      
      setProducts(groupedProducts);

    } catch (error) {
      console.error('💥 Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage]);

  // Simple useEffect with callback dependency to avoid type issues
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    refetch
  };
};
