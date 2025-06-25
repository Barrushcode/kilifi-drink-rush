
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

// Define the raw product type from Supabase
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
        console.log('🔍 Fetching products with filters:', { 
          searchTerm, 
          selectedCategory, 
          currentPage,
          itemsPerPage
        });

        // Build query step by step to avoid complex type inference
        let query = supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"');

        // Apply category filter
        if (selectedCategory !== 'All') {
          console.log('🏷️ Applying category filter on description:', selectedCategory);
          query = query.ilike('Description', `%${selectedCategory}%`);
        }
        
        // Apply search filter
        if (searchTerm && searchTerm.trim()) {
          const trimmedSearch = searchTerm.trim();
          console.log('🔍 Applying search filter:', trimmedSearch);
          query = query.or(`Title.ilike.%${trimmedSearch}%,Description.ilike.%${trimmedSearch}%`);
        }

        // Apply basic filters and ordering
        query = query
          .not('Price', 'is', null)
          .gte('Price', 100)
          .lte('Price', 500000)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '')
          .order('Title', { ascending: true });

        // Execute the query
        const { data: allData, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        if (isCancelled) return;

        console.log(`📦 Fetched ${allData?.length || 0} products matching filters`);

        if (!allData || allData.length === 0) {
          console.log('📭 No products found for current criteria');
          setProducts([]);
          setTotalCount(0);
          return;
        }

        // Process products with explicit typing
        const processedProducts: Product[] = [];
        
        for (let index = 0; index < allData.length; index++) {
          const rawProduct = allData[index];
          
          // Type guard for price
          if (typeof rawProduct.Price !== 'number' || isNaN(rawProduct.Price)) {
            console.warn('[🛑 MISSING OR INVALID PRICE]', rawProduct.Title);
            continue;
          }

          const productPrice = rawProduct.Price;
          const description = rawProduct.Description || '';

          // Get Supabase image
          const storageImage = await getSupabaseProductImageUrl(rawProduct.Title || 'Unknown Product');

          let productImage: string | null = null;
          if (storageImage) {
            productImage = storageImage;
          } else if (rawProduct["Product image URL"] && 
                     typeof rawProduct["Product image URL"] === "string" && 
                     rawProduct["Product image URL"].trim().length > 0) {
            productImage = rawProduct["Product image URL"];
          }

          // Skip products without images
          if (!productImage) {
            console.log(`❌ Skipping ${rawProduct.Title} - no image available`);
            continue;
          }

          // Enhanced category detection using both name and description
          const category = getCategoryFromName(rawProduct.Title || 'Unknown Product', productPrice, description);

          processedProducts.push({
            id: index + 1,
            name: rawProduct.Title || 'Unknown Product',
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          });
        }

        if (isCancelled) return;

        // Group products by base name
        const groupedProducts = groupProductsByBaseName(processedProducts);
        
        console.log(`✨ After grouping and image filtering: ${groupedProducts.length} grouped products`);
        
        // Apply pagination to the grouped and filtered results
        const totalFilteredCount = groupedProducts.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = groupedProducts.slice(startIndex, endIndex);

        console.log(`📄 Page ${currentPage}: showing products ${startIndex + 1}-${Math.min(endIndex, totalFilteredCount)} of ${totalFilteredCount}`);
        
        setProducts(paginatedProducts);
        setTotalCount(totalFilteredCount);

      } catch (error) {
        if (isCancelled) return;
        console.error('💥 Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
        setTotalCount(0);
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
