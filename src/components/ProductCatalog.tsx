
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ProductCatalogHeader from './ProductCatalogHeader';
import ProductsDebugInfo from './ProductsDebugInfo';
import ProductGrid from './ProductGrid';
import ProductsPagination from './ProductsPagination';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import { usePagination } from '@/hooks/usePagination';
import { Slider } from '@/components/ui/slider';

// Fixed categories for filtering
const FIXED_CATEGORIES = [
  'All',
  'Whisky',
  'Wine',
  'Beers',
  'Champagne',
  'Liqueur',
  'Tequila',
  'Gin',
  'Cognac',
  'Brandy',
  'Rum',
  'Vodka',
  'Juices'
];

const ProductCatalog: React.FC = React.memo(() => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const itemsPerPage = 12;

  // Faster debounce for better UX
  const debouncedSearchTerm = useDebouncedSearch(searchInput, 150);

  // Use the optimized products hook
  const { 
    products, 
    loading, 
    error, 
    totalCount, 
    totalPages,
    refetch 
  } = useOptimizedProducts({
    searchTerm: debouncedSearchTerm,
    selectedCategory,
    currentPage,
    itemsPerPage
  });

  // Price filtering (client-side for now since we have limited data per page)
  const priceList = useMemo(() => {
    return products
      .map(product => {
        return product.lowestPrice
          ? typeof product.lowestPrice === 'number'
            ? product.lowestPrice
            : Number(String(product.lowestPrice).replace(/[^\d]/g, ''))
          : 0;
      })
      .filter(price => !isNaN(price) && price > 0)
      .sort((a, b) => a - b);
  }, [products]);

  const minPriceAvailable = priceList.length > 0 ? priceList[0] : 0;
  const maxPriceAvailable = priceList.length > 0 ? priceList[priceList.length - 1] : 100000;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceAvailable,
    maxPriceAvailable,
  ]);

  // Reset price filter range when category or search changes
  useEffect(() => {
    setPriceRange([minPriceAvailable, maxPriceAvailable]);
  }, [minPriceAvailable, maxPriceAvailable, selectedCategory, debouncedSearchTerm]);

  // Price filtering
  const priceFilteredProducts = useMemo(() => {
    return products.filter(prod => {
      const priceNum = prod.lowestPrice
        ? typeof prod.lowestPrice === 'number'
          ? prod.lowestPrice
          : Number(String(prod.lowestPrice).replace(/[^\d]/g, ''))
        : 0;
      return priceNum >= priceRange[0] && priceNum <= priceRange[1];
    });
  }, [products, priceRange]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, priceRange]);

  const showPriceFilter = priceList.length > 1;

  console.log('🔍 ProductCatalog OPTIMIZED:', {
    productsCount: products.length,
    priceFilteredCount: priceFilteredProducts.length,
    loading,
    error,
    selectedCategory,
    searchInput,
    debouncedSearchTerm,
    currentPage,
    totalCount,
    totalPages
  });

  if (loading) {
    return (
      <section id="products" className="pt-0 pb-0 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-20 2xl:px-0 relative z-10 mt-0 mb-0">
          <div className="text-center mb-8 mt-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-0 font-serif text-rose-600">
              Our Collection
            </h2>
            <div className="w-16 lg:w-20 h-px bg-barrush-copper mx-auto my-6"></div>
            <p className="text-lg lg:text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-4 leading-relaxed font-iphone">
              Loading our curated selection...
            </p>
          </div>
          <ProductLoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="pt-0 pb-0 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-20 2xl:px-0 relative z-10">
          <div className="text-center py-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif text-rose-600">
              Our Collection
            </h2>
            <p className="text-lg lg:text-xl text-red-400 mb-6 font-iphone">{error}</p>
            <Button onClick={refetch} className="bg-rose-600 hover:bg-rose-500 h-touch px-8 py-4 font-iphone text-lg">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="products" 
      className="relative overflow-hidden pt-2 pb-4 sm:pt-6 sm:pb-8 md:pt-8 md:pb-12"
      style={{
        background: 'linear-gradient(to bottom, #0f1419 0%, #1a1a1a 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 xl:px-20 2xl:px-0 relative z-10">
        <ProductCatalogHeader
          searchTerm={searchInput}
          setSearchTerm={setSearchInput}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={FIXED_CATEGORIES}
          showAuditReport={showAuditReport}
          setShowAuditReport={setShowAuditReport}
        />

        {/* Price Filter */}
        {showPriceFilter && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-barrush-platinum text-sm font-iphone">
                Filter by price ({selectedCategory !== 'All' ? selectedCategory : 'All categories'})
              </span>
              <span className="text-barrush-platinum/80 text-xs">
                {priceRange[0] === minPriceAvailable && priceRange[1] === maxPriceAvailable
                  ? 'All Prices'
                  : `KES ${priceRange[0].toLocaleString()} - KES ${priceRange[1].toLocaleString()}`}
              </span>
            </div>
            <Slider
              min={minPriceAvailable}
              max={maxPriceAvailable}
              step={100}
              value={priceRange}
              onValueChange={vals => setPriceRange([vals[0], vals[1]])}
              className="w-full"
              minStepsBetweenThumbs={1}
            />
            <div className="flex justify-between mt-1 text-xs text-barrush-platinum/70 font-iphone">
              <span>KES {minPriceAvailable.toLocaleString()}</span>
              <span>KES {maxPriceAvailable.toLocaleString()}</span>
            </div>
          </div>
        )}

        <ProductsDebugInfo
          products={products}
          filteredProducts={priceFilteredProducts}
          paginatedProducts={priceFilteredProducts}
          selectedCategory={selectedCategory}
          searchTerm={debouncedSearchTerm}
        />
        
        <div className="w-full">
          <ProductGrid
            paginatedProducts={priceFilteredProducts}
            filteredProducts={priceFilteredProducts}
            loading={loading}
            searchTerm={searchInput}
            setSearchTerm={setSearchInput}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {totalPages > 1 && (
          <ProductsPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            hasNextPage={currentPage < totalPages}
            hasPreviousPage={currentPage > 1}
            startIndex={(currentPage - 1) * itemsPerPage}
            endIndex={Math.min(currentPage * itemsPerPage, totalCount)}
            filteredProductsLength={totalCount}
          />
        )}

        {/* Show total results info */}
        <div className="text-center mt-8">
          <p className="text-barrush-platinum/70 font-iphone">
            Showing {priceFilteredProducts.length} of {totalCount} products
            {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
      </div>
    </section>
  );
});

ProductCatalog.displayName = 'ProductCatalog';

export default ProductCatalog;
