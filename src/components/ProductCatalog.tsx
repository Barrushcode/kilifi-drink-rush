
import React from 'react';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';
import { useCategories } from '@/hooks/useCategories';
import { useProductCatalogState } from './ProductCatalogState';
import { useProductFilters } from './ProductCatalogFilters';
import ProductCatalogContent from './ProductCatalogContent';

const ProductCatalog: React.FC = () => {
  const itemsPerPage = 4; // Set to 4 as requested

  // Use the custom hook for state management
  const {
    searchInput,
    setSearchInput,
    actualSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    showAuditReport,
    setShowAuditReport,
    handleSearch,
    handleKeyPress
  } = useProductCatalogState();

  // Fetch dynamic categories from the database
  const { categories, loading: categoriesLoading } = useCategories();

  // Use optimized products hook with manual search term
  const { 
    products, 
    loading, 
    error, 
    totalCount, 
    totalPages,
    refetch 
  } = useOptimizedProducts({
    searchTerm: actualSearchTerm,
    selectedCategory,
    currentPage,
    itemsPerPage
  });

  // Use custom hook for filtering logic
  const {
    priceRange,
    setPriceRange,
    minPriceAvailable,
    maxPriceAvailable,
    priceFilteredProducts,
    showPriceFilter
  } = useProductFilters({
    products,
    selectedCategory,
    actualSearchTerm
  });

  // Enhanced debug logging
  console.log('🔍 ProductCatalog Debug:', {
    searchInput,
    actualSearchTerm,
    selectedCategory,
    currentPage,
    productsCount: products.length,
    priceFilteredCount: priceFilteredProducts.length,
    totalCount,
    totalPages,
    loading,
    error,
    categories
  });

  return (
    <ProductCatalogContent
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      showAuditReport={showAuditReport}
      setShowAuditReport={setShowAuditReport}
      onSearch={handleSearch}
      onKeyPress={handleKeyPress}
      actualSearchTerm={actualSearchTerm}
      products={products}
      loading={loading}
      error={error}
      totalCount={totalCount}
      totalPages={totalPages}
      refetch={refetch}
      categories={categories}
      categoriesLoading={categoriesLoading}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      minPriceAvailable={minPriceAvailable}
      maxPriceAvailable={maxPriceAvailable}
      priceFilteredProducts={priceFilteredProducts}
      showPriceFilter={showPriceFilter}
      itemsPerPage={itemsPerPage}
    />
  );
};

ProductCatalog.displayName = 'ProductCatalog';

export default ProductCatalog;
