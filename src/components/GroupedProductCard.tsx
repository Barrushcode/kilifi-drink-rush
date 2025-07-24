
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, CreditCard, MessageCircle, ExternalLink } from 'lucide-react';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductQuickViewModal from './ProductQuickViewModal';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';
import ProductImageLoader from './ProductImageLoader';


// Utility to determine if the product image is appropriate
function isImageAppropriate(url?: string) {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  const badDomains = [
    'youtube.com', 'youtu.be', 'pinterest.com', 'facebook.com', 'instagram.com',
    'twitter.com', 'tiktok.com', 'reddit.com', 'blogspot.com', 'wordpress.com',
    'wikimedia.org', 'wikipedia.org', 'tumblr.com', 'placeholder', 'no-image',
    'svg', 'icon', 'logo'
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

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

const GroupedProductCard: React.FC<GroupedProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [supabaseImage, setSupabaseImage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Generate product URL slug
  const getProductSlug = (name: string) => {
    return name.replace(/\s+/g, '-').toLowerCase();
  };


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

  const handleWhatsAppCheck = () => {
    const message = `Hi, is ${product.baseName} available today?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254117808024?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleVariantChange = (variantIndex: string) => {
    const variant = product.variants[parseInt(variantIndex)];
    setSelectedVariant(variant);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase();
    if (tag === 'button' || tag === 'svg' || (e.target as HTMLElement).closest('button')) return;
    setExpanded(prev => !prev);
  };

  useEffect(() => {
    let ignore = false;
    async function fetchImage() {
      const url = await getSupabaseProductImageUrl(product.baseName);
      if (!ignore) setSupabaseImage(url);
    }
    fetchImage();
    return () => { ignore = true; };
  }, [product.baseName]);

  let displayImage = supabaseImage || (isImageAppropriate(product.image) ? product.image : FALLBACK_IMAGE);

  return (
    <>
      <ProductQuickViewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={product}
      />
      <Card
        className="overflow-hidden h-full min-h-[320px] shadow-lg transition-all duration-300 group hover:scale-105 bg-barrush-slate border-barrush-steel/30 flex flex-col cursor-pointer"
        onClick={handleCardClick}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter') setExpanded(prev => !prev);
        }}
        aria-label={`Show details for ${product.baseName}`}
        role="button"
      >
        <CardContent className="p-2 md:p-4 lg:p-5 flex flex-col h-full">
          <div className="flex flex-col flex-grow">
            {/* Product Image with flexible sizing */}
            <div className="w-full rounded-lg overflow-hidden mb-2 relative bg-barrush-midnight">
              <ProductImageLoader
                src={displayImage}
                alt={product.baseName}
                className="w-full h-auto object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300" />
            </div>
            
            {/* Product Name with correction */}
            <h3 className="text-xs md:text-base lg:text-xl font-bold mb-1 font-iphone line-clamp-2 text-barrush-platinum break-words">
              {product.baseName}
            </h3>
            
            {/* Expanded Details */}
            {expanded && (
              <>
                <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2">
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
                  <p className="mb-2 text-xs md:text-sm font-iphone text-barrush-platinum/80">
                    {product.description}
                  </p>
                )}
                
                {/* Size Selector with clear labeling */}
                {product.variants.length > 1 ? (
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1 font-iphone text-barrush-platinum/80">
                      Available Sizes:
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
                              <span className="text-xs font-medium">{variant.size}</span>
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
                  <div className="mb-2">
                    <span className="text-xs font-iphone text-barrush-platinum/80 bg-barrush-steel/30 px-2 py-1 rounded">
                      Size: {selectedVariant.size}
                    </span>
                  </div>
                )}
                
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
              </>
            )}
            
            {/* Collapsed State */}
            {!expanded && (
              <>
                <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2">
                  <Badge className="px-2 py-1 text-xs font-iphone bg-barrush-steel/60 text-barrush-platinum border-barrush-steel/80">
                    {product.category}
                  </Badge>
                  {product.variants.length > 1 && (
                    <Badge variant="outline" className="text-xs font-iphone text-barrush-platinum/70 border-barrush-steel/80">
                      {product.variants.length} sizes available
                    </Badge>
                  )}
                </div>
                {product.description && (
                  <p className="text-barrush-platinum/80 mb-2 text-xs line-clamp-2 font-iphone">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg lg:text-xl font-bold font-iphone text-barrush-platinum">
                    {product.lowestPriceFormatted}
                  </span>
                  {product.variants.length > 1 && (
                    <span className="text-xs font-iphone text-barrush-platinum/60">
                      + {product.variants.length - 1} more
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 w-full flex-col sm:flex-row">
            <Button 
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
              className="flex-1 font-bold px-2 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white w-full"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
            <Button 
              onClick={(e) => { e.stopPropagation(); handleBuyNow(); }}
              className="flex-1 font-bold px-2 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-rose-600 hover:bg-rose-500 text-white border-none shadow-lg w-full"
              style={{
                backgroundColor: '#e11d48',
                color: '#fff',
              }}
            >
              <CreditCard className="h-3 w-3 mr-1" />
              Buy Now
            </Button>
          </div>
          
          {/* WhatsApp Availability Button */}
          <div className="mt-2 w-full">
            <Button 
              onClick={(e) => { e.stopPropagation(); handleWhatsAppCheck(); }}
              className="w-full font-bold px-2 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-green-600 hover:bg-green-500 text-white border-none shadow-lg"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Check Availability
            </Button>
          </div>
          
          {/* View Details Button */}
          <div className="mt-2 w-full">
            <Link 
              to={`/product/${getProductSlug(product.baseName)}`}
              className="block w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button 
                className="w-full font-bold px-2 py-2 text-xs md:text-sm transition-all duration-300 hover:scale-105 h-10 font-iphone min-h-[40px] bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default GroupedProductCard;
