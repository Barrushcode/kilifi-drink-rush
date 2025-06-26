
import { useState, useEffect } from 'react';
import { buildProductsQuery } from './queryBuilder';
import { processRawProducts, applyPagination } from './productProcessor';
import { groupProductsByBaseName } from '@/utils/productGroupingUtils';
import { UseOptimizedProductsParams, UseOptimizedProductsReturn, RawProduct } from './types';

export const useOptimizedProducts = (params: UseOptimizedProductsParams): UseOptimizedProductsReturn => {
  const { searchTerm, selectedCategory, currentPage, itemsPerPage } = params;
  const [products, setProducts] = useState<any[]>([]);
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

        // Build and execute query
        const query = buildProductsQuery(searchTerm, selectedCategory);
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

        // Process products
        const processedProducts = await processRawProducts(allData as RawProduct[]);
        
        if (isCancelled) return;

        // Group products by base name
        const groupedProducts = groupProductsByBaseName(processedProducts);
        
        console.log(`✨ Total grouped products after filtering: ${groupedProducts.length}`);
        
        // Set total count based on grouped products
        setTotalCount(groupedProducts.length);
        
        // Apply pagination to the grouped products
        const paginatedProducts = applyPagination(groupedProducts, currentPage, itemsPerPage);
        
        console.log(`📄 Page ${currentPage}: showing ${paginatedProducts.length} products (${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, groupedProducts.length)} of ${groupedProducts.length})`);
        
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
