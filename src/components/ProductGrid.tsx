
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
        <div className="w-full mb-8 flex justify-center">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 px-6 py-4 rounded-xl font-semibold shadow-lg font-iphone border-2 border-amber-200 flex items-center gap-3 max-w-md">
            <span className="text-2xl">🍺</span>
            <span className="text-center">All Beers are sold as Six-Packs</span>
            <span className="text-2xl">🍻</span>
          </div>
        </div>
      )}

      {/* Enhanced desktop grid layout with faster loading */}
      <div className="
        grid 
        grid-cols-1
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-4
        2xl:grid-cols-4
        gap-4 
        lg:gap-6
        xl:gap-8
        max-w-full 
        mx-auto
        pb-8
        lg:pb-12
      "
        style={{ width: '100%' }}
      >
        {paginatedProducts.map((product, index) => {
          console.log('🔧 Rendering product card for:', product.baseName, 'with price:', product.lowestPriceFormatted);
          return (
            <GroupedProductCard 
              key={product.id} 
              product={product} 
              priority={index < 4} // Prioritize first 4 images for faster loading
            />
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center mt-12 py-16">
          <p 
            className="text-lg lg:text-xl font-iphone mb-6"
            style={{ color: 'rgba(229, 231, 235, 0.7)' }}
          >
            No products found matching your search criteria.
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="font-iphone px-8 py-4 text-lg bg-rose-600 hover:bg-rose-500 text-white"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
