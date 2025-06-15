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
  return <div className="mb-8 text-center">
      
    </div>;
};
export default ProductsDebugInfo;