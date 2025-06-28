
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

        // Build the base query conditions separately to avoid deep type inference
        const baseConditions = {
          priceNotNull: true,
          priceMin: 100,
          priceMax: 500000,
          imageNotNull: true,
          imageNotEmpty: true
        };

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

        // First, get the total count for pagination - build query step by step
        const countQueryBuilder = supabase
          .from('allthealcoholicproducts')
          .select('*', { count: 'exact', head: true });

        // Apply base filters
        let countQuery = countQueryBuilder
          .not('Price', 'is', null)
          .gte('Price', baseConditions.priceMin)
          .lte('Price', baseConditions.priceMax)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '');

        // Apply OR filters if any
        if (orFilters.length > 0) {
          countQuery = countQuery.or(orFilters.join(','));
        }

        const { count } = await countQuery;
        
        if (isCancelled) return;
        
        console.log(`📊 Total matching products: ${count}`);
        setTotalCount(count || 0);

        // Now fetch the actual data for this page - build query step by step
        const dataQueryBuilder = supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"');

        // Apply base filters
        let dataQuery = dataQueryBuilder
          .not('Price', 'is', null)
          .gte('Price', baseConditions.priceMin)
          .lte('Price', baseConditions.priceMax)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '');

        // Apply OR filters if any
        if (orFilters.length > 0) {
          dataQuery = dataQuery.or(orFilters.join(','));
        }

        // Apply pagination using Supabase range
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage - 1;
        
        dataQuery = dataQuery
          .order('Title', { ascending: true })
          .range(startIndex, endIndex);

        const { data, error: fetchError } = await dataQuery;

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
