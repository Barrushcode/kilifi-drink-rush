
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCardVariant2 from './ProductCardVariant2';
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
        <div className="w-full mb-2 flex justify-center">
          <span className="bg-yellow-100 text-amber-800 px-3 py-1 text-xs rounded font-semibold shadow font-iphone border border-yellow-300 flex items-center gap-2">
            All Beers are sold as Six-Packs 🍻
          </span>
        </div>
      )}

      <div className="
        grid 
        grid-cols-1
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-6 
        gap-2 
        md:gap-3 
        lg:gap-5 
        max-w-full 
        mx-auto
        pb-4
      "
        style={{ width: '100%' }}
      >
        {paginatedProducts.map(product => {
          console.log('🔧 Rendering product card for:', product.baseName, 'with price:', product.lowestPriceFormatted);
          return (
            <ProductCardVariant2 key={product.id} product={product} />
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center mt-6">
          <p 
            className="text-base lg:text-lg font-iphone"
            style={{ color: 'rgba(229, 231, 235, 0.7)' }}
          >
            No products found matching your search criteria.
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-4 font-iphone"
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
