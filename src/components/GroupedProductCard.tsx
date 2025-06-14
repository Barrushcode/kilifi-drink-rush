
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductQuickViewModal from './ProductQuickViewModal';
import { normalizeString } from '@/utils/stringUtils';

interface GroupedProductCardProps {
  product: GroupedProduct;
}

function capitalizeWords(str: string) {
  return str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
}

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    try {
      const cartItem = {
        id: `${product.baseName}-${selectedVariant.size}`,
        name: product.baseName,
        price: selectedVariant.price,
        priceFormatted: selectedVariant.priceFormatted,
        size: selectedVariant.size,
        image: product.image, // Retaining image for cart/modal data
        category: product.category
      };
      addItem(cartItem);
      toast({
        title: "Added to Cart",
        description: `${product.baseName} (${selectedVariant.size}) added to cart`,
        duration: 2000,
      });
    } catch (error) {
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
      const cartItem = {
        id: `${product.baseName}-${selectedVariant.size}`,
        name: product.baseName,
        price: selectedVariant.price,
        priceFormatted: selectedVariant.priceFormatted,
        size: selectedVariant.size,
        image: product.image, // Retaining image for cart/modal data
        category: product.category
      };
      addItem(cartItem);
      navigate('/cart');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleVariantChange = (variantIndex: string) => {
    const variant = product.variants[parseInt(variantIndex)];
    setSelectedVariant(variant);
  };

  // Make main card clickable except button row
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if pressing buttons
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (tag === 'button' || tag === 'svg' || (e.target as HTMLElement).closest('button')) return;
    setModalOpen(true);
  };

  // Normalize and capitalize product name for display
  const displayName = capitalizeWords(normalizeString(product.baseName));

  return (
    <>
      <ProductQuickViewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={product}
      />
      <Card 
        className="overflow-hidden h-full shadow-md hover:shadow-lg transition-all duration-300 group hover:scale-105 bg-barrush-slate border-barrush-steel/30 cursor-pointer"
        onClick={handleCardClick}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter') setModalOpen(true);
        }}
        aria-label={`Open details for ${displayName}`}
        role="button"
      >
        <CardContent className="p-3 md:p-4 lg:p-6 flex flex-col h-full">
          <h3 className="text-sm md:text-base lg:text-xl font-bold mb-2 font-iphone line-clamp-2 text-barrush-platinum">
            {displayName}
          </h3>
          <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-3">
            <Badge className="px-2 py-1 text-xs font-iphone bg-barrush-steel/60 text-barrush-platinum border-barrush-steel/80">
              {product.category}
            </Badge>
            {product.variants.length > 1 && (
              <Badge variant="outline" className="text-xs font-iphone text-barrush-platinum/70 border-barrush-steel/80">
                {product.variants.length} sizes
              </Badge>
            )}
          </div>
          {product.description && (
            <p className="mb-3 text-xs md:text-sm line-clamp-2 font-iphone text-barrush-platinum/80">
              {product.description}
            </p>
          )}
          {/* Size Selector */}
          {product.variants.length > 1 ? (
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1 font-iphone text-barrush-platinum/80">
                Size & Price:
              </label>
              <Select 
                value={product.variants.indexOf(selectedVariant).toString()} 
                onValueChange={handleVariantChange}
              >
                <SelectTrigger className="h-10 font-iphone text-xs bg-barrush-midnight border-barrush-steel text-barrush-platinum">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-barrush-midnight border-barrush-steel">
                  {product.variants.map((variant, index) => (
                    <SelectItem 
                      key={index} 
                      value={index.toString()}
                      className="font-iphone text-barrush-platinum hover:!bg-barrush-steel/50 focus:!bg-barrush-steel/50"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs">{variant.size}</span>
                        <span className="ml-2 font-bold text-xs text-pink-400"> {/* Kept pink price in dropdown for now, can be changed if needed */}
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
              <span className="text-xs font-iphone text-barrush-platinum/80">
                Size: {selectedVariant.size}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex flex-col">
              <span className="text-base md:text-lg lg:text-xl font-bold font-iphone text-barrush-platinum">
                {selectedVariant.priceFormatted}
              </span>
              {product.variants.length > 1 && selectedVariant !== product.variants[0] && (
                <span className="text-xs font-iphone text-barrush-platinum/70">
                  from {product.lowestPriceFormatted}
                </span>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 mt-2 z-10">
              <Button 
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                className="flex-1 font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-transparent border-2 border-barrush-copper text-barrush-copper hover:bg-barrush-copper hover:text-barrush-midnight"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
              <Button 
                onClick={(e) => { e.stopPropagation(); handleBuyNow(); }}
                className="flex-1 font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-barrush-copper text-barrush-midnight hover:bg-barrush-copper/90 border-none shadow-lg"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Buy Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default GroupedProductCard;

