
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronDown, Eye } from 'lucide-react';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { normalizeString } from '@/utils/stringUtils';

interface ProductCardVariant2Props {
  product: GroupedProduct;
}

function cleanProductName(name: string): string {
  return normalizeString(name)
    .replace(/\b\d+(\.\d+)?\s*(ml|l|cl|oz|litre|liter|pack|bottle|can)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQuantity(name: string): string {
  const match = name.match(/\b\d+(\.\d+)?\s*(ml|l|cl|oz|litre|liter|pack|bottle|can)\b/i);
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
    <Card className="group h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl transform hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.image}
            alt={cleanName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Premium overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20" />
        </div>
        
        <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-700 border-0 shadow-lg font-serif px-3 py-1">
          {product.category}
        </Badge>
      </div>
      
      <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mb-4">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {cleanName}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
                {selectedVariant.priceFormatted}
              </span>
              {quantity && (
                <span className="text-sm text-gray-500 font-medium mt-1 bg-gray-100 px-2 py-1 rounded-full inline-block w-fit">
                  {quantity}
                </span>
              )}
            </div>
            
            <Button
              onClick={() => setExpanded(!expanded)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full p-2 transition-all duration-300"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {product.variants.length > 1 && (
          <Select 
            value={product.variants.indexOf(selectedVariant).toString()} 
            onValueChange={(value) => setSelectedVariant(product.variants[parseInt(value)])}
          >
            <SelectTrigger className="w-full mb-4 border-gray-200 bg-white/70 backdrop-blur-sm hover:bg-white transition-colors">
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
          className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-serif"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-4 animate-in slide-in-from-top-2 duration-500">
            {product.description && (
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
            
            <Button 
              onClick={handleBuyNow}
              variant="outline"
              className="w-full border-2 border-rose-200 text-rose-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-rose-100 transition-all duration-300 py-3 rounded-xl font-serif font-semibold"
            >
              <Eye className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCardVariant2;
