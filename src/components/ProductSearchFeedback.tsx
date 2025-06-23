
import React from 'react';

interface ProductSearchFeedbackProps {
  searchInput: string;
  selectedCategory: string;
  loading: boolean;
  totalCount: number;
  productsLength: number;
}

const ProductSearchFeedback: React.FC<ProductSearchFeedbackProps> = ({
  searchInput,
  selectedCategory,
  loading,
  totalCount,
  productsLength
}) => {
  if (!searchInput && selectedCategory === 'All') return null;

  return (
    <div className="text-center mb-4">
      <p className="text-barrush-platinum/80 font-iphone text-sm">
        {loading ? 
          `🔍 ${searchInput ? `Searching for "${searchInput}"` : `Filtering ${selectedCategory}`}...` : 
          `Found ${totalCount} results${searchInput ? ` for "${searchInput}"` : ''}${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}`
        }
      </p>
      {!loading && productsLength === 0 && (
        <p className="text-barrush-platinum/60 font-iphone text-xs mt-1">
          Try searching for "Johnnie Walker", "wine", "beer", "whiskey", or select a different category
        </p>
      )}
    </div>
  );
};

export default ProductSearchFeedback;
