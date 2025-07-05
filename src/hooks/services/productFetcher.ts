
import { buildOrFilters, buildCountQuery, buildDataQuery } from '../utils/queryBuilder';
import { processRawProducts } from './productProcessor';
import { UseOptimizedProductsParams, RawProduct } from '../types/productTypes';

export const fetchProductsData = async (
  params: UseOptimizedProductsParams,
  isCancelled: () => boolean
) => {
  const { searchTerm, selectedCategory, currentPage, itemsPerPage } = params;
  
  console.log('🔍 Fetching products with filters:', { 
    searchTerm, 
    selectedCategory, 
    currentPage,
    itemsPerPage
  });

  const orFilters = buildOrFilters(searchTerm, selectedCategory);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage - 1;

  // Single optimized query that gets both data and count
  const dataQuery = buildDataQuery(orFilters, startIndex, endIndex);
  const { data, error: fetchError, count } = await dataQuery;

  if (fetchError) throw fetchError;
  if (isCancelled()) return null;

  console.log(`📦 Fetched ${data?.length || 0} products for page ${currentPage}, total: ${count}`);

  if (!data || data.length === 0) {
    console.log('📭 No products found for current criteria');
    return {
      products: [],
      totalCount: count || 0
    };
  }

  const processedProducts = await processRawProducts(data as RawProduct[], startIndex);
  
  if (isCancelled()) return null;

  console.log(`✨ Page ${currentPage} results: ${processedProducts.length} grouped products`);
  
  return {
    products: processedProducts,
    totalCount: count || 0
  };
};
