
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, ShoppingCart } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { GroupedProduct, ProductVariant } from '@/utils/productGroupingUtils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProductQuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: GroupedProduct;
}

const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({ open, onOpenChange, product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVariantChange = (variantIndex: string) => {
    setSelectedVariant(product.variants[parseInt(variantIndex)]);
  };

  const handleBuyNow = () => {
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
    onOpenChange(false);
    navigate('/cart');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-lg bg-gray-900 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white font-iphone">{product.baseName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <OptimizedImage
            src={product.image}
            alt={product.baseName}
            className="w-52 h-52 object-cover rounded-md"
            priority={false}
          />
          <Badge className="bg-gray-700 text-gray-100 px-2 py-0.5 text-xs">{product.category}</Badge>
          {product.description && (
            <p className="text-sm text-gray-200 text-center">{product.description}</p>
          )}
          <div className="w-full">
            <label className="block text-xs font-medium mb-2 text-gray-400">Size & Price:</label>
            <Select 
              value={product.variants.indexOf(selectedVariant).toString()} 
              onValueChange={handleVariantChange}
            >
              <SelectTrigger className="w-full h-10 bg-gray-800 text-white border-gray-700 font-iphone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {product.variants.map((variant, idx) => (
                  <SelectItem key={idx} value={idx.toString()} className="text-white font-iphone">
                    <div className="flex justify-between w-full items-center">
                      <span>{variant.size}</span>
                      <span className="ml-2 font-bold text-pink-400">{variant.priceFormatted}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-base font-bold font-iphone mt-2 text-white">
            {selectedVariant.priceFormatted}
          </span>
          <Button
            onClick={handleBuyNow}
            className="w-full font-bold text-white flex justify-center items-center gap-2 bg-rose-600 hover:bg-rose-500 min-h-[44px] text-base mt-4"
            style={{ backgroundColor: '#e11d48' }}
          >
            <CreditCard className="h-4 w-4 mr-1" />
            Buy Now
          </Button>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="w-full mt-2 text-gray-300 border border-gray-600"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickViewModal;
