
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ProductPriceFilterProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minPriceAvailable: number;
  maxPriceAvailable: number;
  selectedCategory: string;
  showPriceFilter: boolean;
}

const ProductPriceFilter: React.FC<ProductPriceFilterProps> = ({
  priceRange,
  setPriceRange,
  minPriceAvailable,
  maxPriceAvailable,
  selectedCategory,
  showPriceFilter
}) => {
  if (!showPriceFilter) return null;

  return (
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
  );
};

export default ProductPriceFilter;
