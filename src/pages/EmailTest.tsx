import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function EmailTest() {
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const { toast } = useToast();

  const testEmailFunction = async () => {
    setLoading(true);
    try {
      console.log('Testing email function...');
      const { data, error } = await supabase.functions.invoke('test-email', {
        body: {}
      });

      if (error) {
        console.error('Test email error:', error);
        toast({
          title: "Test Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Test email response:', data);
        toast({
          title: "Test Email Sent!",
          description: data.message || 'Check the function logs for details.',
          variant: "default"
        });
      }
    } catch (err: any) {
      console.error('Test email exception:', err);
      toast({
        title: "Test Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testOrderConfirmation = async () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to test with.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Testing order confirmation...');
      
      const orderDetails = {
        reference: 'TEST-' + Date.now(),
        customerName: 'Test Customer',
        customerEmail: testEmail,
        customerPhone: '+254700000000',
        deliveryAddress: {
          street: '123 Test Street',
          building: 'Test Building',
          area: 'Test Area',
          city: 'Test City'
        },
        deliveryZone: {
          name: 'Test Zone',
          fee: 200
        },
        deliveryInstructions: 'Test delivery instructions',
        items: [{
          name: 'Test Product',
          size: '750ml',
          quantity: 1,
          price: 1500,
          priceFormatted: 'KES 1,500'
        }],
        subtotal: 1500,
        deliveryFee: 200,
        totalAmount: 1700
      };

      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: [testEmail],
          subject: `Test Order Confirmation - ${orderDetails.reference}`,
          orderDetails
        }
      });

      if (error) {
        console.error('Order confirmation error:', error);
        toast({
          title: "Test Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Order confirmation response:', data);
        toast({
          title: "Order Confirmation Sent!",
          description: `Test email sent to ${testEmail}. Check your inbox and function logs.`,
          variant: "default"
        });
      }
    } catch (err: any) {
      console.error('Order confirmation exception:', err);
      toast({
        title: "Test Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Email Testing</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Resend Configuration</CardTitle>
            <CardDescription>
              This will test if the Resend API key is configured correctly and can send emails.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testEmailFunction} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Testing...' : 'Test Basic Email Function'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Order Confirmation</CardTitle>
            <CardDescription>
              This will test the full order confirmation email with all formatting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="Enter your email to receive test"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={testOrderConfirmation} 
              disabled={loading || !testEmail}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Test Order Confirmation'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>1. Click "Test Basic Email Function" to verify Resend configuration</p>
            <p>2. Check the browser console and function logs for detailed output</p>
            <p>3. Enter your email and test the order confirmation</p>
            <p>4. If emails aren't received, check your spam folder</p>
            <p>5. Verify your Resend domain is verified and not paused</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}