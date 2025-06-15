
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ProductCatalogHeader from './ProductCatalogHeader';
import ProductsDebugInfo from './ProductsDebugInfo';
import ProductGrid from './ProductGrid';
import ProductsPagination from './ProductsPagination';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilters } from '@/hooks/useProductFilters';
import { usePagination } from '@/hooks/usePagination';
import { Slider } from '@/components/ui/slider';

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wine');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditReport, setShowAuditReport] = useState(false);
  const itemsPerPage = 12;

  const { products = [], productsByOriginalOrder = [], loading, error, refetch } = useProducts();

  // Call hooks unconditionally and safely with empty array fallback.
  const allFilters = useProductFilters(productsByOriginalOrder || [], searchTerm, "All");
  const categoryFilters = useProductFilters(products || [], searchTerm, selectedCategory);

  // Categories always from filter of products array (should be stable)
  const categories = categoryFilters.categories;

  // Pick correct data for filtered products
  const displayFilteredProducts = selectedCategory === "All"
    ? allFilters.filteredProducts
    : categoryFilters.filteredProducts;

  // Find product price range for current filtered set
  const priceList = useMemo(() => {
    return displayFilteredProducts
      .map(product => {
        // Try to use grouped minimal price for ranges
        return product.lowestPrice
          ? typeof product.lowestPrice === 'number'
            ? product.lowestPrice
            : Number(String(product.lowestPrice).replace(/[^\d]/g, ''))
          : 0;
      })
      .filter(price => !isNaN(price) && price > 0)
      .sort((a, b) => a - b);
  }, [displayFilteredProducts]);

  // defaults: min to smallest price, max to highest price
  const minPriceAvailable = priceList.length > 0 ? priceList[0] : 0;
  const maxPriceAvailable = priceList.length > 0 ? priceList[priceList.length - 1] : 100000;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceAvailable,
    maxPriceAvailable,
  ]);

  // Reset price filter range when category or search changes
  useEffect(() => {
    setPriceRange([
      minPriceAvailable,
      maxPriceAvailable
    ]);
  }, [minPriceAvailable, maxPriceAvailable, selectedCategory, searchTerm]);

  // Price filtering: show only products in selected price range
  const priceFilteredProducts = useMemo(() => {
    return displayFilteredProducts.filter(prod => {
      const priceNum = prod.lowestPrice
        ? typeof prod.lowestPrice === 'number'
          ? prod.lowestPrice
          : Number(String(prod.lowestPrice).replace(/[^\d]/g, ''))
        : 0;
      return priceNum >= priceRange[0] && priceNum <= priceRange[1];
    });
  }, [displayFilteredProducts, priceRange]);

  // Pick correct products list (for debug only)
  const displayProducts = selectedCategory === "All"
    ? productsByOriginalOrder
    : products;

  const { totalPages, hasNextPage, hasPreviousPage, startIndex, endIndex } = usePagination({
    totalItems: priceFilteredProducts.length,
    itemsPerPage,
    currentPage
  });

  const paginatedProducts = priceFilteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    console.log('🔍 ProductCatalog DEBUG:', {
      productsCount: products.length,
      filteredCount: displayFilteredProducts.length,
      priceFilteredCount: priceFilteredProducts.length,
      paginatedCount: paginatedProducts.length,
      loading,
      error,
      selectedCategory,
      searchTerm,
      priceRange,
      sampleProduct: products[0]
    });

    if (paginatedProducts.length > 0) {
      console.log('🎯 First 3 products to render:', paginatedProducts.slice(0, 3));
    }
  }, [products, displayFilteredProducts, paginatedProducts, priceFilteredProducts, loading, error, selectedCategory, searchTerm, priceRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange]);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === 'Wine') {
      const hasWine = categories.some(cat => cat.toLowerCase().includes('wine'));
      if (!hasWine) {
        setSelectedCategory('All');
      }
    }
  }, [categories, selectedCategory]);

  // --- New: Price Filter UI ---
  // Show price filter unless there is only one price, or if no products at all
  const showPriceFilter = priceList.length > 1;

  if (loading) {
    return (
      <section id="products" className="pt-0 pb-0 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10 mt-0 mb-0">
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
    console.error('❌ ProductCatalog error:', error);
    return (
      <section id="products" className="pt-0 pb-0 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
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

  console.log('🎯 Rendering ProductCatalog with', paginatedProducts.length, 'products');

  return (
    <section 
      id="products" 
      className="pt-0 pb-0 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0f1419 0%, #1a1a1a 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <ProductCatalogHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
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
          products={displayProducts}
          filteredProducts={displayFilteredProducts}
          paginatedProducts={paginatedProducts}
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
        />
        
        <ProductGrid
          paginatedProducts={paginatedProducts}
          filteredProducts={priceFilteredProducts}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedCategory={setSelectedCategory}
        />

        <ProductsPagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          startIndex={startIndex}
          endIndex={endIndex}
          filteredProductsLength={priceFilteredProducts.length}
        />
      </div>
    </section>
  );
};

export default ProductCatalog;
