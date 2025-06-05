
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CheckoutSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    deliveryZone: '',
    notes: ''
  });

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
    // Handle form submission
    console.log('Order submitted:', formData);
    alert('Order submitted! Please pay via M-PESA to complete your order.');
  };

  return (
    <section id="checkout" className="py-20 bg-gradient-to-b from-barrush-charcoal to-barrush-burgundy/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6">
            Checkout & Payment
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto">
            Complete your order and pay securely via M-PESA
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
                  <Label htmlFor="name" className="text-barrush-cream">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-barrush-cream">Phone Number</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-barrush-cream">Delivery Address</Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zone" className="text-barrush-cream">Delivery Zone</Label>
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
                  Place Order
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Payment Instructions */}
          <div className="space-y-6">
            <Card className="bg-barrush-gold/10 border-barrush-gold border-2">
              <CardHeader>
                <CardTitle className="text-barrush-gold">M-PESA Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl">📱</div>
                  <h3 className="text-2xl font-bold text-barrush-gold">
                    Till Number: 5950470
                  </h3>
                  <p className="text-barrush-cream">
                    Use this till number to complete your payment via M-PESA
                  </p>
                </div>
              </CardContent>
            </Card>
            
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
