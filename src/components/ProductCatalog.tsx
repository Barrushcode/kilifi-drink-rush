
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GroupedProductCard from './GroupedProductCard';
import ProductFilters from './ProductFilters';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import ImageAuditReport from './ImageAuditReport';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilters } from '@/hooks/useProductFilters';
import { usePagination } from '@/hooks/usePagination';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wine');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const itemsPerPage = 12;
  
  const { products, loading, error, refetch } = useProducts();
  const { categories, filteredProducts } = useProductFilters(products, searchTerm, selectedCategory);
  const { totalPages, hasNextPage, hasPreviousPage, startIndex, endIndex } = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage,
    currentPage
  });

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <section id="products" className="py-12 lg:py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10 max-w-screen-2xl">
          <div className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 font-serif text-rose-600">
              Our Collection
            </h2>
            <div className="w-12 lg:w-16 h-px bg-barrush-copper mx-auto mb-6 lg:mb-8"></div>
            <p className="text-lg lg:text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-8 lg:mb-12 leading-relaxed font-iphone">
              Loading our curated selection with size variants...
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
      <section id="products" className="py-12 lg:py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10 max-w-screen-2xl">
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
      className="py-12 lg:py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0f1419 0%, #1a1a1a 100%)'
      }}
    >
      <div className="container mx-auto px-4 lg:px-6 relative z-10 max-w-screen-2xl">
        <div className="text-center mb-12 lg:mb-20">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 font-serif"
            style={{ color: '#e11d48' }}
          >
            Our Collection
          </h2>
          <div 
            className="w-12 lg:w-16 h-px mx-auto mb-6 lg:mb-8"
            style={{ backgroundColor: '#c9a96e' }}
          />
          <p 
            className="text-lg lg:text-xl max-w-3xl mx-auto mb-8 lg:mb-12 leading-relaxed font-iphone"
            style={{ color: 'rgba(229, 231, 235, 0.9)' }}
          >
            Premium wines and spirits with multiple size options
          </p>
          
          <ProductFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        </div>

        {/* Image Audit Report Section */}
        <div className="mb-8 lg:mb-12">
          <div className="flex justify-center mb-4 lg:mb-6">
            <Button 
              onClick={() => setShowAuditReport(!showAuditReport)}
              variant="outline"
              className="h-touch px-4 lg:px-6 font-iphone"
              style={{
                borderColor: 'rgba(201, 169, 110, 0.5)',
                color: '#c9a96e',
                backgroundColor: 'transparent'
              }}
            >
              {showAuditReport ? 'Hide' : 'Show'} Image Quality Report
            </Button>
          </div>
          {showAuditReport && (
            <div className="max-w-4xl mx-auto mb-8 lg:mb-12">
              <ImageAuditReport />
            </div>
          )}
        </div>
        
        {/* Debug Information - Always visible for troubleshooting */}
        <div className="mb-8 text-center">
          <div 
            className="p-4 rounded-lg inline-block text-sm"
            style={{ 
              backgroundColor: '#111827',
              color: '#ffffff',
              border: '1px solid #374151'
            }}
          >
            <strong>DEBUG:</strong> Products: {products.length} | Filtered: {filteredProducts.length} | Page: {paginatedProducts.length}
            <br />
            Category: {selectedCategory} | Search: "{searchTerm}"
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 max-w-full mx-auto">
          {paginatedProducts.map(product => {
            console.log('🔧 Rendering product card for:', product.baseName, 'with price:', product.lowestPriceFormatted);
            return (
              <GroupedProductCard key={product.id} product={product} />
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center mt-12 lg:mt-16">
            <p 
              className="text-base lg:text-lg font-iphone"
              style={{ color: 'rgba(229, 231, 235, 0.7)' }}
            >
              No products found matching your search criteria.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 font-iphone"
              style={{
                backgroundColor: '#e11d48',
                color: '#ffffff'
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 lg:mt-16">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasPreviousPage) setCurrentPage(prev => prev - 1);
                    }}
                    className={`${!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600'} bg-glass-effect border-barrush-steel/40 font-iphone h-touch`}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  
                  if (
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={isCurrentPage}
                          className={`${isCurrentPage 
                            ? 'bg-rose-600 text-white border-rose-600' 
                            : 'bg-glass-effect border-barrush-steel/40 text-barrush-platinum hover:text-rose-600'
                          } font-iphone h-touch min-w-touch`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis className="text-barrush-platinum/60" />
                      </PaginationItem>
                    );
                  }
                  
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasNextPage) setCurrentPage(prev => prev + 1);
                    }}
                    className={`${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600'} bg-glass-effect border-barrush-steel/40 font-iphone h-touch`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        <div className="text-center mt-12 lg:mt-16">
          <div 
            className="border rounded-xl p-6 lg:p-8 max-w-2xl mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              borderColor: 'rgba(55, 65, 81, 0.3)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <p 
              className="text-base lg:text-lg font-iphone"
              style={{ color: 'rgba(229, 231, 235, 0.9)' }}
            >
              <strong style={{ color: '#c9a96e' }}>Enhanced Product Display:</strong> Now showing products with improved cart integration, 
              better button visibility, and comprehensive error handling.
            </p>
            {filteredProducts.length > 0 && (
              <p 
                className="text-sm mt-2 font-iphone"
                style={{ color: 'rgba(229, 231, 235, 0.7)' }}
              >
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} product families
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
