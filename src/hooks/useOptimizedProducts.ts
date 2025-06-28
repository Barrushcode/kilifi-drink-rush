
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

        // Build OR conditions array for dynamic filters
        const orFilters: string[] = [];
        
        if (selectedCategory !== 'All') {
          orFilters.push(`Description.ilike.%${selectedCategory}%`);
        }
        
        if (searchTerm && searchTerm.trim()) {
          const trimmedSearch = searchTerm.trim();
          orFilters.push(`Title.ilike.%${trimmedSearch}%`);
          orFilters.push(`Description.ilike.%${trimmedSearch}%`);
        }

        // First, get the total count for pagination - use simpler query construction
        const countQueryBase = supabase
          .from('allthealcoholicproducts')
          .select('*', { count: 'exact', head: true });

        // Apply filters step by step to avoid deep type inference
        const countQueryWithPrice = countQueryBase.not('Price', 'is', null);
        const countQueryWithMinPrice = countQueryWithPrice.gte('Price', 100);
        const countQueryWithMaxPrice = countQueryWithMinPrice.lte('Price', 500000);
        const countQueryWithImage = countQueryWithMaxPrice.not('"Product image URL"', 'is', null);
        const countQueryWithImageCheck = countQueryWithImage.neq('"Product image URL"', '');

        // Apply OR filters if any
        const finalCountQuery = orFilters.length > 0 
          ? countQueryWithImageCheck.or(orFilters.join(','))
          : countQueryWithImageCheck;

        const { count } = await finalCountQuery;
        
        if (isCancelled) return;
        
        console.log(`📊 Total matching products: ${count}`);
        setTotalCount(count || 0);

        // Now fetch the actual data for this page - use simpler query construction
        const dataQueryBase = supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"');

        // Apply filters step by step to avoid deep type inference
        const dataQueryWithPrice = dataQueryBase.not('Price', 'is', null);
        const dataQueryWithMinPrice = dataQueryWithPrice.gte('Price', 100);
        const dataQueryWithMaxPrice = dataQueryWithMinPrice.lte('Price', 500000);
        const dataQueryWithImage = dataQueryWithMaxPrice.not('"Product image URL"', 'is', null);
        const dataQueryWithImageCheck = dataQueryWithImage.neq('"Product image URL"', '');

        // Apply OR filters if any
        const dataQueryWithFilters = orFilters.length > 0 
          ? dataQueryWithImageCheck.or(orFilters.join(','))
          : dataQueryWithImageCheck;

        // Apply pagination using Supabase range
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;
        
        const finalDataQuery = dataQueryWithFilters
          .order('Title', { ascending: true })
          .range(startIndex, endIndex);

        const { data, error: fetchError } = await finalDataQuery;

        if (fetchError) throw fetchError;
        if (isCancelled) return;

        console.log(`📦 Fetched ${data?.length || 0} products for page ${currentPage}`);

        if (!data || data.length === 0) {
          console.log('📭 No products found for current criteria');
          setProducts([]);
          return;
        }

        // Process products with explicit typing
        const processedProducts: Product[] = [];
        
        for (let index = 0; index < data.length; index++) {
          const product = data[index] as RawProduct;
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title);
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
            console.log(`❌ Skipping ${product.Title} - no image available`);
            continue;
          }

          // Enhanced category detection using both name and description
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
        
        console.log(`✨ Page ${currentPage} results: ${groupedProducts.length} grouped products`);
        
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
