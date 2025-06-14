
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Apple } from 'lucide-react'; // Added Smartphone and Apple, kept CreditCard
import { CartItem } from '@/contexts/CartContext';

// Declare Paystack global type
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  channels: string[];
  callback: (response: {
    reference: string;
  }) => void;
  onClose: () => void;
}

interface PaystackCheckoutProps {
  amount: number;
  onValidationRequired?: () => boolean;
  shippingDetails?: any;
  cartItems?: CartItem[];
}

const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({
  amount,
  onValidationRequired,
  shippingDetails,
  cartItems = []
}) => {
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll/focus Paystack card into view on render for better UX
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if form validation is required and failed
    if (onValidationRequired && !onValidationRequired()) {
      setError('Please fill in all required shipping details before proceeding with payment');
      return;
    }

    const emailToUse = email || shippingDetails?.email;
    if (!emailToUse) {
      setError('Please enter your email address');
      return;
    }

    if (!window.PaystackPop) {
      setError('Paystack not loaded. Please refresh the page and try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    const handler = window.PaystackPop.setup({
      key: 'pk_live_4f87a6d250476cc70ba40b40e9262c78fd37e06b',
      email: emailToUse,
      amount: amount * 100, // Convert to kobo (smallest currency unit)
      currency: 'KES',
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      channels: ['card', 'mobile_money', 'apple_pay'], // M-PESA is included in mobile_money
      callback: function (response) {
        setProcessing(false);
        setSucceeded(true);
        console.log('Payment complete! Reference: ' + response.reference);
        
        // Log order details for future email integration
        console.log('Order Details:', {
          reference: response.reference,
          amount: amount,
          items: cartItems,
          shipping: shippingDetails
        });
      },
      onClose: function () {
        setProcessing(false);
        setError('Transaction was cancelled');
      }
    });

    handler.openIframe();
  };

  if (succeeded) {
    return (
      <Card ref={cardRef} className="bg-barrush-charcoal/80 border-barrush-gold border shadow-lg">
        <CardContent className="p-8 text-center animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-barrush-gold mb-4">Payment Successful!</h3>
          <p className="text-white mb-4">
            Your payment of KES {amount.toLocaleString()} has been processed successfully via Paystack.
          </p>
          <div className="bg-barrush-burgundy/20 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">Order Summary:</h4>
            <div className="text-left space-y-1 text-sm text-gray-300 max-h-32 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} ({item.size}) x{item.quantity}</span>
                  <span>{item.priceFormatted}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-4">
            A confirmation email will be sent to your registered email address.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="bg-barrush-charcoal/80 border-barrush-gold border shadow-lg">
      <CardHeader>
        <CardTitle className="text-barrush-gold text-zinc-50">Paystack Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!shippingDetails?.email && (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoFocus
                className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400"
              />
            </div>
          )}
          
          {error && (
            <div className="text-red-400 text-base font-semibold bg-red-900/40 p-3 rounded border border-red-500 animate-pulse">
              {error}
            </div>
          )}
          
          <div className="flex justify-between items-center text-white mb-4">
            <span className="text-lg">Total Amount:</span>
            <span className="text-xl font-bold text-barrush-gold">KES {amount.toLocaleString()}</span>
          </div>

          {/* Payment Methods Section - Updated with Lucide Icons */}
          <div className="bg-barrush-burgundy/20 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-3 text-sm">Supported Payment Methods:</h4>
            <div className="flex items-center justify-around gap-2 md:gap-4 mb-3">
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                <span>Visa</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-orange-400" />
                <span>Mastercard</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <Smartphone className="h-6 w-6 md:h-8 md:w-8 text-green-400" />
                <span>M-PESA</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <Apple className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                <span>Apple Pay</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={processing || (!email && !shippingDetails?.email)}
            className={`w-full bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold py-6 text-lg transition-all duration-300 ${processing && 'opacity-60 cursor-not-allowed'}`}
          >
            {processing ? 'Processing Payment...' : `Pay KES ${amount.toLocaleString()} via Paystack`}
          </Button>
          
          <p className="text-sm text-white/60 text-center">
            Secure payment powered by Paystack
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaystackCheckout;
