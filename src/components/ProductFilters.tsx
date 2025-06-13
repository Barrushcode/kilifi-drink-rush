
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <div className="max-w-5xl mx-auto mb-8 lg:mb-12">
      <div className="flex flex-col gap-6 mb-6 lg:mb-8">
        <Input 
          placeholder="Search our collection..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="bg-glass-effect border-barrush-steel/40 text-barrush-platinum placeholder:text-barrush-smoke h-12 lg:h-14 text-base lg:text-lg backdrop-blur-md font-iphone" 
        />
      </div>
      
      {/* Category badges - Fixed to wrap instead of horizontal scroll */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map(category => (
          <Badge 
            key={category} 
            variant={selectedCategory === category ? "default" : "outline"} 
            onClick={() => setSelectedCategory(category)} 
            className={`cursor-pointer transition-all duration-300 px-4 py-2 text-sm font-medium font-iphone h-touch flex items-center ${
              selectedCategory === category 
                ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-500 shadow-lg' 
                : 'bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60'
            }`}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;
