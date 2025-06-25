
import { useState, useEffect } from 'react';
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

interface RawProduct {
  Title: string | null;
  Description: string | null;
  Price: number;
  "Product image URL": string | null;
}

export const useOptimizedProducts = (params: UseOptimizedProductsParams): UseOptimizedProductsReturn => {
  const { searchTerm, selectedCategory, currentPage, itemsPerPage } = params;
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching products with category filter:', { 
          searchTerm, 
          selectedCategory, 
          currentPage 
        });

        // Build query with proper typing
        const baseQuery = supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"', { count: 'exact' });

        // Apply filters step by step
        let finalQuery = baseQuery;

        if (selectedCategory !== 'All') {
          console.log('🏷️ Applying category filter on description:', selectedCategory);
          finalQuery = finalQuery.ilike('Description', `%${selectedCategory}%`);
        }
        
        if (searchTerm && searchTerm.trim()) {
          const trimmedSearch = searchTerm.trim();
          console.log('🔍 Applying search filter:', trimmedSearch);
          finalQuery = finalQuery.or(`Title.ilike.%${trimmedSearch}%,Description.ilike.%${trimmedSearch}%`);
        }

        // Apply basic filters with explicit typing
        finalQuery = finalQuery
          .not('Price', 'is', null)
          .gte('Price', 100)
          .lte('Price', 500000)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '');

        // Add ordering and pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        finalQuery = finalQuery
          .order('Title', { ascending: true })
          .range(startIndex, startIndex + itemsPerPage - 1);

        // Execute the query
        const { data, error: fetchError, count } = await finalQuery;

        if (fetchError) throw fetchError;
        if (isCancelled) return;

        console.log(`📦 Fetched ${data?.length || 0} products for page ${currentPage} (total: ${count})`);
        setTotalCount(count || 0);

        if (!data || data.length === 0) {
          console.log('📭 No products found for current criteria');
          setProducts([]);
          return;
        }

        // Process products with better image validation
        const processedProducts: Product[] = [];
        
        for (let index = 0; index < data.length; index++) {
          const product = data[index] as RawProduct;
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title);
            continue;
          }

          const productPrice = product.Price;
          const description = product.Description || '';

          // Enhanced image validation - get Supabase image first
          const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');
          let productImage: string | null = null;

          if (storageImage) {
            productImage = storageImage;
          } else if (product["Product image URL"] && typeof product["Product image URL"] === "string" && product["Product image URL"].trim().length > 0) {
            productImage = product["Product image URL"];
          }

          // Skip products without valid images completely
          if (!productImage) {
            console.log(`❌ Skipping ${product.Title} - no valid image available`);
            continue;
          }

          // Enhanced category detection
          const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice, description);

          processedProducts.push({
            id: startIndex + index + 1,
            name: product.Title || 'Unknown Product',
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          });
        }

        if (isCancelled) return;

        const groupedProducts = groupProductsByBaseName(processedProducts);
        
        console.log(`✨ Category filter results: ${groupedProducts.length} grouped products found`);
        setProducts(groupedProducts);

      } catch (error) {
        if (isCancelled) return;
        console.error('💥 Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isCancelled = true;
    };
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage, refetchTrigger]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
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
