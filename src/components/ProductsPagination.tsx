
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

  return (
    <>
      {/* Pagination */}
      <div className="flex justify-center mt-12 lg:mt-16">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (hasPreviousPage) setCurrentPage(currentPage - 1);
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
                  if (hasNextPage) setCurrentPage(currentPage + 1);
                }}
                className={`${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'text-barrush-platinum hover:text-rose-600'} bg-glass-effect border-barrush-steel/40 font-iphone h-touch`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
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
          {filteredProductsLength > 0 && (
            <p 
              className="text-sm mt-2 font-iphone"
              style={{ color: 'rgba(229, 231, 235, 0.7)' }}
            >
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProductsLength)} of {filteredProductsLength} product families
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductsPagination;
