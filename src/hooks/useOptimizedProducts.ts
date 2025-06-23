
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

export const useOptimizedProducts = (params: UseOptimizedProductsParams): UseOptimizedProductsReturn => {
  const { searchTerm, selectedCategory, currentPage, itemsPerPage } = params;
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Effect to trigger fetch when params change
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

        // Build the query with category-based description filtering
        let query = supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price, "Product image URL"', { count: 'exact' })
          .not('Price', 'is', null)
          .gte('Price', 100)
          .lte('Price', 500000)
          .not('"Product image URL"', 'is', null)
          .neq('"Product image URL"', '');

        // Apply category filter on description field
        if (selectedCategory !== 'All') {
          console.log('🏷️ Applying category filter on description:', selectedCategory);
          query = query.ilike('Description', `%${selectedCategory}%`);
        }

        // Apply search filter if provided
        if (searchTerm && searchTerm.trim()) {
          const trimmedSearch = searchTerm.trim();
          console.log('🔍 Applying search filter:', trimmedSearch);
          query = query.or(`Title.ilike.%${trimmedSearch}%,Description.ilike.%${trimmedSearch}%`);
        }

        // Get paginated data
        const startIndex = (currentPage - 1) * itemsPerPage;
        const { data, error: fetchError, count } = await query
          .order('Title', { ascending: true })
          .range(startIndex, startIndex + itemsPerPage - 1);

        if (fetchError) throw fetchError;
        if (isCancelled) return;

        console.log(`📦 Fetched ${data?.length || 0} products for page ${currentPage} (total: ${count})`);
        setTotalCount(count || 0);

        if (!data || data.length === 0) {
          console.log('📭 No products found for current criteria');
          setProducts([]);
          return;
        }

        // Process products
        const processedProducts: Product[] = [];
        
        for (let index = 0; index < data.length; index++) {
          const product = data[index];
          
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
        
        console.log(`✨ Category filter results: ${groupedProducts.length} grouped products found`);
        if (selectedCategory !== 'All') {
          console.log(`🎯 Category "${selectedCategory}" matched ${groupedProducts.length} results`);
        }
        
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
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const refetch = () => {
    // Trigger re-fetch by updating a dependency
    setLoading(true);
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
