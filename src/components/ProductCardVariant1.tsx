
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { normalizeString } from '@/utils/stringUtils';

interface ProductCardVariant1Props {
  product: GroupedProduct;
}

function cleanProductName(name: string): string {
  return normalizeString(name)
    .replace(/\b\d+(\.\d+)?\s*(ml|l|cl|oz|litre|liter)\b/gi, '') // Remove quantities
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQuantity(name: string): string {
  const match = name.match(/\b\d+(\.\d+)?\s*(ml|l|cl|oz|litre|liter)\b/i);
  return match ? match[0] : '';
}

const ProductCardVariant1: React.FC<ProductCardVariant1Props> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [showDetails, setShowDetails] = useState(false);
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
    <Card className="group h-full bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg overflow-hidden">
      <div 
        className="cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={cleanName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
              {product.category}
            </Badge>
            <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          
          <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {cleanName}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-gray-900">
              {selectedVariant.priceFormatted}
            </span>
            {quantity && <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{quantity}</span>}
          </div>

          {product.variants.length > 1 && (
            <Select 
              value={product.variants.indexOf(selectedVariant).toString()} 
              onValueChange={(value) => setSelectedVariant(product.variants[parseInt(value)])}
            >
              <SelectTrigger className="w-full mb-3 text-sm">
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
        </CardContent>
      </div>

      {showDetails && (
        <CardContent className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50">
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {product.description}
            </p>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button 
              onClick={handleBuyNow}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
            >
              Buy Now
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ProductCardVariant1;
