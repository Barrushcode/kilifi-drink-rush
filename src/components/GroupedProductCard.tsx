
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface GroupedProductCardProps {
  product: GroupedProduct;
}

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  console.log('🔍 Rendering product:', product.baseName, 'with variants:', product.variants);

  const handleAddToCart = () => {
    try {
      const cartItem = {
        id: `${product.baseName}-${selectedVariant.size}`,
        name: product.baseName,
        price: selectedVariant.price,
        priceFormatted: selectedVariant.priceFormatted,
        size: selectedVariant.size,
        image: product.image,
        category: product.category
      };

      console.log('➕ Adding to cart:', cartItem);
      addItem(cartItem);
      
      toast({
        title: "Added to Cart",
        description: `${product.baseName} (${selectedVariant.size}) added to cart`,
        duration: 2000,
      });

      console.log(`✅ Successfully added to cart: ${product.baseName} (${selectedVariant.size})`);
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleBuyNow = () => {
    try {
      console.log('🛒 Buy now clicked for:', product.baseName);
      handleAddToCart();
      navigate('/cart');
    } catch (error) {
      console.error('❌ Error with buy now:', error);
    }
  };

  const handleVariantChange = (variantIndex: string) => {
    const variant = product.variants[parseInt(variantIndex)];
    console.log('🔄 Variant changed to:', variant);
    setSelectedVariant(variant);
  };

  return (
    <Card 
      className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-gray-800 border-gray-600"
    >
      <div className="relative h-32 md:h-40 lg:h-48 bg-gray-900">
        <OptimizedImage
          src={product.image}
          alt={`${product.baseName} - ${product.category}`}
          className="w-full h-full"
          priority={false}
        />
      </div>
      
      <CardContent className="p-3 md:p-4 lg:p-6 flex flex-col h-full">
        <h3 className="text-sm md:text-base lg:text-xl font-bold mb-2 font-iphone line-clamp-2 text-white">
          {product.baseName}
        </h3>
        
        <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-3">
          <Badge className="px-2 py-1 text-xs font-iphone bg-gray-600 text-gray-200 border-gray-500">
            {product.category}
          </Badge>
          {product.variants.length > 1 && (
            <Badge variant="outline" className="text-xs font-iphone text-gray-300 border-gray-500">
              {product.variants.length} sizes
            </Badge>
          )}
        </div>

        {product.description && (
          <p className="mb-3 text-xs md:text-sm line-clamp-2 font-iphone text-gray-300">
            {product.description}
          </p>
        )}

        {/* Size Selector */}
        {product.variants.length > 1 ? (
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 font-iphone text-gray-300">
              Size & Price:
            </label>
            <Select 
              value={product.variants.indexOf(selectedVariant).toString()} 
              onValueChange={handleVariantChange}
            >
              <SelectTrigger className="h-10 font-iphone text-xs bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50 bg-gray-700 border-gray-600">
                {product.variants.map((variant, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="font-iphone text-white"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs">{variant.size}</span>
                      <span className="ml-2 font-bold text-xs text-pink-400">
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
            <span className="text-xs font-iphone text-gray-300">
              Size: {selectedVariant.size}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-base md:text-lg lg:text-xl font-bold font-iphone text-white">
              {selectedVariant.priceFormatted}
            </span>
            {product.variants.length > 1 && selectedVariant !== product.variants[0] && (
              <span className="text-xs font-iphone text-gray-400">
                from {product.lowestPriceFormatted}
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow}
              className="flex-1 font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-pink-500 hover:bg-pink-600 text-white border-none"
            >
              <CreditCard className="h-3 w-3 mr-1" />
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupedProductCard;
