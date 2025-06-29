
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";

interface MpesaStkPushProps {
  amount: number;
  phone?: string;
  till: string;
  shippingDetails?: any;
  onPaymentSuccess?: () => void;
}

const MpesaStkPush: React.FC<MpesaStkPushProps> = ({
  amount,
  phone,
  shippingDetails,
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
    setMessage("Sending LIVE M-PESA request...");

    try {
      const formattedPhone = formatPhoneNumber(userPhone);
      const customerName = shippingDetails ? 
        `${shippingDetails.firstName} ${shippingDetails.lastName}` : 
        "Customer";

      console.log(`Initiating LIVE STK push for ${formattedPhone}, amount: ${amount}`);

      const response = await fetch('https://tyfsxboxshbkdetweuke.supabase.co/functions/v1/mpesa-stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: amount,
          name: customerName
        }),
      });

      const data = await response.json();
      console.log('LIVE STK push response:', data);

      if (response.ok && data.ok) {
        setMessage("✅ LIVE Payment request sent! Check your phone.");
        toast({
          title: "LIVE Payment Prompt Sent!",
          description: "Check your phone to complete the M-PESA payment. This is a real transaction.",
          className: "bg-green-600 text-white"
        });
        
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
      console.error('LIVE Payment error:', error);
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
        <CardTitle className="text-neon-pink text-zinc-50">
          🔴 LIVE M-PESA Payment
        </CardTitle>
        <p className="text-sm text-yellow-400 font-semibold">
          ⚠️ This will process real payments using Safaricom M-PESA
        </p>
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
            className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-6 text-lg transition-all duration-300 ${processing && 'opacity-60 cursor-not-allowed'}`}
          >
            {processing ? 'Sending LIVE M-PESA request...' : `🔴 PAY KES ${amount.toLocaleString()} via LIVE M-PESA`}
          </Button>
          {message && <div className="mt-3 text-white text-center">{message}</div>}
          <div className="bg-yellow-900/50 border border-yellow-600 rounded p-3 mt-4">
            <p className="text-sm text-yellow-200 text-center font-semibold">
              🔴 LIVE PAYMENTS ACTIVE
            </p>
            <p className="text-xs text-yellow-300 text-center mt-1">
              You will receive a real M-PESA prompt. Enter your PIN to complete the actual transaction.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MpesaStkPush;
