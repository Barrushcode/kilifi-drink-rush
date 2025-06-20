
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

export const useOptimizedProducts = ({
  searchTerm,
  selectedCategory,
  currentPage,
  itemsPerPage
}: UseOptimizedProductsParams): UseOptimizedProductsReturn => {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Fetching optimized products...', { searchTerm, selectedCategory, currentPage });

      // Build the query
      let query = supabase
        .from('allthealcoholicproducts')
        .select('Title, Description, Price, "Product image URL"', { count: 'exact' })
        .not('Price', 'is', null)
        .gte('Price', 100)
        .lte('Price', 500000)
        .not('"Product image URL"', 'is', null)
        .neq('"Product image URL"', '');

      // Add search filter if provided
      if (searchTerm.trim()) {
        query = query.ilike('Title', `%${searchTerm.trim()}%`);
      }

      // Add category filter if not "All"
      if (selectedCategory !== 'All') {
        // For category filtering, we'll filter after fetching since category is derived
        // This is a limitation we'll need to work with for now
      }

      // Get total count first
      const countQuery = await query;
      
      if (countQuery.error) throw countQuery.error;
      
      const totalItems = countQuery.count || 0;
      setTotalCount(totalItems);

      // Now get the paginated data
      const startIndex = (currentPage - 1) * itemsPerPage;
      const { data, error } = await query
        .order('Title', { ascending: true })
        .range(startIndex, startIndex + itemsPerPage - 1);

      if (error) throw error;

      console.log(`📦 Fetched ${data?.length || 0} products for page ${currentPage}`);

      if (!data || data.length === 0) {
        setProducts([]);
        return;
      }

      // Process the fetched products
      const transformedProducts: Product[] = [];

      for (let i = 0; i < data.length; i++) {
        const product = data[i];
        
        if (typeof product.Price !== 'number' || isNaN(product.Price)) {
          console.warn('[🛑 MISSING OR INVALID PRICE]', product.Title);
          continue;
        }

        const productPrice = product.Price;
        const description = product.Description || '';

        // Get image - prioritize storage, fallback to URL
        let productImage: string | null = null;
        
        const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');
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

        let category = getCategoryFromName(product.Title || 'Unknown Product', productPrice);

        if (description.toLowerCase().includes('beer')) {
          category = 'Beer';
        }

        transformedProducts.push({
          id: startIndex + i + 1,
          name: product.Title || 'Unknown Product',
          price: `KES ${productPrice.toLocaleString()}`,
          description,
          category,
          image: productImage
        });
      }

      // Apply category filter after processing
      let filteredProducts = transformedProducts;
      if (selectedCategory !== 'All') {
        filteredProducts = transformedProducts.filter(product => {
          const productCategoryLC = product.category.toLowerCase();
          const selectedCategoryLC = selectedCategory.toLowerCase();
          return productCategoryLC.includes(selectedCategoryLC) || 
                 selectedCategoryLC.includes(productCategoryLC);
        });
      }

      const groupedProducts = groupProductsByBaseName(filteredProducts);
      
      console.log(`✨ Successfully processed ${groupedProducts.length} grouped products`);
      setProducts(groupedProducts);

    } catch (error) {
      console.error('💥 Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    refetch
  };
};
