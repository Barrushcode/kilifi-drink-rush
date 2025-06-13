
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';

interface GroupedProductCardProps {
  product: GroupedProduct;
}

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const navigate = useNavigate();

  const handleBuy = () => {
    console.log(`Buying ${product.baseName} (${selectedVariant.size}) - ${selectedVariant.priceFormatted}`);
    // Navigate to checkout page
    navigate('/cart');
  };

  const handleVariantChange = (variantIndex: string) => {
    const variant = product.variants[parseInt(variantIndex)];
    setSelectedVariant(variant);
  };

  return (
    <Card className="bg-white hover:scale-105 transition-all duration-300 group overflow-hidden h-full shadow-md hover:shadow-lg">
      <div className="relative h-32 md:h-40 lg:h-48 bg-gray-50">
        <OptimizedImage
          src={product.image}
          alt={`${product.baseName} - ${product.category}`}
          className="w-full h-full"
          priority={false}
        />
      </div>
      
      <CardContent className="p-3 md:p-4 lg:p-6 flex flex-col h-full">
        <h3 className="text-sm md:text-base lg:text-xl font-bold mb-2 font-iphone text-gray-900 line-clamp-2">
          {product.baseName}
        </h3>
        
        <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-3">
          <Badge className="bg-gray-100 text-gray-700 px-2 py-1 text-xs font-iphone border border-gray-200">
            {product.category}
          </Badge>
          {product.variants.length > 1 && (
            <Badge variant="outline" className="text-gray-600 border-gray-300 text-xs font-iphone">
              {product.variants.length} sizes
            </Badge>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 mb-3 text-xs md:text-sm line-clamp-2 font-iphone">
            {product.description}
          </p>
        )}

        {/* Size Selector - Compact for mobile */}
        {product.variants.length > 1 ? (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1 font-iphone">
              Size & Price:
            </label>
            <Select 
              value={product.variants.indexOf(selectedVariant).toString()} 
              onValueChange={handleVariantChange}
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-10 font-iphone text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300 z-50">
                {product.variants.map((variant, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="text-gray-900 hover:bg-gray-100 font-iphone"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs">{variant.size}</span>
                      <span className="ml-2 font-bold text-rose-600 text-xs">
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
            <span className="text-xs text-gray-600 font-iphone">Size: {selectedVariant.size}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-base md:text-lg lg:text-xl font-bold text-gray-900 font-iphone">
              {selectedVariant.priceFormatted}
            </span>
            {product.variants.length > 1 && selectedVariant !== product.variants[0] && (
              <span className="text-xs text-gray-500 font-iphone">
                from {product.lowestPriceFormatted}
              </span>
            )}
          </div>
          <Button 
            onClick={handleBuy}
            className="text-white font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 bg-pink-500 hover:bg-pink-600 h-10 w-full font-iphone"
          >
            Buy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupedProductCard;
