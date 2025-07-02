
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { submitOrderToFormSubmit } from '@/utils/formSubmitService';

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

  const isValidPhone = (value: string) => {
    // More robust phone validation for Kenyan numbers
    const cleanPhone = value.replace(/\s+/g, '').replace(/[-()]/g, '');
    return /^(\+254|254|0)[17]\d{8}$/.test(cleanPhone);
  };

  const formatPhoneNumber = (phoneInput: string) => {
    let formatted = phoneInput.trim().replace(/\s+/g, '').replace(/[-()]/g, '');
    
    // Handle different formats
    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.slice(1);
    } else if (formatted.startsWith("+254")) {
      formatted = formatted.slice(1);
    } else if (!formatted.startsWith("254")) {
      // If it doesn't start with any expected format, assume it's missing country code
      formatted = "254" + formatted;
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

      // Send email to barrushdelivery@gmail.com
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: 'barrushdelivery@gmail.com',
          subject: `New Order Received - ${orderReference} - KES ${amount.toLocaleString()}`,
          html: orderDetailsHtml
        }
      });

      if (error) {
        console.error('Failed to send order email:', error);
        // Don't throw error - email failure shouldn't block the order
      } else {
        console.log('Order confirmation email sent successfully');
      }
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      // Don't throw error - email failure shouldn't block the order
    }
  };

  const initiateStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate phone number
    if (!userPhone || !isValidPhone(userPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number (07xxxxxxxx or +2547xxxxxxxx)",
        variant: "destructive"
      });
      return;
    }

    // Validate amount
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please ensure the amount is valid",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setMessage("Preparing M-PESA request...");

    try {
      const formattedPhone = formatPhoneNumber(userPhone);
      console.log(`🔄 Initiating STK push for ${formattedPhone}, amount: KES ${amount}`);

      // First submit order details to FormSubmit (non-blocking)
      try {
        await submitOrderToFormSubmit(shippingDetails, items, amount, deliveryZone);
        console.log('✅ Order submitted to FormSubmit successfully');
      } catch (formSubmitError) {
        console.error('⚠️ FormSubmit failed, but continuing with payment:', formSubmitError);
        // Continue with payment even if FormSubmit fails
      }

      setMessage("Sending payment request to your phone...");

      // Make the STK push request
      const response = await fetch('https://tyfsxboxshbkdetweuke.supabase.co/functions/v1/mpesa-stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: amount,
          name: shippingDetails?.firstName ? `${shippingDetails.firstName} ${shippingDetails.lastName}` : "Barrush Customer"
        }),
      });

      const data = await response.json();
      console.log('📱 STK push response:', data);

      if (data.ok) {
        setMessage("✅ STK prompt sent! Check your phone and enter your M-PESA PIN.");
        
        toast({
          title: "Payment Request Sent!",
          description: "Please check your phone and enter your M-PESA PIN to complete the payment.",
          className: "bg-green-600 text-white"
        });
        
        // Generate order reference
        const orderReference = "ORD" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
        
        // Send order confirmation email (non-blocking)
        setTimeout(() => {
          sendOrderConfirmationEmail(orderReference);
        }, 1000);
        
        // Call success callback
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
        
        // Redirect after successful STK push
        setTimeout(() => {
          navigate("/order-placed");
        }, 3000);
        
      } else {
        const errorMessage = data.error || "Failed to send payment request";
        console.error('❌ STK push failed:', errorMessage);
        
        setMessage(`❌ Payment request failed: ${errorMessage}`);
        
        toast({
          title: "Payment Request Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 Payment request error:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Network error occurred";
      setMessage(`❌ Payment failed: ${errorMessage}`);
      
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
            <label htmlFor="mpesa-phone" className="text-white text-sm font-semibold">
              M-PESA Phone Number
            </label>
            <Input
              id="mpesa-phone"
              type="tel"
              placeholder="e.g. 0712345678 or +254712345678"
              value={userPhone}
              onChange={e => {
                setUserPhone(e.target.value);
                setMessage(null); // Clear any previous messages
              }}
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400"
              required
              disabled={processing}
            />
            <p className="text-xs text-white/60">
              Enter your Safaricom M-PESA number (07xxxxxxxx or 01xxxxxxxx)
            </p>
          </div>
          
          <div className="flex justify-between items-center text-white mb-2">
            <span className="text-lg">Total Amount:</span>
            <span className="text-xl font-bold text-neon-pink">KES {amount.toLocaleString()}</span>
          </div>
          
          <Button
            type="submit"
            disabled={processing || !userPhone || !isValidPhone(userPhone)}
            className={`w-full bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold py-6 text-lg transition-all duration-300 ${
              processing ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Pay KES ${amount.toLocaleString()} via M-PESA`
            )}
          </Button>
          
          {message && (
            <div className={`mt-3 p-3 rounded-md text-center font-medium ${
              message.includes('✅') || message.includes('sent') 
                ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                : message.includes('❌') || message.includes('failed')
                ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
            }`}>
              {message}
            </div>
          )}
          
          <div className="text-sm text-white/60 text-center mt-4 space-y-1">
            <p>💡 You will receive an M-PESA prompt on your phone</p>
            <p>🔐 Enter your M-PESA PIN to complete the payment</p>
            <p>⏰ The prompt may take a few seconds to appear</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MpesaStkPush;
