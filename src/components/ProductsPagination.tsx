
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Always show first page
    if (startPage > 1) {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink 
            href="#" 
            onClick={e => {
              e.preventDefault();
              handlePageChange(1);
            }} 
            className="bg-glass-effect border-barrush-steel/40 text-barrush-platinum hover:text-rose-600 font-iphone h-touch min-w-touch px-4 lg:px-6"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis className="text-barrush-platinum/60" />
          </PaginationItem>
        );
      }
    }

    // Show page numbers in range
    for (let page = startPage; page <= endPage; page++) {
      const isCurrentPage = page === currentPage;
      pageNumbers.push(
        <PaginationItem key={page}>
          <PaginationLink 
            href="#" 
            onClick={e => {
              e.preventDefault();
              handlePageChange(page);
            }} 
            isActive={isCurrentPage} 
            className={`${isCurrentPage ? 'bg-rose-600 text-white border-rose-600' : 'bg-glass-effect border-barrush-steel/40 text-barrush-platinum hover:text-rose-600'} font-iphone h-touch min-w-touch px-4 lg:px-6`}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis className="text-barrush-platinum/60" />
          </PaginationItem>
        );
      }
      
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            href="#" 
            onClick={e => {
              e.preventDefault();
              handlePageChange(totalPages);
            }} 
            className="bg-glass-effect border-barrush-steel/40 text-barrush-platinum hover:text-rose-600 font-iphone h-touch min-w-touch px-4 lg:px-6"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      {/* Enhanced pagination for desktop with better navigation */}
      <div className="flex justify-center mt-12 lg:mt-16">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={e => {
                  e.preventDefault();
                  if (hasPreviousPage) handlePageChange(currentPage - 1);
                }} 
                className={`${!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600 hover:scale-105'} bg-glass-effect border-barrush-steel/40 font-iphone h-touch px-4 lg:px-6 transition-all duration-200`} 
              />
            </PaginationItem>
            
            {renderPageNumbers()}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={e => {
                  e.preventDefault();
                  if (hasNextPage) handlePageChange(currentPage + 1);
                }} 
                className={`${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600 hover:scale-105'} bg-glass-effect border-barrush-steel/40 font-iphone h-touch px-4 lg:px-6 transition-all duration-200`} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      {/* Enhanced info section for desktop */}
      <div className="text-center mt-8 lg:mt-12">
        <div className="border rounded-xl p-4 lg:p-6 max-w-2xl mx-auto" style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(55, 65, 81, 0.3)',
          backdropFilter: 'blur(4px)'
        }}>
          {filteredProductsLength > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-sm lg:text-base font-iphone" style={{
                color: 'rgba(229, 231, 235, 0.7)'
              }}>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProductsLength)} of {filteredProductsLength} products
              </p>
              <p className="text-xs lg:text-sm font-iphone" style={{
                color: 'rgba(229, 231, 235, 0.5)'
              }}>
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
