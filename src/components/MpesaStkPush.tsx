import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { submitOrderToFormSubmit } from '@/utils/formSubmitService';
import { logOrderToSupabase } from '@/utils/logOrderToSupabase';

interface MpesaStkPushProps {
  amount: number;
  phone?: string;
  till: string;
  shippingDetails?: any;
  onPaymentSuccess?: () => void;
  items?: any[];
  deliveryZone?: any;
}

const MpesaStkPush: React.FC<MpesaStkPushProps> = ({
  amount,
  phone,
  shippingDetails,
  onPaymentSuccess,
  items = [],
  deliveryZone
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

  const sendOrderConfirmationEmail = async (orderReference: string) => {
    try {
      // Create order details HTML
      const itemsHtml = items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px; border-right: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-right: 1px solid #eee;">${item.size || 'Standard'}</td>
          <td style="padding: 10px; border-right: 1px solid #eee;">${item.quantity}</td>
          <td style="padding: 10px;">${item.priceFormatted}</td>
        </tr>
      `).join('');

      const orderDetailsHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #e11d48; margin-bottom: 20px;">New Order Received!</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Order Reference: ${orderReference}</h2>
            <p><strong>Payment Status:</strong> <span style="color: #10b981;">PAID via M-PESA</span></p>
            <p><strong>Total Amount:</strong> KES ${amount.toLocaleString()}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Customer Details:</h3>
            <p><strong>Name:</strong> ${shippingDetails?.firstName} ${shippingDetails?.lastName}</p>
            <p><strong>Phone:</strong> ${shippingDetails?.phone}</p>
            <p><strong>Email:</strong> ${shippingDetails?.email}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Delivery Address:</h3>
            <p><strong>Street:</strong> ${shippingDetails?.street}</p>
            ${shippingDetails?.building ? `<p><strong>Building:</strong> ${shippingDetails.building}</p>` : ''}
            <p><strong>Area:</strong> ${shippingDetails?.area}</p>
            <p><strong>City:</strong> ${shippingDetails?.city}</p>
            ${shippingDetails?.instructions ? `<p><strong>Special Instructions:</strong> ${shippingDetails.instructions}</p>` : ''}
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <thead>
                <tr style="background-color: #f1f1f1;">
                  <th style="padding: 12px; text-align: left; border-right: 1px solid #ddd;">Product</th>
                  <th style="padding: 12px; text-align: left; border-right: 1px solid #ddd;">Size</th>
                  <th style="padding: 12px; text-align: left; border-right: 1px solid #ddd;">Quantity</th>
                  <th style="padding: 12px; text-align: left;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background-color: #e11d48; color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 16px;">Process this order for delivery as soon as possible!</p>
          </div>
        </div>
      `;

      // Send order confirmation to customer
      const { data: customerData, error: customerError } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: [shippingDetails?.email].filter(Boolean),
          subject: `Order Confirmed! - ${orderReference} - KES ${amount.toLocaleString()}`,
          html: orderDetailsHtml
        }
      });

      // Send new order notification to business
      const { data: businessData, error: businessError } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: ["barrushdelivery@gmail.com"],
          subject: `New Order Received - ${orderReference} - KES ${amount.toLocaleString()}`,
          html: orderDetailsHtml
        }
      });

      const data = customerData;
      const error = customerError || businessError;

      if (error) {
        console.error('Failed to send order email:', error);
      } else {
        console.log('Order confirmation email sent successfully');
      }
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
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
      // Submit order details to FormSubmit
      await submitOrderToFormSubmit(shippingDetails, items, amount, deliveryZone);

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
        setMessage("STK Prompt Sent! Please check your phone.");
        toast({
          title: "STK Prompt Sent!",
          description: "Please check your phone.",
          className: "bg-green-600 text-white"
        });
        
        // Generate order reference
        const orderReference = "ORD" + Math.floor(Math.random() * 1000000);
        
        // Log order to Supabase
        try {
          await logOrderToSupabase({
            buyerName: `${shippingDetails?.firstName || ''} ${shippingDetails?.lastName || ''}`.trim(),
            buyerEmail: shippingDetails?.email || '',
            buyerPhone: userPhone,
            region: deliveryZone?.name || 'Not specified',
            city: shippingDetails?.city || '',
            street: shippingDetails?.street || '',
            building: shippingDetails?.building || '',
            instructions: shippingDetails?.instructions || '',
            items,
            subtotal: amount - (deliveryZone?.fee || 0),
            deliveryFee: deliveryZone?.fee || 0,
            totalAmount: amount,
            orderReference,
            orderSource: "mpesa"
          });
        } catch (error) {
          console.error('Failed to log order:', error);
        }
        
        // Send order confirmation email
        await sendOrderConfirmationEmail(orderReference);
        
        if (onPaymentSuccess) onPaymentSuccess();
        
        // After a delay, redirect to order placed
        setTimeout(() => {
          navigate("/order-placed");
        }, 2000);
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
        title: "Payment Error",
        description: "Network error. Please check your connection and try again.",
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
          {message && <div className="mt-3 text-white text-center">{message}</div>}
          <p className="text-sm text-white/60 text-center mt-2">
            You will receive an M-PESA pop-up on your phone after clicking pay. Enter your PIN to complete.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default MpesaStkPush;
