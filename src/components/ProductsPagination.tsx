
import React from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface ProductsPaginationProps {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  filteredProductsLength: number;
}

const ProductsPagination: React.FC<ProductsPaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
  hasNextPage,
  hasPreviousPage,
  startIndex,
  endIndex,
  filteredProductsLength
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to show (optimized for better navigation)
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  // Handle keyboard navigation
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    } else if (e.key === 'ArrowRight' && hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {/* Enhanced pagination for desktop */}
      <div className="flex justify-center mt-12 lg:mt-16" onKeyDown={handleKeyPress} tabIndex={0}>
        <Pagination>
          <PaginationContent className="gap-1 lg:gap-2">
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={e => {
                  e.preventDefault();
                  if (hasPreviousPage) setCurrentPage(currentPage - 1);
                }} 
                className={`${!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600 hover:bg-rose-50/10'} bg-glass-effect border-barrush-steel/40 font-iphone h-10 px-3 lg:px-4 transition-all duration-200`} 
              />
            </PaginationItem>
            
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-barrush-platinum/60" />
                  </PaginationItem>
                );
              }
              
              const pageNum = page as number;
              const isCurrentPage = pageNum === currentPage;
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink 
                    href="#" 
                    onClick={e => {
                      e.preventDefault();
                      setCurrentPage(pageNum);
                    }} 
                    isActive={isCurrentPage} 
                    className={`${isCurrentPage ? 'bg-rose-600 text-white border-rose-600 shadow-lg' : 'bg-glass-effect border-barrush-steel/40 text-barrush-platinum hover:text-rose-600 hover:bg-rose-50/10'} font-iphone h-10 min-w-10 px-3 lg:px-4 transition-all duration-200 hover:scale-105`}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={e => {
                  e.preventDefault();
                  if (hasNextPage) setCurrentPage(currentPage + 1);
                }} 
                className={`${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600 hover:bg-rose-50/10'} bg-glass-effect border-barrush-steel/40 font-iphone h-10 px-3 lg:px-4 transition-all duration-200`} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      {/* Quick navigation buttons */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-barrush-steel/20 text-barrush-platinum rounded hover:bg-barrush-steel/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          First
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-barrush-steel/20 text-barrush-platinum rounded hover:bg-barrush-steel/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Last
        </button>
      </div>
      
      {/* Enhanced info section */}
      <div className="text-center mt-8">
        <div className="border rounded-xl p-4 lg:p-6 max-w-2xl mx-auto" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(4px)'
        }}>
          {filteredProductsLength > 0 && (
            <div className="space-y-2">
              <p className="text-base lg:text-lg font-iphone text-barrush-platinum/90">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProductsLength)} of {filteredProductsLength} products
              </p>
              <p className="text-sm text-barrush-platinum/60">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPagination;
