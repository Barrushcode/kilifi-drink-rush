
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';

interface MpesaStkPushProps {
  amount: number;
  phone?: string;
  till: string;
  shippingDetails?: any;
  cartItems?: any[];
  onPaymentSuccess?: () => void;
}

const MpesaStkPush: React.FC<MpesaStkPushProps> = ({
  amount,
  phone,
  shippingDetails,
  cartItems = [],
  onPaymentSuccess
}) => {
  const [userPhone, setUserPhone] = useState(phone || "");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const isValidPhone = (value: string) => 
    /^(\+254|0)[17]\d{8}$/.test(value);

  const formatPhoneNumber = (phoneInput: string) => {
    let formatted = phoneInput.trim();
    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.slice(1);
    } else if (formatted.startsWith("+")) {
      formatted = formatted.slice(1);
    }
    return formatted;
  };

  const sendOrderEmailToBarrush = async (orderData: any) => {
    try {
      const orderItemsHtml = cartItems.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>KES ${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `).join('');

      const emailHtml = `
        <h2>New Order Received - ${orderData.reference}</h2>
        <h3>Customer Details:</h3>
        <p><strong>Name:</strong> ${shippingDetails.firstName} ${shippingDetails.lastName}</p>
        <p><strong>Phone:</strong> ${shippingDetails.phone}</p>
        <p><strong>Email:</strong> ${shippingDetails.email}</p>
        <p><strong>Address:</strong> ${shippingDetails.street}, ${shippingDetails.area}, ${shippingDetails.city}</p>
        
        <h3>Order Items:</h3>
        <table border="1" style="border-collapse: collapse;">
          <thead>
            <tr><th>Product</th><th>Quantity</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
        </table>
        
        <h3>Payment Details:</h3>
        <p><strong>Total Amount:</strong> KES ${amount.toLocaleString()}</p>
        <p><strong>Payment Method:</strong> M-PESA</p>
        <p><strong>Transaction Reference:</strong> ${orderData.reference}</p>
      `;

      await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: ['barrushdelivery@gmail.com'],
          subject: `New Order: ${orderData.reference}`,
          html: emailHtml
        }
      });
    } catch (error) {
      console.error('Failed to send order email to Barrush:', error);
    }
  };

  const initiateStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isValidPhone(userPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number (07... or +2547...)",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setMessage("Sending M-PESA request...");

    try {
      const formattedPhone = formatPhoneNumber(userPhone);
      console.log(`Initiating STK push for ${formattedPhone}, amount: ${amount}`);

      const response = await fetch('https://tyfsxboxshbkdetweuke.supabase.co/functions/v1/mpesa-stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: amount,
          name: shippingDetails?.firstName ? `${shippingDetails.firstName} ${shippingDetails.lastName}` : "Customer"
        }),
      });

      const data = await response.json();
      console.log('STK push response:', data);

      if (response.ok && data.ok) {
        setMessage("STK Prompt Sent! Please complete payment on your phone.");
        toast({
          title: "STK Prompt Sent!",
          description: "Please check your phone and complete the payment.",
          className: "bg-green-600 text-white"
        });
        
        // Wait for payment confirmation (simulate for now)
        setTimeout(async () => {
          const orderData = {
            reference: `MP${Date.now()}`,
            amount,
            items: cartItems,
            customer: shippingDetails
          };

          // Send email to Barrush
          await sendOrderEmailToBarrush(orderData);

          if (onPaymentSuccess) onPaymentSuccess();
          navigate("/order-placed");
        }, 5000); // Wait 5 seconds to simulate payment processing
        
      } else {
        setMessage("❌ Payment failed. Try again or contact support.");
        toast({
          title: "Payment Error",
          description: data.error || "Failed to send payment request. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage("❌ Payment failed. Try again or contact support.");
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="bg-barrush-charcoal/80 border-neon-pink border shadow-lg">
      <CardHeader>
        <CardTitle className="text-neon-pink text-zinc-50">M-PESA Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={initiateStkPush} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="mpesa-phone" className="text-white text-sm font-semibold">M-PESA Phone Number</label>
            <Input
              id="mpesa-phone"
              type="tel"
              placeholder="e.g. 0712345678"
              value={userPhone}
              onChange={e => setUserPhone(e.target.value)}
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400"
              required
            />
          </div>
          <div className="flex justify-between items-center text-white mb-2">
            <span className="text-lg">Total Amount:</span>
            <span className="text-xl font-bold text-neon-pink">KES {amount.toLocaleString()}</span>
          </div>
          <Button
            type="submit"
            disabled={processing || !userPhone}
            className={`w-full bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold py-6 text-lg transition-all duration-300 ${processing && 'opacity-60 cursor-not-allowed'}`}
          >
            {processing ? 'Sending M-PESA request...' : `Pay KES ${amount.toLocaleString()} via M-PESA`}
          </Button>
          {message && (
            <div className={`mt-3 text-center p-3 rounded ${
              message.includes('❌') 
                ? 'text-red-400 bg-red-900/20' 
                : 'text-green-400 bg-green-900/20'
            }`}>
              {message}
            </div>
          )}
          <p className="text-sm text-white/60 text-center mt-2">
            You will receive an M-PESA prompt on your phone. Enter your PIN to complete payment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default MpesaStkPush;
