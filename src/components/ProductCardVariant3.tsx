
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { normalizeString } from '@/utils/stringUtils';

interface ProductCardVariant3Props {
  product: GroupedProduct;
}

function cleanProductName(name: string): string {
  return normalizeString(name)
    .replace(/\b\d+(\.\d+)?\s*(ml|l|cl|oz|litre|liter)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQuantity(name: string): string {
  const match = name.match(/\b\d+(\.\d+)?\s*(ml|l|cl|oz|litre|liter)\b/i);
  return match ? match[0] : '';
}

const ProductCardVariant3: React.FC<ProductCardVariant3Props> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  const cleanName = cleanProductName(product.baseName);
  const quantity = extractQuantity(product.baseName);

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
        description: `${cleanName} added successfully`,
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
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <Card 
      className="group h-full bg-white border border-gray-100 hover:border-rose-200 transition-all duration-300 overflow-hidden rounded-2xl shadow-sm hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-50">
          <img
            src={product.image}
            alt={cleanName}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-4 right-4">
            {product.description && isHovered && (
              <p className="text-white text-sm mb-3 line-clamp-2 animate-in slide-in-from-bottom-2">
                {product.description}
              </p>
            )}
            {isHovered && (
              <Button 
                onClick={handleBuyNow}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold animate-in slide-in-from-bottom-3"
              >
                Buy Now
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
            {product.category}
          </Badge>
          {quantity && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
              {quantity}
            </span>
          )}
        </div>
        
        <h3 className="font-serif text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {cleanName}
        </h3>
        
        <div className="space-y-3">
          {product.variants.length > 1 ? (
            <Select 
              value={product.variants.indexOf(selectedVariant).toString()} 
              onValueChange={(value) => setSelectedVariant(product.variants[parseInt(value)])}
            >
              <SelectTrigger className="w-full border-gray-200 focus:border-rose-300 focus:ring-rose-200">
                <div className="flex justify-between items-center w-full">
                  <span>{selectedVariant.size}</span>
                  <span className="font-bold text-rose-600">{selectedVariant.priceFormatted}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    <div className="flex justify-between items-center w-full">
                      <span>{variant.size}</span>
                      <span className="ml-2 font-semibold">{variant.priceFormatted}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{selectedVariant.size}</span>
              <span className="text-xl font-bold text-rose-600">{selectedVariant.priceFormatted}</span>
            </div>
          )}
          
          <Button 
            onClick={handleAddToCart}
            variant="outline"
            className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 font-semibold"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardVariant3;
