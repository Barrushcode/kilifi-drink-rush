
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

        // Build the query step by step to avoid TypeScript inference issues
        let query = supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"')
          .not('Price', 'is', null)
          .gte('Price', 100)
          .lte('Price', 500000)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '')
          .order('Title', { ascending: true });

        // Apply category filter if not 'All'
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

        // Execute the query
        const { data: allData, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        if (isCancelled) return;

        console.log(`📦 Fetched ${allData?.length || 0} total products before processing`);

        if (!allData || allData.length === 0) {
          console.log('📭 No products found for current criteria');
          setProducts([]);
          setTotalCount(0);
          return;
        }

        // Process all products and filter out those without valid images
        const processedProducts: Product[] = [];
        
        for (let index = 0; index < allData.length; index++) {
          const product = allData[index] as RawProduct;
          
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

          // Skip products without images - this is key for clean display
          if (!productImage) {
            console.log(`❌ Skipping ${product.Title} - no image available`);
            continue;
          }

          // Enhanced category detection using both name and description
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

        if (isCancelled) return;

        // Group products by base name
        const groupedProducts = groupProductsByBaseName(processedProducts);
        
        console.log(`✨ Total grouped products after filtering: ${groupedProducts.length}`);
        
        // Set total count based on grouped products
        setTotalCount(groupedProducts.length);
        
        // Apply pagination to the grouped products
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = groupedProducts.slice(startIndex, endIndex);
        
        console.log(`📄 Page ${currentPage}: showing ${paginatedProducts.length} products (${startIndex + 1}-${Math.min(endIndex, groupedProducts.length)} of ${groupedProducts.length})`);
        
        setProducts(paginatedProducts);

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
