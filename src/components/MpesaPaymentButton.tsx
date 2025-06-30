
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MpesaPaymentButtonProps {
  phoneNumber?: string;
  amount: number;
  customerName?: string;
}

const MpesaPaymentButton: React.FC<MpesaPaymentButtonProps> = ({
  phoneNumber = "254703320399",
  amount,
  customerName = "OrderPayment"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('https://tyfsxboxshbkdetweuke.supabase.co/functions/v1/mpesa-stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: amount,
          name: customerName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("STK Prompt sent! Check your phone.");
        toast({
          title: "Payment Request Sent",
          description: "STK Prompt sent! Check your phone.",
          className: "bg-green-600 text-white"
        });
      } else {
        setMessage("Payment failed. Please try again.");
        toast({
          title: "Payment Failed",
          description: data.error || "Payment request failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage("Payment failed. Please try again.");
      toast({
        title: "Payment Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg"
      >
        {isLoading ? 'Sending STK Push...' : `Pay KES ${amount.toLocaleString()} via M-PESA`}
      </Button>
      
      {message && (
        <div className="text-center text-white bg-green-600 p-2 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default MpesaPaymentButton;
