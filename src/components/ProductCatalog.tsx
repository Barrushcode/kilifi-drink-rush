import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProductCatalogHeader from './ProductCatalogHeader';
import ProductsDebugInfo from './ProductsDebugInfo';
import ProductGrid from './ProductGrid';
import ProductsPagination from './ProductsPagination';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilters } from '@/hooks/useProductFilters';
import { usePagination } from '@/hooks/usePagination';

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wine');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const itemsPerPage = 12;
  
  const { products, productsByOriginalOrder, loading, error, refetch } = useProducts();
  const { categories, filteredProducts } = useProductFilters(products, searchTerm, selectedCategory);
  const { totalPages, hasNextPage, hasPreviousPage, startIndex, endIndex } = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage,
    currentPage
  });

  // Choose product list for All: preserve original supabase order
  const displayProducts =
    selectedCategory === "All"
      ? productsByOriginalOrder
      : products;

  const displayFilteredProducts =
    selectedCategory === "All"
      ? filteredProducts /* filter is okay, filtering after preserving order */
      : filteredProducts; // fallback for future

  const paginatedProducts = displayFilteredProducts.slice(startIndex, endIndex);

  // Enhanced debug logging
  useEffect(() => {
    console.log('🔍 ProductCatalog DEBUG:', {
      productsCount: products.length,
      filteredCount: filteredProducts.length,
      paginatedCount: paginatedProducts.length,
      loading,
      error,
      selectedCategory,
      searchTerm,
      sampleProduct: products[0]
    });

    if (paginatedProducts.length > 0) {
      console.log('🎯 First 3 products to render:', paginatedProducts.slice(0, 3));
    }
  }, [products, filteredProducts, paginatedProducts, loading, error, selectedCategory, searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Set Wine as default if it exists in categories, otherwise fall back to All
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === 'Wine') {
      const hasWine = categories.some(cat => cat.toLowerCase().includes('wine'));
      if (!hasWine) {
        setSelectedCategory('All');
      }
    }
  }, [categories, selectedCategory]);

  // Show the loading skeleton tightly with no extra margin above!
  if (loading) {
    return (
      <section id="products" className="pt-0 pb-0 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="container mx-auto px-0 lg:px-2 relative z-10 max-w-screen-2xl mt-0 mb-0">
          <div className="text-center mb-2 mt-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-0 font-serif text-rose-600">
              Our Collection
            </h2>
            <div className="w-12 lg:w-16 h-px bg-barrush-copper mx-auto my-3"></div>
            <p className="text-lg lg:text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-1 leading-relaxed font-iphone">
              Loading our curated selection...
            </p>
          </div>
          <ProductLoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    console.error('❌ ProductCatalog error:', error);
    return (
      <section id="products" className="pt-0 pb-0 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="container mx-auto px-0 lg:px-2 relative z-10 max-w-screen-2xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 font-serif text-rose-600">
              Our Collection
            </h2>
            <p className="text-lg lg:text-xl text-red-400 mb-4 font-iphone">{error}</p>
            <Button onClick={refetch} className="bg-rose-600 hover:bg-rose-500 h-touch px-6 font-iphone">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  console.log('🎯 Rendering ProductCatalog with', paginatedProducts.length, 'products');

  return (
    <section 
      id="products" 
      className="pt-0 pb-0 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0f1419 0%, #1a1a1a 100%)'
      }}
    >
      <div className="container mx-auto px-0 sm:px-1 md:px-1 lg:px-2 relative z-10 max-w-screen-2xl">
        <ProductCatalogHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          showAuditReport={showAuditReport}
          setShowAuditReport={setShowAuditReport}
        />

        <ProductsDebugInfo
          products={displayProducts}
          filteredProducts={displayFilteredProducts}
          paginatedProducts={paginatedProducts}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
        />
        
        <ProductGrid
          paginatedProducts={paginatedProducts}
          filteredProducts={displayFilteredProducts}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedCategory={setSelectedCategory}
        />

        <ProductsPagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          startIndex={startIndex}
          endIndex={endIndex}
          filteredProductsLength={displayFilteredProducts.length}
        />
      </div>
    </section>
  );
};

export default ProductCatalog;
