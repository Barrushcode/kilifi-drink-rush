
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
        <div className="w-full mb-6 flex justify-center">
          <span className="bg-yellow-100 text-amber-800 px-4 py-2 text-sm rounded-lg font-semibold shadow font-iphone border border-yellow-300 flex items-center gap-2">
            All Beers are sold as Six-Packs 🍻
          </span>
        </div>
      )}

      {/* Enhanced desktop grid layout for better space utilization */}
      <div className="
        grid 
        grid-cols-1
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-3
        sm:gap-4 
        md:gap-5
        lg:gap-6
        xl:gap-8
        w-full
        mx-auto
        pb-8
        lg:pb-12
        px-2
        sm:px-4
        md:px-6
        lg:px-8
        xl:px-12
      "
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
