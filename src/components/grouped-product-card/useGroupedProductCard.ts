
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { normalizeString } from '@/utils/stringUtils';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

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

function capitalizeWords(str: string) {
  return str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));
}

export const useGroupedProductCard = (product: GroupedProduct) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
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

  const displayName = capitalizeWords(normalizeString(product.baseName));
  const displayImage = isImageAppropriate(product.image) ? product.image : FALLBACK_IMAGE;

  return {
    selectedVariant,
    handleVariantChange,
    handleAddToCart,
    handleBuyNow,
    displayName,
    displayImage,
  };
};
