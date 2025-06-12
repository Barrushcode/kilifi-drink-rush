
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

interface PaystackCheckoutProps {
  amount: number;
}

const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({ amount }) => {
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
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
      email: email,
      amount: amount * 100, // Convert to kobo (smallest currency unit)
      currency: 'KES',
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      channels: ['card', 'mobile_money', 'apple_pay'],
      callback: function(response) {
        setProcessing(false);
        setSucceeded(true);
        console.log('Payment complete! Reference: ' + response.reference);
      },
      onClose: function() {
        setProcessing(false);
        setError('Transaction was cancelled');
      }
    });

    handler.openIframe();
  };

  if (succeeded) {
    return (
      <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-barrush-gold mb-4">Payment Successful!</h3>
          <p className="text-white">
            Your payment of KES {amount} has been processed successfully via Paystack.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
      <CardHeader>
        <CardTitle className="text-barrush-gold">Paystack Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400"
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-between items-center text-white mb-4">
            <span className="text-lg">Total Amount:</span>
            <span className="text-xl font-bold text-barrush-gold">KES {amount}</span>
          </div>
          
          <Button
            type="submit"
            disabled={processing}
            className="w-full bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold py-6 text-lg"
          >
            {processing ? 'Processing...' : `Pay KES ${amount} with Paystack`}
          </Button>
          
          <p className="text-sm text-white/60 text-center">
            Supports Card, Mobile Money & Apple Pay
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaystackCheckout;
