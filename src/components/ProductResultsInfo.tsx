
import React from 'react';

interface ProductResultsInfoProps {
  priceFilteredProductsLength: number;
  totalCount: number;
  debouncedSearchTerm: string;
  selectedCategory: string;
  currentPage: number;
  itemsPerPage: number;
}

const ProductResultsInfo: React.FC<ProductResultsInfoProps> = ({
  priceFilteredProductsLength,
  totalCount,
  debouncedSearchTerm,
  selectedCategory,
  currentPage,
  itemsPerPage
}) => {
  return (
    <div className="text-center mt-8">
      <p className="text-barrush-platinum/70 font-iphone">
        Showing {priceFilteredProductsLength} of {totalCount} products
        {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
      </p>
      <p className="text-barrush-platinum/50 text-sm font-iphone mt-1">
        Dynamic filtering from Supabase database
      </p>
    </div>
  );
};

export default ProductResultsInfo;
