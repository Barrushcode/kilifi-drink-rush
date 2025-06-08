
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StripeCheckout from './StripeCheckout';

const CheckoutSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    deliveryZone: '',
    notes: ''
  });

  const [showPayment, setShowPayment] = useState(false);

  const deliveryFees = {
    'tezo': 250,
    'mnarani': 150,
    'bofa': 200
  };

  const subtotal = 3500; // Sample cart total
  const deliveryFee = formData.deliveryZone ? deliveryFees[formData.deliveryZone as keyof typeof deliveryFees] : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location || !formData.deliveryZone) {
      alert('Please fill in all required fields');
      return;
    }
    setShowPayment(true);
  };

  if (showPayment) {
    return (
      <section id="checkout" className="py-20 bg-gradient-to-b from-barrush-charcoal to-barrush-burgundy/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6">
              Complete Payment
            </h2>
            <p className="text-xl text-barrush-cream max-w-2xl mx-auto">
              Secure payment processing with Stripe
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <StripeCheckout amount={total} />
            <div className="mt-6 text-center">
              <Button 
                onClick={() => setShowPayment(false)}
                variant="outline"
                className="border-barrush-copper text-barrush-copper hover:bg-barrush-copper hover:text-barrush-charcoal"
              >
                Back to Order Details
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout" className="py-20 bg-gradient-to-b from-barrush-charcoal to-barrush-burgundy/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6">
            Checkout & Payment
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto">
            Complete your order details and pay securely
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
            <CardHeader>
              <CardTitle className="text-barrush-gold">Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-barrush-cream">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-barrush-cream">Phone Number *</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-barrush-cream">Delivery Address *</Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zone" className="text-barrush-cream">Delivery Zone *</Label>
                  <Select 
                    value={formData.deliveryZone} 
                    onValueChange={(value) => setFormData({...formData, deliveryZone: value})}
                  >
                    <SelectTrigger className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream">
                      <SelectValue placeholder="Select your zone" />
                    </SelectTrigger>
                    <SelectContent className="bg-barrush-charcoal border-barrush-gold">
                      <SelectItem value="tezo" className="text-barrush-cream">Tezo (KES 250)</SelectItem>
                      <SelectItem value="mnarani" className="text-barrush-cream">Mnarani (KES 150)</SelectItem>
                      <SelectItem value="bofa" className="text-barrush-cream">Bofa (KES 200)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notes" className="text-barrush-cream">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                    placeholder="Any special instructions..."
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold py-6 text-lg"
                >
                  Proceed to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Order Summary */}
          <Card className="bg-barrush-charcoal/80 border-barrush-burgundy border">
            <CardHeader>
              <CardTitle className="text-barrush-gold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-barrush-cream">
                  <span>Subtotal:</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-barrush-cream">
                  <span>Delivery Fee:</span>
                  <span>KES {deliveryFee}</span>
                </div>
                <hr className="border-barrush-burgundy" />
                <div className="flex justify-between text-xl font-bold text-barrush-gold">
                  <span>Total:</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-barrush-gold/10 border border-barrush-gold rounded-md">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-barrush-cream text-sm">
                    Secure payment processing powered by Stripe
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
