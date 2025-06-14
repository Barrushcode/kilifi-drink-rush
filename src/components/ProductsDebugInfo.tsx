
import React from 'react';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface ProductsDebugInfoProps {
  products: GroupedProduct[];
  filteredProducts: GroupedProduct[];
  paginatedProducts: GroupedProduct[];
  selectedCategory: string;
  searchTerm: string;
}

const ProductsDebugInfo: React.FC<ProductsDebugInfoProps> = ({
  products,
  filteredProducts,
  paginatedProducts,
  selectedCategory,
  searchTerm
}) => {
  return (
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
  );
};

export default ProductsDebugInfo;
