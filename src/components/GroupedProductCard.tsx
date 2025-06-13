
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
    <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
      <OptimizedImage
        src={product.image}
        alt={`${product.baseName} - ${product.category}`}
        className="h-48 lg:h-64"
        priority={false}
      />
      <CardContent className="p-4 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-bold mb-3 font-iphone text-red-200">
          {product.baseName}
        </h3>
        
        <div className="flex items-center gap-2 lg:gap-3 mb-4">
          <Badge className="bg-barrush-steel/60 text-barrush-platinum px-2 lg:px-3 py-1 text-xs lg:text-sm font-iphone">
            {product.category}
          </Badge>
          {product.variants.length > 1 && (
            <Badge variant="outline" className="text-barrush-copper border-barrush-copper/50 text-xs lg:text-sm font-iphone">
              {product.variants.length} sizes
            </Badge>
          )}
        </div>

        {product.description && (
          <p className="text-barrush-platinum/80 mb-4 text-sm line-clamp-2 font-iphone">
            {product.description}
          </p>
        )}

        {/* Size Selector */}
        {product.variants.length > 1 ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-barrush-platinum/90 mb-2 font-iphone">
              Size & Price:
            </label>
            <Select 
              value={product.variants.indexOf(selectedVariant).toString()} 
              onValueChange={handleVariantChange}
            >
              <SelectTrigger className="bg-barrush-midnight/50 border-barrush-steel/40 text-barrush-platinum h-touch font-iphone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-barrush-midnight border-barrush-steel/40 z-50">
                {product.variants.map((variant, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="text-barrush-platinum hover:bg-barrush-steel/20 font-iphone h-touch"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span>{variant.size}</span>
                      <span className="ml-4 font-bold text-barrush-copper">
                        {variant.priceFormatted}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="mb-4">
            <span className="text-sm text-barrush-platinum/70 font-iphone">Size: {selectedVariant.size}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xl lg:text-3xl font-bold text-barrush-platinum font-iphone">
              {selectedVariant.priceFormatted}
            </span>
            {product.variants.length > 1 && selectedVariant !== product.variants[0] && (
              <span className="text-sm text-barrush-platinum/60 font-iphone">
                from {product.lowestPriceFormatted}
              </span>
            )}
          </div>
          <Button 
            onClick={handleAddToCart}
            className="text-barrush-midnight font-bold px-4 lg:px-6 py-3 transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500 h-touch w-full sm:w-auto font-iphone"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupedProductCard;
