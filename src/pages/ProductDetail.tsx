import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, CreditCard, MessageCircle, Share2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';
import ProductImageLoader from '@/components/ProductImageLoader';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { getSupabaseProductImageUrl } from '@/utils/supabaseImageUrl';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { products, loading } = useOptimizedProducts({
    searchTerm: '',
    selectedCategory: '',
    currentPage: 1,
    itemsPerPage: 1000
  });
  
  const [product, setProduct] = useState<GroupedProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [supabaseImage, setSupabaseImage] = useState<string | null>(null);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.baseName.replace(/\s+/g, '-').toLowerCase() === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedVariant(foundProduct.variants[0]);
      }
    }
  }, [products, id]);

  useEffect(() => {
    if (product) {
      let ignore = false;
      async function fetchImage() {
        const url = await getSupabaseProductImageUrl(product.baseName);
        if (!ignore) setSupabaseImage(url);
      }
      fetchImage();
      return () => { ignore = true; };
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
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
    if (!product || !selectedVariant) return;
    
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
    if (!product) return;
    const message = `Hi, is ${product.baseName} available today?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/254117808024?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.baseName,
      text: `Check out ${product.baseName} at our store!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Product link copied to clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share product",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleVariantChange = (variantIndex: string) => {
    if (!product) return;
    const variant = product.variants[parseInt(variantIndex)];
    setSelectedVariant(variant);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-barrush-midnight to-barrush-slate flex items-center justify-center">
        <div className="text-barrush-platinum">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-barrush-midnight to-barrush-slate flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-barrush-platinum mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const displayImage = supabaseImage || product.image;

  return (
    <div className="min-h-screen bg-gradient-to-b from-barrush-midnight to-barrush-slate">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="bg-transparent border-barrush-steel text-barrush-platinum hover:bg-barrush-steel/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShare}
            className="bg-transparent border-barrush-steel text-barrush-platinum hover:bg-barrush-steel/20"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-barrush-midnight">
            <ProductImageLoader
              src={displayImage}
              alt={product.baseName}
              className="w-full h-full object-cover"
              priority={true}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-barrush-platinum mb-2">
                {product.baseName}
              </h1>
              <Badge className="bg-barrush-steel/60 text-barrush-platinum">
                {product.category}
              </Badge>
            </div>

            {product.description && (
              <p className="text-barrush-platinum/80 text-lg">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-barrush-platinum">
                {selectedVariant?.priceFormatted}
              </div>
              {product.variants.length > 1 && selectedVariant !== product.variants[0] && (
                <div className="text-sm text-barrush-platinum/70">
                  from {product.lowestPriceFormatted}
                </div>
              )}
            </div>

            {/* Size Selector */}
            {product.variants.length > 1 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-barrush-platinum/80">
                  Available Sizes:
                </label>
                <Select 
                  value={selectedVariant ? product.variants.indexOf(selectedVariant).toString() : '0'} 
                  onValueChange={handleVariantChange}
                >
                  <SelectTrigger className="bg-barrush-midnight border-barrush-steel text-barrush-platinum">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-barrush-midnight border-barrush-steel">
                    {product.variants.map((variant, index) => (
                      <SelectItem 
                        key={index} 
                        value={index.toString()}
                        className="text-barrush-platinum hover:!bg-barrush-steel/50 focus:!bg-barrush-steel/50"
                      >
                        <div className="flex justify-between items-center w-full">
                          <span>{variant.size}</span>
                          <span className="ml-4 font-bold text-pink-400">
                            {variant.priceFormatted}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-transparent border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </div>
              
              <Button 
                onClick={handleWhatsAppCheck}
                className="w-full bg-green-600 hover:bg-green-500 text-white"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Check Availability
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;