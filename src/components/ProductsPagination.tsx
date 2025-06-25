
import React, { useState } from 'react';
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
  const [isNavigating, setIsNavigating] = useState(false);

  if (totalPages <= 1) return null;

  const handlePageChange = async (newPage: number) => {
    if (isNavigating || newPage === currentPage) return;
    
    setIsNavigating(true);
    console.log(`🔄 Navigating from page ${currentPage} to page ${newPage}`);
    setCurrentPage(newPage);
    
    // Small delay to prevent rapid clicking
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasPreviousPage && !isNavigating) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasNextPage && !isNavigating) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    if (!isNavigating) {
      handlePageChange(page);
    }
  };

  return (
    <>
      {/* Enhanced pagination for desktop */}
      <div className="flex justify-center mt-16 lg:mt-20">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={handlePrevious}
                className={`${
                  !hasPreviousPage || isNavigating 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'text-barrush-platinum hover:text-rose-600'
                } bg-glass-effect border-barrush-steel/40 font-iphone h-touch px-4 lg:px-6`} 
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              if (page === 1 || page === totalPages || page >= currentPage - 1 && page <= currentPage + 1) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => handlePageClick(e, page)}
                      isActive={isCurrentPage} 
                      className={`${
                        isCurrentPage 
                          ? 'bg-rose-600 text-white border-rose-600' 
                          : 'bg-glass-effect border-barrush-steel/40 text-barrush-platinum hover:text-rose-600'
                      } ${
                        isNavigating ? 'opacity-50 cursor-not-allowed' : ''
                      } font-iphone h-touch min-w-touch px-4 lg:px-6`}
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
                onClick={handleNext}
                className={`${
                  !hasNextPage || isNavigating 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'text-barrush-platinum hover:text-rose-600'
                } bg-glass-effect border-barrush-steel/40 font-iphone h-touch px-4 lg:px-6`} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      {/* Enhanced info section for desktop */}
      <div className="text-center mt-16 lg:mt-20">
        <div className="border rounded-xl p-6 lg:p-8 max-w-3xl mx-auto" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(4px)'
        }}>
          {filteredProductsLength > 0 && (
            <p className="text-base lg:text-lg font-iphone" style={{
              color: 'rgba(229, 231, 235, 0.7)'
            }}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProductsLength)} of {filteredProductsLength} product families
              {isNavigating && (
                <span className="ml-2 text-rose-400">Loading...</span>
              )}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPagination;
