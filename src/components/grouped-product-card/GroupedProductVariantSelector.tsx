
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';

interface GroupedProductVariantSelectorProps {
  product: GroupedProduct;
  selectedVariant: ProductVariant;
  onVariantChange: (variantIndex: string) => void;
}

const GroupedProductVariantSelector: React.FC<GroupedProductVariantSelectorProps> = ({
  product,
  selectedVariant,
  onVariantChange,
}) => {
  if (product.variants.length <= 1) {
    return (
      <div className="mb-4">
        <span className="text-xs font-iphone text-barrush-platinum/80">
          Size: {selectedVariant.size}
        </span>
        <div className="pt-2">
            <span className="text-2xl font-bold text-white">{selectedVariant.priceFormatted}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between pt-2 mb-2">
        <label className="block text-xs font-medium font-iphone text-barrush-platinum/80">
            Size:
        </label>
        <span className="text-2xl font-bold text-white">{selectedVariant.priceFormatted}</span>
      </div>
      <Select
        value={product.variants.indexOf(selectedVariant).toString()}
        onValueChange={onVariantChange}
      >
        <SelectTrigger className="h-10 font-iphone text-sm bg-barrush-slate/50 border-neon-blue/50 text-gray-200 focus:ring-neon-pink">
          <SelectValue placeholder="Select a size" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-barrush-slate border-neon-blue/50 backdrop-blur-md">
          {product.variants.map((variant, idx) => (
            <SelectItem
              key={idx}
              value={idx.toString()}
              className="font-iphone text-gray-200 hover:!bg-neon-pink/20 focus:!bg-neon-pink/20"
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs">{variant.size}</span>
                <span className="ml-2 font-bold text-xs text-neon-pink-light">{variant.priceFormatted}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroupedProductVariantSelector;
