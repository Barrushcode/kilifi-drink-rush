
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ProductCatalogHeader from './ProductCatalogHeader';
import ProductsDebugInfo from './ProductsDebugInfo';
import ProductGrid from './ProductGrid';
import ProductsPagination from './ProductsPagination';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import ProductPriceFilter from './ProductPriceFilter';
import ProductSearchFeedback from './ProductSearchFeedback';
import ProductResultsInfo from './ProductResultsInfo';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';

// Enhanced categories including new description-based ones
const FIXED_CATEGORIES = [
  'All',
  'Beer',
  '6-Packs & Beer Sets',
  'Wine',
  'Wine Sets & Collections',
  'Whiskey',
  'Whiskey Collections',
  'Vodka',
  'Vodka Premium Sets',
  'Champagne',
  'Champagne & Sparkling Sets',
  'Gin',
  'Gin Premium Collections',
  'Cognac & Premium Brandy',
  'Rum',
  'Rum Collections',
  'Tequila',
  'Tequila Premium Sets',
  'Liqueur',
  'Juices',
  'Premium Collection',
  'Spirits'
];

const ProductCatalog: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState(''); // The term actually used for searching
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const itemsPerPage = 6; // Reduced from 12 to 6 for faster loading

  // Use optimized products hook with manual search term
  const { 
    products, 
    loading, 
    error, 
    totalCount, 
    totalPages,
    refetch 
  } = useOptimizedProducts({
    searchTerm: actualSearchTerm,
    selectedCategory,
    currentPage,
    itemsPerPage
  });

  // Handle search when user presses Enter or clicks search button
  const handleSearch = () => {
    setActualSearchTerm(searchInput.trim());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
  }, [minPriceAvailable, maxPriceAvailable, selectedCategory, actualSearchTerm]);

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
  }, [actualSearchTerm, selectedCategory, priceRange]);

  const showPriceFilter = priceList.length > 1;

  // Enhanced debug logging
  console.log('🔍 ProductCatalog Debug:', {
    searchInput,
    actualSearchTerm,
    selectedCategory,
    currentPage,
    productsCount: products.length,
    priceFilteredCount: priceFilteredProducts.length,
    totalCount,
    loading,
    error
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
              {actualSearchTerm ? `Searching for "${actualSearchTerm}"...` : 
               selectedCategory !== 'All' ? `Loading ${selectedCategory} products...` : 
               'Loading our curated selection...'}
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
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
        />

        <ProductSearchFeedback
          searchInput={actualSearchTerm}
          selectedCategory={selectedCategory}
          loading={loading}
          totalCount={totalCount}
          productsLength={products.length}
        />

        <ProductPriceFilter
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minPriceAvailable={minPriceAvailable}
          maxPriceAvailable={maxPriceAvailable}
          selectedCategory={selectedCategory}
          showPriceFilter={showPriceFilter}
        />

        <ProductsDebugInfo
          products={products}
          filteredProducts={priceFilteredProducts}
          paginatedProducts={priceFilteredProducts}
          selectedCategory={selectedCategory}
          searchTerm={actualSearchTerm}
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

        <ProductResultsInfo
          priceFilteredProductsLength={priceFilteredProducts.length}
          totalCount={totalCount}
          debouncedSearchTerm={actualSearchTerm}
          selectedCategory={selectedCategory}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </section>
  );
};

ProductCatalog.displayName = 'ProductCatalog';

export default ProductCatalog;
