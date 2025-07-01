
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import ProductImageLoader from './ProductImageLoader';
import { GroupedProduct } from '@/utils/productGroupingUtils';

interface GroupedProductCardProps {
  product: GroupedProduct;
  priority?: boolean;
  className?: string;
}

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ 
  product, 
  priority = false,
  className = ""
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // Add the main product (first variant) to cart
    const mainProduct = product.products[0];
    if (mainProduct) {
      addItem({
        id: mainProduct.id,
        name: product.baseName,
        price: product.lowestPrice,
        priceFormatted: product.lowestPriceFormatted,
        image: product.image,
        size: mainProduct.name.includes('ml') ? 
          mainProduct.name.match(/\d+ml/)?.[0] || 'Standard' : 
          'Standard',
        quantity: 1
      });

      toast({
        title: "Added to Cart",
        description: `${product.baseName} has been added to your cart.`,
        className: "bg-green-600 text-white"
      });
    }
  };

  return (
    <Card className={`
      group relative overflow-hidden border-2 border-transparent 
      hover:border-rose-500/50 hover:shadow-xl transition-all duration-300 
      bg-gradient-to-br from-barrush-charcoal/80 to-barrush-slate/80 
      backdrop-blur-sm h-full flex flex-col
      ${className}
    `}>
      <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col h-full">
        {/* Image Container - Responsive aspect ratio */}
        <div className="relative mb-3 lg:mb-4 flex-shrink-0">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-barrush-midnight/50">
            <ProductImageLoader
              src={product.image}
              alt={product.baseName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
            />
          </div>
          
          {/* Product count badge for mobile */}
          {product.products.length > 1 && (
            <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {product.products.length} sizes
            </div>
          )}
        </div>

        {/* Content Container - Flexible spacing */}
        <div className="flex flex-col flex-grow">
          {/* Product Name - Responsive text size */}
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-barrush-platinum mb-2 lg:mb-3 line-clamp-2 group-hover:text-rose-300 transition-colors leading-tight">
            {product.baseName}
          </h3>

          {/* Price Display - Responsive sizing */}
          <div className="mb-3 lg:mb-4">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-rose-400 mb-1">
              {product.lowestPriceFormatted}
            </p>
            {product.products.length > 1 && (
              <p className="text-xs sm:text-sm text-barrush-platinum/60">
                From {product.products.length} sizes available
              </p>
            )}
          </div>

          {/* Action Button - Responsive sizing */}
          <div className="mt-auto">
            <Button
              onClick={handleAddToCart}
              className="
                w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold 
                transition-all duration-200 hover:shadow-lg
                text-sm sm:text-base py-2 sm:py-3 lg:py-4 h-auto
                rounded-lg
              "
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupedProductCard;
