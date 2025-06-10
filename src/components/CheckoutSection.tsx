
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Minus } from 'lucide-react';
import StripeCheckout from './StripeCheckout';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const CheckoutSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    deliveryZone: '',
    deliveryInstructions: '',
    locationDetails: ''
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Johnnie Walker Black Label', price: 2800, quantity: 1, category: 'Whiskey' },
    { id: 2, name: 'Grey Goose Vodka', price: 3200, quantity: 1, category: 'Vodka' },
  ]);

  const [showPayment, setShowPayment] = useState(false);

  const deliveryFees = {
    'tezo': 200,
    'mnarani': 200,
    'bofa': 200
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = formData.deliveryZone ? deliveryFees[formData.deliveryZone as keyof typeof deliveryFees] : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location || !formData.deliveryZone) {
      alert('Please fill in all required fields');
      return;
    }
    if (cartItems.length === 0) {
      alert('Please add items to your cart');
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
            Shopping Cart & Checkout
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto">
            Review your items, add delivery details, and complete your order
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Shopping Cart */}
          <Card className="bg-barrush-charcoal/80 border-barrush-gold border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-barrush-gold">Shopping Cart ({cartItems.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-barrush-cream/60">Your cart is empty</p>
                  <Button asChild className="mt-4 bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal">
                    <a href="/products">Browse Products</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-barrush-burgundy/20 border border-barrush-burgundy rounded-md">
                      <div className="flex-1">
                        <h4 className="font-semibold text-barrush-cream">{item.name}</h4>
                        <p className="text-sm text-barrush-cream/60">{item.category}</p>
                        <p className="font-bold text-barrush-gold">KES {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 border-barrush-copper text-barrush-copper hover:bg-barrush-copper hover:text-barrush-charcoal"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-barrush-cream font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 border-barrush-copper text-barrush-copper hover:bg-barrush-copper hover:text-barrush-charcoal"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 border-red-500 text-red-500 hover:bg-red-500 hover:text-white ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-barrush-charcoal/80 border-barrush-burgundy border h-fit">
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

        {/* Delivery Details Form */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-barrush-charcoal/80 border-barrush-gold border">
            <CardHeader>
              <CardTitle className="text-barrush-gold">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-barrush-cream">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                      placeholder="Enter your full name"
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
                      placeholder="e.g., +254712345678"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location" className="text-barrush-cream">Delivery Address *</Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                    placeholder="Enter your delivery address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="zone" className="text-barrush-cream">Delivery Zone *</Label>
                  <Select 
                    value={formData.deliveryZone} 
                    onValueChange={(value) => setFormData({...formData, deliveryZone: value})}
                  >
                    <SelectTrigger className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream">
                      <SelectValue placeholder="Select your delivery zone" />
                    </SelectTrigger>
                    <SelectContent className="bg-barrush-charcoal border-barrush-gold">
                      <SelectItem value="tezo" className="text-barrush-cream">Tezo (KES 200)</SelectItem>
                      <SelectItem value="mnarani" className="text-barrush-cream">Mnarani (KES 200)</SelectItem>
                      <SelectItem value="bofa" className="text-barrush-cream">Bofa (KES 200)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="locationDetails" className="text-barrush-cream">Location Details</Label>
                  <Textarea
                    id="locationDetails"
                    value={formData.locationDetails}
                    onChange={(e) => setFormData({...formData, locationDetails: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                    placeholder="Provide specific location details (e.g., apartment number, landmark, building name)"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="deliveryInstructions" className="text-barrush-cream">Delivery Instructions</Label>
                  <Textarea
                    id="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={(e) => setFormData({...formData, deliveryInstructions: e.target.value})}
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream"
                    placeholder="Any special delivery instructions (e.g., call upon arrival, gate code, best time to deliver)"
                    rows={3}
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="w-full bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Payment (KES {total.toLocaleString()})
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSection;
