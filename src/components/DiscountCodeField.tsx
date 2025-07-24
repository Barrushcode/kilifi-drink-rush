import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiscountCodeFieldProps {
  onDiscountApplied: (discount: number, code: string) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: { amount: number; code: string } | null;
}

const VALID_CODES = {
  BARRUSHKINGS: {
    type: 'delivery_discount',
    amount: 100,
    description: 'KES 100 off delivery fee'
  }
};

const DiscountCodeField: React.FC<DiscountCodeFieldProps> = ({
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApplyCode = () => {
    if (!code.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const upperCode = code.trim().toUpperCase();
      const validCode = VALID_CODES[upperCode as keyof typeof VALID_CODES];
      
      if (validCode) {
        onDiscountApplied(validCode.amount, upperCode);
        toast({
          title: "Discount Applied!",
          description: `${validCode.description} has been applied to your order.`,
          duration: 3000,
        });
        setCode('');
      } else {
        toast({
          title: "Invalid Code",
          description: "The promo code you entered is not valid.",
          variant: "destructive",
          duration: 3000,
        });
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleRemoveDiscount = () => {
    onDiscountRemoved();
    toast({
      title: "Discount Removed",
      description: "The promo code has been removed from your order.",
      duration: 2000,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCode();
    }
  };

  return (
    <Card className="bg-barrush-charcoal/80 border-barrush-steel/30 border">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-neon-pink" />
            <h3 className="text-white font-semibold">Promo Code</h3>
          </div>
          
          {appliedDiscount ? (
            <div className="flex items-center justify-between p-3 bg-green-900/30 border border-green-600/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <div>
                  <Badge variant="secondary" className="bg-green-600 text-white">
                    {appliedDiscount.code}
                  </Badge>
                  <p className="text-sm text-green-300 mt-1">
                    KES {appliedDiscount.amount} off delivery fee
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveDiscount}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter promo code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-barrush-midnight border-barrush-steel text-white placeholder:text-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleApplyCode}
                disabled={!code.trim() || isLoading}
                className="bg-neon-pink hover:bg-neon-pink/80 text-white px-4"
              >
                {isLoading ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          )}
          
          <p className="text-xs text-gray-400">
            Have a promo code? Enter it above to apply discounts to your order.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountCodeField;