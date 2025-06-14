
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { normalizeString } from '@/utils/stringUtils';

interface ProductCardVariant2Props {
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

const ProductCardVariant2: React.FC<ProductCardVariant2Props> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [expanded, setExpanded] = useState(false);
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
    <Card className="group h-full bg-gradient-to-br from-white to-gray-50 border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={cleanName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 border-0 shadow-sm">
          {product.category}
        </Badge>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {cleanName}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-rose-600">
              {selectedVariant.priceFormatted}
            </span>
            {quantity && (
              <span className="text-sm text-gray-500 font-medium">{quantity}</span>
            )}
          </div>
          
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <Plus className={`h-4 w-4 transition-transform ${expanded ? 'rotate-45' : ''}`} />
          </Button>
        </div>

        {product.variants.length > 1 && (
          <Select 
            value={product.variants.indexOf(selectedVariant).toString()} 
            onValueChange={(value) => setSelectedVariant(product.variants[parseInt(value)])}
          >
            <SelectTrigger className="w-full mb-4 border-gray-200">
              <SelectValue />
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
        )}
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2">
            {product.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                {product.description}
              </p>
            )}
            <Button 
              onClick={handleBuyNow}
              variant="outline"
              className="w-full border-rose-600 text-rose-600 hover:bg-rose-50"
            >
              Buy Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCardVariant2;
