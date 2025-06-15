
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ImageScrapingInterface from './ImageScrapingInterface';
import { downloadMissingImagesCSV } from '@/utils/downloadMissingImagesCSV'; // <-- Add this import

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
  const [showImageScraping, setShowImageScraping] = useState(false);

  return (
    <div className="text-center mb-2 mt-2 space-y-4">
      <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-0 font-serif text-rose-600">
        Our Collection
      </h2>
      <div className="w-12 lg:w-16 h-px bg-barrush-copper mx-auto my-3"></div>
      <p className="text-lg lg:text-xl text-barrush-platinum/90 max-w-3xl mx-auto mb-1 leading-relaxed font-iphone">
        Discover our curated selection of premium spirits and wines
      </p>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-barrush-steel/30 bg-barrush-midnight/50 text-barrush-platinum placeholder-barrush-platinum/60 focus:outline-none focus:ring-2 focus:ring-rose-600 w-64"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-barrush-steel/30 bg-barrush-midnight/50 text-barrush-platinum focus:outline-none focus:ring-2 focus:ring-rose-600"
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Admin Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={() => setShowAuditReport(!showAuditReport)}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          {showAuditReport ? 'Hide' : 'Show'} Debug Info
        </Button>
        
        <Button
          onClick={() => setShowImageScraping(!showImageScraping)}
          variant="outline"
          size="sm"
          className="text-xs bg-blue-600 hover:bg-blue-500 text-white"
        >
          {showImageScraping ? 'Hide' : 'Show'} Image Scraper
        </Button>
        
        {/* Download CSV of missing product images */}
        <Button
          onClick={downloadMissingImagesCSV}
          variant="outline"
          size="sm"
          className="text-xs bg-green-600 hover:bg-green-500 text-white"
        >
          Download Missing Images CSV
        </Button>
      </div>

      {/* Image Scraping Interface */}
      {showImageScraping && (
        <div className="mt-6 mb-6">
          <ImageScrapingInterface />
        </div>
      )}
    </div>
  );
};

export default ProductCatalogHeader;

