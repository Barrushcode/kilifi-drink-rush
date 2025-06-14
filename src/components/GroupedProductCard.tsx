
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, Wine, Beer } from 'lucide-react';
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

const getLogoIconForCategory = (category: string) => {
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes('wine') || lowerCat.includes('champagne')) return <Wine size={62} color="#e11d48" className="m-auto" />;
  if (lowerCat.includes('beer')) return <Beer size={62} color="#eab308" className="m-auto" />;
  // Spirits fallback: use wine icon (could use another fallback if new icon allowed)
  return <Wine size={62} color="#db2777" className="m-auto" />;
};

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
        image: product.image,
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
        image: product.image,
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
    if (tag === 'button' || tag === 'svg') return;
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
        className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-gray-800 border-gray-600 cursor-pointer"
        onClick={handleCardClick}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter') setModalOpen(true);
        }}
        aria-label={`Open details for ${displayName}`}
        role="button"
      >
        <div className="relative flex items-center justify-center h-32 md:h-40 lg:h-48 bg-gray-900">
          {/* Display logo based on category */}
          {getLogoIconForCategory(product.category)}
        </div>
        <CardContent className="p-3 md:p-4 lg:p-6 flex flex-col h-full">
          <h3 className="text-sm md:text-base lg:text-xl font-bold mb-2 font-iphone line-clamp-2 text-white">
            {displayName}
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
            <div className="flex gap-2 mt-2 z-10">
              <Button 
                onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                className="flex-1 font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
              <Button 
                onClick={(e) => { e.stopPropagation(); handleBuyNow(); }}
                className="flex-1 font-bold px-3 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg"
                style={{
                  backgroundColor: '#e11d48', // Explicit rose
                  color: '#fff',
                }}
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

