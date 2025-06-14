
import React, { useState } from 'react';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductQuickViewModal from './ProductQuickViewModal';
import { normalizeString } from '@/utils/stringUtils';

function isImageAppropriate(url?: string) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  const badDomains = [
    'youtube.com', 'youtu.be', 'pinterest.com', 'facebook.com', 'instagram.com',
    'twitter.com', 'tiktok.com', 'reddit.com', 'blogspot.com', 'wordpress.com',
    'wikimedia.org', 'wikipedia.org', 'tumblr.com', 'placeholder', 'no-image', 'svg', 'icon', 'logo'
  ];
  if (badDomains.some(domain => lowerUrl.includes(domain))) return false;
  if (
    lowerUrl.endsWith('.svg') ||
    /150|default|thumb|generic/i.test(lowerUrl) ||
    lowerUrl.includes('placeholder')
  ) return false;
  if (!/\.(jpg|jpeg|png|webp)$/i.test(lowerUrl)) return false;
  return true;
}

interface GroupedProductCardProps {
  product: GroupedProduct;
}

function capitalizeWords(str: string) {
  return str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  // Normalize product name
  const displayName = capitalizeWords(normalizeString(product.baseName));
  const displayImage = isImageAppropriate(product.image) ? product.image : FALLBACK_IMAGE;

  return (
    <>
      <ProductQuickViewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={product}
      />
      <div
        className="
          bg-glass-effect rounded-2xl shadow-lg border border-barrush-steel/20
          overflow-hidden hover:shadow-xl transition-all duration-300 font-iphone relative cursor-pointer group
          flex flex-col
        "
        onClick={() => setModalOpen(true)}
        tabIndex={0}
        role="button"
        aria-label={`Open details for ${displayName}`}
        onKeyDown={e => { if (e.key === 'Enter') setModalOpen(true); }}
      >
        {/* Top Image */}
        <div className="relative">
          <img
            src={displayImage}
            alt={displayName}
            className="w-full h-48 object-cover rounded-t-2xl"
            style={{ filter: "brightness(1)" }}
            loading="lazy"
            onError={e => {
              if ((e.currentTarget as HTMLImageElement).src !== FALLBACK_IMAGE) {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
              }
            }}
          />
        </div>
        {/* Card Details */}
        <div className="p-5 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-barrush-steel/60 text-barrush-platinum px-2 py-1 font-iphone text-xs">
              {product.category}
            </Badge>
            {!!product.variants.length && product.variants.length > 1 && (
              <Badge variant="outline" className="text-xs font-iphone text-barrush-platinum/70 border-barrush-steel/80">
                {product.variants.length} sizes
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{displayName}</h3>
          {product.description && (
            <p className="text-barrush-platinum/80 mb-2 text-xs line-clamp-2">{product.description}</p>
          )}
          {product.variants.length > 1 ? (
            <div className="mb-2">
              <label className="block text-xs font-medium mb-1 font-iphone text-barrush-platinum/80">
                Size & Price:
              </label>
              <Select
                value={product.variants.indexOf(selectedVariant).toString()}
                onValueChange={handleVariantChange}
              >
                <SelectTrigger className="h-9 font-iphone text-xs bg-barrush-midnight border-barrush-steel text-barrush-platinum">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-barrush-midnight border-barrush-steel">
                  {product.variants.map((variant, idx) => (
                    <SelectItem
                      key={idx}
                      value={idx.toString()}
                      className="font-iphone text-barrush-platinum hover:!bg-barrush-steel/50 focus:!bg-barrush-steel/50"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs">{variant.size}</span>
                        <span className="ml-2 font-bold text-xs text-pink-400">{variant.priceFormatted}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="mb-2">
              <span className="text-xs font-iphone text-barrush-platinum/80">
                Size: {selectedVariant.size}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mb-0 mt-2">
            <span className="text-xl font-bold text-pink-400">{selectedVariant.priceFormatted}</span>
          </div>
          {/* --- Action Buttons --- */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1 font-bold px-3 py-2 text-xs transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1 font-bold px-3 py-2 text-xs transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-pink-500 hover:bg-pink-400 text-white border-none shadow-lg"
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupedProductCard;

