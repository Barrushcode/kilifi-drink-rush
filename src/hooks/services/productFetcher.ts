
import { buildOrFilters, buildCountQuery, buildDataQuery } from '../utils/queryBuilder';
import { processRawProducts } from './productProcessor';
import { UseOptimizedProductsParams, RawProduct } from '../types/productTypes';

// Backup product fetcher with timeout
const fetchBackupProducts = async (): Promise<any[]> => {
  try {
    const response = await fetch('/backupProducts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch backup products');
    }
    return await response.json();
  } catch (error) {
    console.error('📁 Error loading backup products:', error);
    return [];
  }
};

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

  try {
    // Create a timeout promise (5 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Supabase request timeout')), 5000);
    });

    // Race between Supabase query and timeout
    const dataQuery = buildDataQuery(orFilters, startIndex, endIndex, selectedCategory);
    const { data, error: fetchError, count } = await Promise.race([
      dataQuery,
      timeoutPromise
    ]) as any;

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

  } catch (error) {
    console.warn('⚠️ Supabase unavailable, falling back to backup products:', error);
    
    if (isCancelled()) return null;

    // Fallback to backup products
    const backupProducts = await fetchBackupProducts();
    
    if (isCancelled()) return null;

    // Transform backup products to match GroupedProduct format
    const transformedProducts = backupProducts.map((product, index) => ({
      id: `backup-${product.id}`,
      baseName: product.name.toUpperCase(),
      description: `Premium ${product.name} - Available for delivery`,
      image: product.image,
      category: 'Premium',
      variants: [{
        size: 'Standard',
        price: product.price,
        priceFormatted: `KES ${product.price.toLocaleString()}`,
        originalProduct: {
          id: product.id,
          name: product.name,
          price: `KES ${product.price.toLocaleString()}`,
          description: `Premium ${product.name} - Available for delivery`,
          image: product.image,
          category: 'Premium'
        }
      }],
      lowestPrice: product.price,
      lowestPriceFormatted: `KES ${product.price.toLocaleString()}`,
      matchLevel: 'backup'
    }));

    // Apply pagination to backup products
    const paginatedProducts = transformedProducts.slice(startIndex, endIndex + 1);
    
    console.log(`📁 Using backup products: ${paginatedProducts.length} items`);
    
    return {
      products: paginatedProducts,
      totalCount: backupProducts.length
    };
  }
};
