import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag, Check, X } from 'lucide-react';
interface DiscountCodeInputProps {
  onDiscountApplied: (code: string, discount: number, discountType?: string) => void;
  onDiscountRemoved: () => void;
  appliedDiscount?: {
    code: string;
    amount: number;
    type?: string;
  } | null;
  subtotal: number; // Add subtotal to check order minimum
  items: any[]; // Add items to check product profits
}

// Available discount codes
const DISCOUNT_CODES = {
  'BARRUSHKINGS': {
    type: 'delivery_discount',
    amount: 100,
    description: 'KES 100 off delivery fee'
  },
  'BARRUSHKNIGHTS': {
    type: 'product_discount',
    amount: 200,
    description: 'KES 200 off eligible items',
    condition: 'profit > 200'
  }
};
const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
  onDiscountApplied,
  onDiscountRemoved,
  appliedDiscount,
  subtotal,
  items
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const handleApplyCode = async () => {
    if (!code.trim()) {
      setError('Please enter a discount code');
      return;
    }

    setIsApplying(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    const normalizedCode = code.trim().toUpperCase();
    const discountInfo = DISCOUNT_CODES[normalizedCode as keyof typeof DISCOUNT_CODES];
    
    if (discountInfo) {
      // Handle different discount types
      if (discountInfo.type === 'delivery_discount') {
        // Check if order is below 5000 KES for delivery discount eligibility
        if (subtotal >= 5000) {
          setError('Delivery discount codes only apply to orders below KES 5,000. Orders above KES 5,000 get free delivery!');
          setIsApplying(false);
          return;
        }
      } else if (discountInfo.type === 'product_discount') {
        // Check if any items are eligible based on profit
        const { supabase } = await import('@/integrations/supabase/client');
        
        try {
          // Get product titles to check their profits
          const productTitles = items.map(item => item.name);
          const { data: products, error } = await supabase
            .from('productprice')
            .select('Title, Profit')
            .in('Title', productTitles);
            
          if (error) {
            setError('Error checking product eligibility. Please try again.');
            setIsApplying(false);
            return;
          }
          
          // Check if any products have profit > 200
          const eligibleProducts = products?.filter(product => 
            product.Profit && product.Profit > 200
          );
          
          if (!eligibleProducts || eligibleProducts.length === 0) {
            setError('This discount only applies to premium items. No eligible items in your cart.');
            setIsApplying(false);
            return;
          }
        } catch (err) {
          setError('Error checking product eligibility. Please try again.');
          setIsApplying(false);
          return;
        }
      }
      
      onDiscountApplied(normalizedCode, discountInfo.amount, discountInfo.type);
      setCode('');
      setError('');
    } else {
      setError('Invalid discount code. Please check and try again.');
    }
    setIsApplying(false);
  };
  const handleRemoveDiscount = () => {
    onDiscountRemoved();
    setCode('');
    setError('');
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCode();
    }
  };
  return <Card className="bg-barrush-charcoal/80 border-neon-pink/30 border">
      <CardHeader className="pb-4">
        <CardTitle className="text-neon-pink text-lg flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Discount Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedDiscount ? <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <div>
                  <p className="text-green-400 font-semibold">{appliedDiscount.code}</p>
                  <p className="text-green-300 text-sm">
                    KES {appliedDiscount.amount} off {appliedDiscount.type === 'product_discount' ? 'eligible items' : 'delivery fee'}
                  </p>
                </div>
              </div>
              <Button onClick={handleRemoveDiscount} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div> : (
            subtotal >= 5000 ? (
              <div className="text-center p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Free Delivery Unlocked!</span>
                </div>
                <p className="text-green-300 text-sm">
                  Your order qualifies for free delivery (orders KES 5,000+)
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="discount-code" className="text-white text-sm">
                    Enter discount code
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      id="discount-code" 
                      type="text" 
                      value={code} 
                      onChange={e => setCode(e.target.value)} 
                      onKeyPress={handleKeyPress} 
                      placeholder="Enter code (e.g. BARRUSHKINGS, BARRUSHKNIGHTS)" 
                      className="bg-barrush-midnight border-gray-600 text-white placeholder-gray-400 flex-1" 
                      disabled={isApplying} 
                    />
                    <Button 
                      onClick={handleApplyCode} 
                      disabled={isApplying || !code.trim()} 
                      className="bg-neon-pink hover:bg-neon-pink/80 text-white px-6"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <X className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <div className="text-gray-400 text-xs">
                  <p>Available codes: BARRUSHKINGS (delivery), BARRUSHKNIGHTS (premium items)</p>
                </div>
              </div>
            )
          )}
      </CardContent>
    </Card>;
};
export default DiscountCodeInput;