import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart, CartItem } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { logOrderToSupabase } from "@/utils/logOrderToSupabase";

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
      <td style="padding: 10px; text-align: right;">KES ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');
  const fullAddress = [shippingDetails.street, shippingDetails.building, shippingDetails.area, shippingDetails.city].filter(Boolean).join(', ');
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = amount - subtotal;
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 40px auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; color: #333;">
      <h1 style="color: #10b981; font-size: 32px; text-align: center;">Order Confirmed! 🎉</h1>
      <p style="text-align: center; font-size: 20px; color: #d946ef;"><strong>Your order has been received and is being processed.</strong></p>
      <p style="text-align: center;">Order Reference: <b>${reference}</b></p>
      
      <h2 style="font-size: 20px; color: #6b21a8; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 30px;">Order Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 18px;">
        <thead>
          <tr>
            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
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

      <p style="margin-top: 35px; font-size: 0.95em; color: #777; text-align: center;">
        Thank you for your order with Barrush Delivery!<br/>If you have questions or want to make changes, please reply to this email or contact our support.
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
  const {
    clearCart
  } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    cardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
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
      amount: amount * 100,
      // Convert to kobo (smallest currency unit)
      currency: 'KES',
      ref: '' + Math.floor(Math.random() * 1000000000 + 1),
      channels: ['card', 'mobile_money', 'apple_pay'],
      // M-PESA is included in mobile_money
      callback: async function (response) {
        setProcessing(false);
        setSucceeded(true);
        console.log('Payment complete! Reference: ' + response.reference);
        try {
          const emailHtml = generateOrderEmailHtml(response.reference, amount, cartItems, shippingDetails);
          // Always send to both customer and barrushdelivery@gmail.com
          const recipients = [shippingDetails.email, "barrushdelivery@gmail.com"];
          const {
            error: functionError
          } = await supabase.functions.invoke('send-order-confirmation', {
            body: {
              to: recipients,
              subject: `Order Confirmed! #${response.reference}`,
              html: emailHtml
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
          // Log to Supabase on payment success:
          await logOrderToSupabase({
            buyerName: shippingDetails.firstName + " " + shippingDetails.lastName,
            buyerEmail: shippingDetails.email,
            buyerGender: shippingDetails.gender || undefined,
            buyerPhone: shippingDetails.phone,
            region: shippingDetails.area,
            city: shippingDetails.city,
            street: shippingDetails.street,
            building: shippingDetails.building,
            instructions: shippingDetails.instructions,
            items: cartItems,
            subtotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            deliveryFee: amount - cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            totalAmount: amount,
            orderReference: response.reference,
            orderSource: "paystack"
          });
          // After success, redirect to products page instead of order placed
          setTimeout(() => {
            navigate("/products");
          }, 1200);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          toast({
            title: "Email Sending Failed",
            description: "Your order was processed, but we couldn't send the confirmation email. Please contact support.",
            variant: "destructive"
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
    return <Card ref={cardRef} className="bg-barrush-charcoal/80 border-neon-pink border shadow-lg">
        <CardContent className="p-8 text-center animate-fade-in">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-neon-pink mb-4">Payment Successful!</h3>
          <p className="text-white mb-4">
            Your payment of KES {amount.toLocaleString()} has been processed successfully via Paystack.
          </p>
          <div className="bg-neon-purple/20 p-4 rounded-lg mt-4">
            <h4 className="text-white font-semibold mb-2">Order Summary:</h4>
            <div className="text-left space-y-1 text-sm text-gray-300 max-h-32 overflow-y-auto">
              {cartItems.map((item, index) => <div key={index} className="flex justify-between">
                  <span>{item.name} ({item.size}) x{item.quantity}</span>
                  <span>{item.priceFormatted}</span>
                </div>)}
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-4">
            A confirmation email will be sent to your registered email address.
          </p>
        </CardContent>
      </Card>;
  }
  return <Card ref={cardRef} className="bg-barrush-charcoal/80 border-neon-pink border shadow-lg">
      
      
    </Card>;
};
export default PaystackCheckout;
