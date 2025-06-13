
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
  const [selectedCategory, setSelectedCategory] = useState('Wine'); // Set Wine as default
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const itemsPerPage = 6;
  
  const { products, loading, error, refetch } = useProducts();
  const { categories, filteredProducts } = useProductFilters(products, searchTerm, selectedCategory);
  const { totalPages, hasNextPage, hasPreviousPage, startIndex, endIndex } = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage,
    currentPage
  });

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

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
      <section id="products" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
              Our Collection
            </h2>
            <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
            <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Loading our curated selection with size variants...
            </p>
          </div>
          <ProductLoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
              Our Collection
            </h2>
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <Button onClick={refetch} className="bg-rose-600 hover:bg-rose-500">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-rose-600">
            Our Collection
          </h2>
          <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
          <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-12 leading-relaxed">
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
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <Button 
              onClick={() => setShowAuditReport(!showAuditReport)}
              variant="outline"
              className="border-barrush-copper/50 text-barrush-copper hover:bg-barrush-copper/10"
            >
              {showAuditReport ? 'Hide' : 'Show'} Image Quality Report
            </Button>
          </div>
          {showAuditReport && (
            <div className="max-w-4xl mx-auto mb-12">
              <ImageAuditReport />
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {paginatedProducts.map(product => (
            <GroupedProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center mt-16">
            <p className="text-barrush-platinum/70 text-lg">
              No products found matching your search criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasPreviousPage) setCurrentPage(prev => prev - 1);
                    }}
                    className={`${!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600'} bg-glass-effect border-barrush-steel/40`}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isCurrentPage = page === currentPage;
                  
                  // Show first page, last page, current page, and pages around current page
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
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  // Show ellipsis for gaps
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
                    className={`${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600'} bg-glass-effect border-barrush-steel/40`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        <div className="text-center mt-16">
          <div className="bg-glass-effect border border-barrush-steel/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <p className="text-barrush-platinum/90 text-lg">
              <strong className="text-barrush-copper">Relaxed Image Matching:</strong> Now using more images with quality-based selection 
              and reduced brand restrictions for better product representation.
            </p>
            {filteredProducts.length > 0 && (
              <p className="text-barrush-platinum/70 text-sm mt-2">
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
