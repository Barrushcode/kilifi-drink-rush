
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from "react-router-dom";
import { Phone, CreditCard } from 'lucide-react';

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
  till,
  shippingDetails,
  onPaymentSuccess
}) => {
  const [userPhone, setUserPhone] = useState(phone || "");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const formatPhoneNumber = (value: string) => {
    // Remove any non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as Kenyan phone number
    if (cleaned.startsWith('254')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      return '+254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '+254' + cleaned;
    }
    return value;
  };

  const isValidPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return /^(254[17]\d{8}|0[17]\d{8}|[17]\d{8})$/.test(cleaned);
  };

  const initiateStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isValidPhone(userPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Kenyan phone number (07xxxxxxxx or 01xxxxxxxx)",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone: formatPhoneNumber(userPhone),
          amount,
          till
        },
      });

      if (error || !data?.ok) {
        const errorMessage = data?.error || error?.message || "Payment failed. Please try again.";
        setMessage(errorMessage);
        toast({
          title: "Payment Error",
          description: errorMessage,
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }

      const successMessage = data.message || "STK Push sent successfully! Complete payment on your phone.";
      setMessage(successMessage);
      toast({
        title: "Payment Prompt Sent!",
        description: "Please check your phone and enter your M-Pesa PIN to complete payment.",
        className: "bg-green-600 text-white"
      });
      
      if (onPaymentSuccess) onPaymentSuccess();
      
      // Redirect after successful payment initiation
      setTimeout(() => {
        navigate("/order-placed");
      }, 2000);

    } catch (err: any) {
      const errorMessage = err?.message || "Payment failed. Please try again later.";
      setMessage(errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="bg-barrush-charcoal/80 border-neon-pink border shadow-lg">
      <CardHeader>
        <CardTitle className="text-neon-pink text-zinc-50 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          M-PESA Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={initiateStkPush} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="mpesa-phone" className="text-white text-sm font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              M-PESA Phone Number
            </label>
            <Input
              id="mpesa-phone"
              type="tel"
              placeholder="e.g. 0712345678 or 0112345678"
              value={userPhone}
              onChange={e => setUserPhone(e.target.value)}
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400"
              required
            />
            <p className="text-xs text-gray-400">
              Enter your Safaricom or Airtel Money number
            </p>
          </div>
          
          <div className="flex justify-between items-center text-white mb-2 p-3 bg-neon-purple/20 rounded-lg">
            <span className="text-lg">Total Amount:</span>
            <span className="text-xl font-bold text-neon-pink">KES {amount.toLocaleString()}</span>
          </div>
          
          <Button
            type="submit"
            disabled={processing || !userPhone || !isValidPhone(userPhone)}
            className={`w-full bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold py-6 text-lg transition-all duration-300 ${processing && 'opacity-60 cursor-not-allowed'}`}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending Payment Request...
              </span>
            ) : (
              `Pay KES ${amount.toLocaleString()} via M-PESA`
            )}
          </Button>
          
          {message && (
            <div className={`mt-3 p-3 rounded-lg text-center ${
              message.includes('success') || message.includes('sent') 
                ? 'bg-green-600/20 text-green-300 border border-green-600' 
                : 'bg-red-600/20 text-red-300 border border-red-600'
            }`}>
              {message}
            </div>
          )}
          
          <div className="text-sm text-white/60 text-center mt-4 space-y-1">
            <p>💡 You will receive an M-Pesa prompt on your phone</p>
            <p>🔒 Enter your M-Pesa PIN to complete the payment</p>
            <p>📱 Payment processed instantly and securely</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MpesaStkPush;
