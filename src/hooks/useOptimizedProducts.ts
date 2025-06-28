
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
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const { searchTerm, selectedCategory, currentPage, itemsPerPage } = params;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('allthealcoholicproducts')
        .select('Title, Description, Price, "Product image URL"')
        .not('Price', 'is', null)
        .gte('Price', 100)
        .lte('Price', 500000);

      // Apply search filter
      if (searchTerm.trim()) {
        query = query.or(`Title.ilike.%${searchTerm.trim()}%,Description.ilike.%${searchTerm.trim()}%`);
      }

      // Calculate pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error: fetchError, count } = await query
        .order('Title', { ascending: true })
        .range(from, to)
        .count();

      if (fetchError) throw fetchError;

      const transformedProducts: Product[] = [];
      
      if (data) {
        for (let index = 0; index < data.length; index++) {
          const product = data[index];
          
          if (typeof product.Price !== 'number' || isNaN(product.Price)) {
            continue;
          }

          const productPrice = product.Price;
          const description = product.Description || '';

          // Get image
          const storageImage = await getSupabaseProductImageUrl(product.Title || 'Unknown Product');
          let productImage: string | null = null;
          
          if (storageImage) {
            productImage = storageImage;
          } else if (product["Product image URL"] && typeof product["Product image URL"] === "string" && product["Product image URL"].trim().length > 0) {
            productImage = product["Product image URL"];
          }

          if (!productImage) {
            continue;
          }

          const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice, description);

          transformedProducts.push({
            id: from + index + 1,
            name: product.Title || 'Unknown Product',
            price: `KES ${productPrice.toLocaleString()}`,
            description,
            category,
            image: productImage
          });
        }
      }

      const groupedProducts = groupProductsByBaseName(transformedProducts);
      
      // Filter by category
      const filteredProducts = selectedCategory === 'All' 
        ? groupedProducts 
        : groupedProducts.filter(product => {
            const productCategoryLC = product.category.toLowerCase();
            const selectedCategoryLC = selectedCategory.toLowerCase();
            return productCategoryLC.includes(selectedCategoryLC) || 
                   selectedCategoryLC.includes(productCategoryLC);
          });

      setProducts(filteredProducts);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    refetch: fetchProducts
  };
};
