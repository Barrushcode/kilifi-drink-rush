
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OptimizedImage from './OptimizedImage';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';

interface GroupedProductCardProps {
  product: GroupedProduct;
}

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);

  const handleAddToCart = () => {
    console.log(`Adding ${product.baseName} (${selectedVariant.size}) to cart - ${selectedVariant.priceFormatted}`);
    // Cart functionality to be implemented
  };

  const handleVariantChange = (variantIndex: string) => {
    const variant = product.variants[parseInt(variantIndex)];
    setSelectedVariant(variant);
  };

  return (
    <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden h-full">
      <div className="relative h-32 md:h-40 lg:h-48 bg-barrush-steel/10">
        <OptimizedImage
          src={product.image}
          alt={`${product.baseName} - ${product.category}`}
          className="w-full h-full"
          priority={false}
        />
        {/* Reduced gradient overlay for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/30 to-transparent group-hover:from-barrush-midnight/20 transition-all duration-300"></div>
      </div>
      
      <CardContent className="p-3 md:p-4 lg:p-6 flex flex-col h-full">
        <h3 className="text-sm md:text-base lg:text-xl font-bold mb-2 font-iphone text-red-200 line-clamp-2">
          {product.baseName}
        </h3>
        
        <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-3">
          <Badge className="bg-barrush-steel/60 text-barrush-platinum px-2 py-1 text-xs font-iphone">
            {product.category}
          </Badge>
          {product.variants.length > 1 && (
            <Badge variant="outline" className="text-barrush-copper border-barrush-copper/50 text-xs font-iphone">
              {product.variants.length} sizes
            </Badge>
          )}
        </div>

        {product.description && (
          <p className="text-barrush-platinum/80 mb-3 text-xs md:text-sm line-clamp-2 font-iphone">
            {product.description}
          </p>
        )}

        {/* Size Selector - Compact for mobile */}
        {product.variants.length > 1 ? (
          <div className="mb-3">
            <label className="block text-xs font-medium text-barrush-platinum/90 mb-1 font-iphone">
              Size & Price:
            </label>
            <Select 
              value={product.variants.indexOf(selectedVariant).toString()} 
              onValueChange={handleVariantChange}
            >
              <SelectTrigger className="bg-barrush-midnight/50 border-barrush-steel/40 text-barrush-platinum h-10 font-iphone text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-barrush-midnight border-barrush-steel/40 z-50">
                {product.variants.map((variant, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="text-barrush-platinum hover:bg-barrush-steel/20 font-iphone"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs">{variant.size}</span>
                      <span className="ml-2 font-bold text-barrush-copper text-xs">
                        {variant.priceFormatted}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="mb-3">
            <span className="text-xs text-barrush-platinum/70 font-iphone">Size: {selectedVariant.size}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-base md:text-lg lg:text-xl font-bold text-barrush-platinum font-iphone">
              {selectedVariant.priceFormatted}
            </span>
            {product.variants.length > 1 && selectedVariant !== product.variants[0] && (
              <span className="text-xs text-barrush-platinum/60 font-iphone">
                from {product.lowestPriceFormatted}
              </span>
            )}
          </div>
          <Button 
            onClick={handleAddToCart}
            className="text-barrush-midnight font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500 h-10 w-full font-iphone"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupedProductCard;
