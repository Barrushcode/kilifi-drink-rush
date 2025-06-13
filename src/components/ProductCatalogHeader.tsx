
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductFilters from './ProductFilters';
import ImageAuditReport from './ImageAuditReport';

interface ProductCatalogHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  showAuditReport: boolean;
  setShowAuditReport: (show: boolean) => void;
}

const ProductCatalogHeader: React.FC<ProductCatalogHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  showAuditReport,
  setShowAuditReport
}) => {
  return (
    <>
      <div className="text-center mb-12 lg:mb-20">
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6 font-serif"
          style={{ color: '#e11d48' }}
        >
          Our Collection
        </h2>
        <div 
          className="w-12 lg:w-16 h-px mx-auto mb-6 lg:mb-8"
          style={{ backgroundColor: '#c9a96e' }}
        />
        <p 
          className="text-lg lg:text-xl max-w-3xl mx-auto mb-8 lg:mb-12 leading-relaxed font-iphone"
          style={{ color: 'rgba(229, 231, 235, 0.9)' }}
        >
          Premium wines and spirits with multiple size options
        </p>
        
        <ProductFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      </div>

      {/* Image Audit Report Section */}
      <div className="mb-8 lg:mb-12">
        <div className="flex justify-center mb-4 lg:mb-6">
          <Button 
            onClick={() => setShowAuditReport(!showAuditReport)}
            variant="outline"
            className="h-touch px-4 lg:px-6 font-iphone"
            style={{
              borderColor: 'rgba(201, 169, 110, 0.5)',
              color: '#c9a96e',
              backgroundColor: 'transparent'
            }}
          >
            {showAuditReport ? 'Hide' : 'Show'} Image Quality Report
          </Button>
        </div>
        {showAuditReport && (
          <div className="max-w-4xl mx-auto mb-8 lg:mb-12">
            <ImageAuditReport />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCatalogHeader;
