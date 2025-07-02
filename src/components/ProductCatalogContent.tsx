
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCatalogHeader from './ProductCatalogHeader';
import ProductsDebugInfo from './ProductsDebugInfo';
import ProductGrid from './ProductGrid';
import ProductsPagination from './ProductsPagination';
import ProductLoadingSkeleton from './ProductLoadingSkeleton';
import ProductPriceFilter from './ProductPriceFilter';
import ProductSearchFeedback from './ProductSearchFeedback';
import ProductResultsInfo from './ProductResultsInfo';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface ProductCatalogContentProps {
  // State props
  searchInput: string;
  setSearchInput: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showAuditReport: boolean;
  setShowAuditReport: (show: boolean) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  actualSearchTerm: string;
  
  // Data props
  products: GroupedProduct[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  refetch: () => void;
  categories: string[];
  categoriesLoading: boolean;
  
  // Filter props
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minPriceAvailable: number;
  maxPriceAvailable: number;
  priceFilteredProducts: GroupedProduct[];
  showPriceFilter: boolean;
  
  // Constants
  itemsPerPage: number;
}

const ProductCatalogContent: React.FC<ProductCatalogContentProps> = ({
  searchInput,
  setSearchInput,
  selectedCategory,
  setSelectedCategory,
  currentPage,
  setCurrentPage,
  showAuditReport,
  setShowAuditReport,
  onSearch,
  onKeyPress,
  actualSearchTerm,
  products,
  loading,
  error,
  totalCount,
  totalPages,
  refetch,
  categories,
  categoriesLoading,
  priceRange,
  setPriceRange,
  minPriceAvailable,
  maxPriceAvailable,
  priceFilteredProducts,
  showPriceFilter,
  itemsPerPage
}) => {
  if (loading || categoriesLoading) {
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
          categories={categories}
          showAuditReport={showAuditReport}
          setShowAuditReport={setShowAuditReport}
          onSearch={onSearch}
          onKeyPress={onKeyPress}
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

export default ProductCatalogContent;
