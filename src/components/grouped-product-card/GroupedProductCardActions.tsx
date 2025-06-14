
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard } from 'lucide-react';

interface GroupedProductCardActionsProps {
  onAddToCart: (e?: React.MouseEvent) => void;
  onBuyNow: (e?: React.MouseEvent) => void;
}

const GroupedProductCardActions: React.FC<GroupedProductCardActionsProps> = ({ onAddToCart, onBuyNow }) => {
  return (
    <div className="flex gap-3 mt-auto">
      <Button
        onClick={onAddToCart}
        className="flex-1 flex items-center justify-center gap-1 font-bold px-3 text-sm transition-all duration-300 h-11 font-iphone bg-neon-pink hover:bg-neon-pink/90 text-barrush-midnight shadow-glow-pink hover:shadow-glow-pink-hover"
      >
        <ShoppingCart className="h-4 w-4 mr-1" />
        Add to Cart
      </Button>
      <Button
        onClick={onBuyNow}
        className="flex-1 flex items-center justify-center gap-1 font-bold px-3 text-sm transition-all duration-300 h-11 font-iphone bg-neon-blue hover:bg-neon-blue/90 text-barrush-midnight shadow-glow-blue hover:shadow-glow-blue-hover"
      >
        <CreditCard className="h-4 w-4 mr-1" />
        Buy Now
      </Button>
    </div>
  );
};

export default GroupedProductCardActions;
