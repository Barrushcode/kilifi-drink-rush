
import React from 'react';
import { Button } from '@/components/ui/button';
import GroupedProductCard from './GroupedProductCard';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface ProductGridProps {
  paginatedProducts: GroupedProduct[];
  filteredProducts: GroupedProduct[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  isBeerCategory?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  paginatedProducts,
  filteredProducts,
  loading,
  searchTerm,
  setSearchTerm,
  setSelectedCategory,
  isBeerCategory = false
}) => {

  return (
    <>
      {isBeerCategory && (
        <div className="w-full mb-6 lg:mb-8 flex justify-center px-4">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 px-4 py-3 lg:px-6 lg:py-4 rounded-xl font-semibold shadow-lg font-iphone border-2 border-amber-200 flex items-center gap-2 lg:gap-3 max-w-sm lg:max-w-md text-center">
            <span className="text-xl lg:text-2xl">🍺</span>
            <span className="text-sm lg:text-base">All Beers are sold as Six-Packs</span>
            <span className="text-xl lg:text-2xl">🍻</span>
          </div>
        </div>
      )}

      {/* Responsive grid layout optimized for all devices */}
      <div className="
        grid 
        grid-cols-1
        xs:grid-cols-2
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-4
        2xl:grid-cols-5
        gap-3
        sm:gap-4 
        lg:gap-6
        xl:gap-8
        max-w-full 
        mx-auto
        pb-6
        sm:pb-8
        lg:pb-12
        px-2
        sm:px-4
        lg:px-0
      "
      >
        {paginatedProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="w-full min-w-0 flex justify-center"
          >
            <GroupedProductCard 
              product={product} 
              priority={index < 8}
              className="w-full max-w-xs sm:max-w-none"
            />
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center mt-8 lg:mt-12 py-12 lg:py-16 px-4">
          <p className="text-base lg:text-xl font-iphone mb-4 lg:mb-6 text-barrush-platinum/70">
            No products found matching your search criteria.
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="font-iphone px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg bg-rose-600 hover:bg-rose-500 text-white"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
