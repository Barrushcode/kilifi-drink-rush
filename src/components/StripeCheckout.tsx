
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const stripePromise = loadStripe('pk_test_51RXm68RtTBKg7VuLSapMJGA83G3iJhh0ydqvCfg0sIMzdunfvR1RYE9xWtqerp7Sxnq3FScjERekOFe6rd7wTXr700Wph0rKdj');

const CheckoutForm: React.FC<{ amount: number }> = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount: amount * 100, currency: 'kes' } // Convert to cents
        });

        if (error) throw error;
        
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(`Failed to initialize payment: ${err.message}`);
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const card = elements.getElement(CardElement);

    if (!card) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      }
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed');
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      console.log('Payment succeeded:', result.paymentIntent);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  if (succeeded) {
    return (
      <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-barrush-gold mb-4">Payment Successful!</h3>
          <p className="text-barrush-cream">
            Your payment of KES {amount} has been processed successfully.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
      <CardHeader>
        <CardTitle className="text-barrush-gold">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-barrush-burgundy/20 border border-barrush-burgundy rounded-md">
            <CardElement options={cardStyle} />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
              {error}
            </div>
          )}
          
          <div className="flex justify-between items-center text-barrush-cream mb-4">
            <span className="text-lg">Total Amount:</span>
            <span className="text-xl font-bold text-barrush-gold">KES {amount}</span>
          </div>
          
          <Button
            type="submit"
            disabled={!stripe || processing || !clientSecret}
            className="w-full bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold py-6 text-lg"
          >
            {processing ? 'Processing...' : `Pay KES ${amount}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

interface StripeCheckoutProps {
  amount: number;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
};

export default StripeCheckout;
