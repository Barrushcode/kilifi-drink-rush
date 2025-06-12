import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import StripeCheckout from './StripeCheckout';
import PaystackCheckout from './PaystackCheckout';
const CheckoutSection: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack'>('paystack');
  const totalAmount = 2500; // Example amount in KES

  return <div className="min-h-screen bg-barrush-midnight py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-4 text-zinc-50">
            Checkout
          </h1>
          <p className="text-xl text-white">
            Complete your order securely
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
            <CardHeader>
              <CardTitle className="text-barrush-gold text-zinc-50">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-white">
                <span>Subtotal:</span>
                <span>KES 2,200</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Delivery Fee:</span>
                <span>KES 300</span>
              </div>
              <div className="border-t border-barrush-burgundy pt-4">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total:</span>
                  <span className="text-barrush-gold">KES {totalAmount}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-barrush-burgundy">
                <h4 className="font-semibold text-barrush-gold mb-3 text-zinc-50">Payment Options</h4>
                <p className="text-sm text-white mb-4">
                  Choose your preferred payment method:
                </p>
                <div className="space-y-2 text-white">
                  <p>• M-PESA Till Number: <strong className="text-barrush-gold">5950470</strong></p>
                  <p>• Card Payment via Stripe or Paystack</p>
                  <p>• Mobile Money & Apple Pay (Paystack)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
              <CardHeader>
                <CardTitle className="text-barrush-gold text-zinc-50">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value: 'stripe' | 'paystack') => setPaymentMethod(value)} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paystack" id="paystack" />
                    <Label htmlFor="paystack" className="text-white cursor-pointer">
                      Paystack (Card, Mobile Money, Apple Pay)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="text-white cursor-pointer">
                      Stripe (International Cards)
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Component */}
            {paymentMethod === 'stripe' ? <StripeCheckout amount={totalAmount} /> : <PaystackCheckout amount={totalAmount} />}

            {/* Alternative Payment Info */}
            <Card className="bg-barrush-burgundy/20 border-barrush-burgundy border">
              <CardContent className="p-6">
                <h4 className="font-semibold text-barrush-gold mb-3 text-zinc-50">Alternative Payment</h4>
                <p className="text-white mb-4">
                  You can also pay directly via M-PESA:
                </p>
                <div className="bg-barrush-charcoal/50 p-4 rounded-lg">
                  <p className="text-center text-white">
                    <strong className="text-barrush-gold text-xl">Till Number: 5950470</strong>
                  </p>
                  <p className="text-center text-sm text-white/80 mt-2">
                    Send KES {totalAmount} and contact us with your transaction ID
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default CheckoutSection;