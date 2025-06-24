
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import ImageScrapingInterface from './ImageScrapingInterface';
import { downloadMissingImagesCSV } from '@/utils/downloadMissingImagesCSV';

interface ProductCatalogHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  showAuditReport: boolean;
  setShowAuditReport: (show: boolean) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ProductCatalogHeader: React.FC<ProductCatalogHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  showAuditReport,
  setShowAuditReport,
  onSearch,
  onKeyPress
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
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search products... (press Enter or click Search)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={onKeyPress}
            className="px-4 py-2 rounded-l-lg border border-barrush-steel/30 bg-barrush-midnight/50 text-barrush-platinum placeholder-barrush-platinum/60 focus:outline-none focus:ring-2 focus:ring-rose-600 w-80"
          />
          <Button
            onClick={onSearch}
            className="bg-rose-600 hover:bg-rose-500 px-3 py-2 rounded-r-lg rounded-l-none border border-l-0 border-rose-600"
          >
            <Search className="h-4 w-4" />
          </Button>
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
    </div>
  );
};

export default ProductCatalogHeader;
