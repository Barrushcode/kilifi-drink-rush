
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const isValidPhone = (value: string) => 
    /^(\+254|0)[17]\d{8}$/.test(value);

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
    try {
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone: userPhone,
          amount,
          till
        },
      });

      if (error || !data?.ok) {
        setMessage(data?.error || error?.message || "Payment failed. Try again.");
        toast({
          title: "Payment Error",
          description: data?.error || error?.message || "Failed to initiate payment.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }

      setMessage(data.message || "STK Push sent. Complete on your phone.");
      toast({
        title: "Payment Prompt Sent!",
        description: data.message || "Approve payment on your mobile device.",
        className: "bg-green-600 text-white"
      });
      setProcessing(false);
      if (onPaymentSuccess) onPaymentSuccess();

    } catch (err: any) {
      setMessage("Payment failed. Try again later.");
      toast({
        title: "Payment Error",
        description: err?.message || "Failed to initiate payment.",
        variant: "destructive"
      });
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
            {processing ? 'Sending STK Prompt...' : `Pay KES ${amount.toLocaleString()} via M-PESA`}
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
