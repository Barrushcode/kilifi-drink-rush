import React, { useState, useEffect, useRef, useNavigate } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart, CartItem } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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

const generateOrderEmailHtml = (reference: string, amount: number, cartItems: CartItem[], shippingDetails: any) => {
  const itemsHtml = cartItems.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px;">${item.name} (${item.size})</td>
      <td style="padding: 10px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px;">${item.priceFormatted}</td>
      <td style="padding: 10px; text-align: right;">KES ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const fullAddress = [
      shippingDetails.street,
      shippingDetails.building,
      shippingDetails.area,
      shippingDetails.city
  ].filter(Boolean).join(', ');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = amount - subtotal;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 40px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; color: #333;">
      <h1 style="color: #d946ef; font-size: 24px; text-align: center;">Thank You For Your Order!</h1>
      <p style="text-align: center;">Your order #${reference} has been successfully placed.</p>
      
      <h2 style="font-size: 20px; color: #6b21a8; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="margin-top: 20px; text-align: right;">
        <p><strong>Subtotal:</strong> KES ${subtotal.toLocaleString()}</p>
        <p><strong>Delivery Fee:</strong> KES ${deliveryFee.toLocaleString()}</p>
        <h3 style="color: #d946ef;"><strong>Total Paid:</strong> KES ${amount.toLocaleString()}</h3>
      </div>

      <h2 style="font-size: 20px; color: #6b21a8; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Shipping Details</h2>
      <div style="line-height: 1.6;">
        <strong>Name:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName}<br>
        <strong>Phone:</strong> ${shippingDetails.phone}<br>
        <strong>Address:</strong> ${fullAddress}<br>
        <strong>Instructions:</strong> ${shippingDetails.instructions || 'None'}
      </div>

      <p style="margin-top: 40px; font-size: 0.9em; color: #777; text-align: center;">
        If you have any questions, feel free to contact our support team.
      </p>
    </div>
  `;
};

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
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
      callback: async function (response) {
        setProcessing(false);
        setSucceeded(true);
        console.log('Payment complete! Reference: ' + response.reference);

        try {
          const emailHtml = generateOrderEmailHtml(response.reference, amount, cartItems, shippingDetails);
          const { error: functionError } = await supabase.functions.invoke('send-order-confirmation', {
            body: {
              to: shippingDetails.email,
              subject: `Your Barrush Order Confirmation: #${response.reference}`,
              html: emailHtml,
            }
          });

          if (functionError) {
            throw functionError;
          }

          console.log('Order confirmation email sent successfully.');
          toast({
            title: "Order Confirmed!",
            description: "A confirmation email has been sent.",
            className: "bg-green-500 text-white"
          });
          clearCart();
          // After success, redirect to order placed
          setTimeout(() => {
            navigate("/order-placed");
          }, 1200);

        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          toast({
            title: "Email Sending Failed",
            description: "Your order was processed, but we couldn't send the confirmation email. Please contact support.",
            variant: "destructive",
          });
        }
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
      <Card ref={cardRef} className="bg-barrush-charcoal/80 border-neon-pink border shadow-lg">
        <CardContent className="p-8 text-center animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-neon-pink mb-4">Payment Successful!</h3>
          <p className="text-white mb-4">
            Your payment of KES {amount.toLocaleString()} has been processed successfully via Paystack.
          </p>
          <div className="bg-neon-purple/20 p-4 rounded-lg mt-4">
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
    <Card ref={cardRef} className="bg-barrush-charcoal/80 border-neon-pink border shadow-lg">
      <CardHeader>
        <CardTitle className="text-neon-pink text-zinc-50">Paystack Payment</CardTitle>
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
                className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400"
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
            <span className="text-xl font-bold text-neon-pink">KES {amount.toLocaleString()}</span>
          </div>

          <div className="bg-neon-purple/20 p-4 rounded-lg">
            <h4 className="font-semibold text-white mb-3 text-sm">Supported Payment Methods:</h4>
            <div className="flex items-center justify-around gap-2 md:gap-4 mb-3">
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <span>Visa</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <span>Mastercard</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <span>M-PESA</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white text-xs md:text-sm">
                <span>Apple Pay</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={processing || (!email && !shippingDetails?.email)}
            className={`w-full bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold py-6 text-lg transition-all duration-300 ${processing && 'opacity-60 cursor-not-allowed'}`}
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
