
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
}

const ProductGrid: React.FC<ProductGridProps> = ({
  paginatedProducts,
  filteredProducts,
  loading,
  searchTerm,
  setSearchTerm,
  setSelectedCategory
}) => {
  // Determine if beers category is selected (case-insensitive, future-proof).
  const isBeersCategory =
    typeof filteredProducts !== "undefined" &&
    filteredProducts.length > 0 &&
    filteredProducts[0].category &&
    filteredProducts[0].category.toLowerCase().includes("beer");

  return (
    <>
      {isBeersCategory && (
        <div className="w-full mb-8 flex justify-center">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-6 py-3 rounded-xl font-bold shadow-lg border-2 border-amber-200 flex items-center gap-3 text-center">
            <span className="text-2xl">🍺</span>
            <span className="text-lg font-extrabold">All Beers Come in 6-Packs!</span>
            <span className="text-2xl">🍻</span>
          </div>
        </div>
      )}

      {/* Enhanced desktop grid layout with optimized spacing */}
      <div className="
        grid 
        grid-cols-1
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-6 
        lg:gap-8
        xl:gap-10
        max-w-full 
        mx-auto
        pb-8
        lg:pb-12
      "
        style={{ width: '100%' }}
      >
        {paginatedProducts.map(product => {
          console.log('🔧 Rendering product card for:', product.baseName, 'with price:', product.lowestPriceFormatted);
          return (
            <GroupedProductCard key={product.id} product={product} />
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
            className="font-iphone px-8 py-4 text-lg"
            style={{
              backgroundColor: '#e11d48',
              color: '#ffffff'
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
