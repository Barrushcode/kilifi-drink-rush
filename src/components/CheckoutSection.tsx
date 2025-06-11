import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Minus, ShoppingCart, Truck } from 'lucide-react';
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
  const [cartItems, setCartItems] = useState<CartItem[]>([{
    id: 1,
    name: 'Johnnie Walker Black Label',
    price: 2800,
    quantity: 1,
    category: 'Whiskey'
  }, {
    id: 2,
    name: 'Grey Goose Vodka',
    price: 3200,
    quantity: 1,
    category: 'Vodka'
  }]);
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
    setCartItems(items => items.map(item => item.id === id ? {
      ...item,
      quantity: newQuantity
    } : item));
  };
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    return <section id="checkout" className="py-20 bg-gradient-to-b from-barrush-charcoal to-barrush-burgundy/20">
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
              <Button onClick={() => setShowPayment(false)} variant="outline" className="border-barrush-copper text-barrush-copper hover:bg-barrush-copper hover:text-barrush-charcoal">
                Back to Order Details
              </Button>
            </div>
          </div>
        </div>
      </section>;
  }
  return <section id="checkout" className="py-20 bg-gradient-to-b from-barrush-charcoal to-barrush-burgundy/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6 text-zinc-50">
            Shopping Cart & Checkout
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto text-zinc-50">
            Review your items and complete your order
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Shopping Cart Section */}
          <div className="space-y-6">
            <Card className="bg-barrush-charcoal/80 border-barrush-steel/30">
              <CardHeader>
                <CardTitle className="text-barrush-gold flex items-center gap-2 text-zinc-50">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart ({cartItems.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? <p className="text-barrush-cream text-center py-8">Your cart is empty</p> : cartItems.map(item => <div key={item.id} className="flex items-center justify-between p-4 bg-barrush-burgundy/20 rounded-lg border border-barrush-burgundy/30">
                      <div className="flex-1">
                        <h4 className="font-semibold text-barrush-cream text-zinc-50">{item.name}</h4>
                        <p className="text-sm text-barrush-platinum/70">{item.category}</p>
                        <p className="text-barrush-gold font-bold text-zinc-50">KES {item.price}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 p-0 border-barrush-copper hover:text-barrush-charcoal text-cyan-300 bg-sky-500 hover:bg-sky-400">
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-barrush-cream font-semibold w-8 text-center text-zinc-50">{item.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 p-0 border-barrush-copper hover:text-barrush-charcoal bg-sky-600 hover:bg-sky-500 text-blue-950">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)} className="h-8 w-8 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>)}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-barrush-charcoal/80 border-barrush-steel/30">
              <CardHeader>
                <CardTitle className="text-barrush-gold text-zinc-50">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-barrush-cream">
                  <span className="text-zinc-50">Subtotal:</span>
                  <span className="text-zinc-50">KES {subtotal}</span>
                </div>
                <div className="flex justify-between text-barrush-cream">
                  <span className="text-zinc-50">Delivery Fee:</span>
                  <span className="text-zinc-50">KES {deliveryFee}</span>
                </div>
                <div className="border-t border-barrush-steel/30 pt-4">
                  <div className="flex justify-between text-xl font-bold text-barrush-gold">
                    <span className="text-zinc-50">Total:</span>
                    <span className="text-zinc-50">KES {total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Details Section */}
          <div>
            <Card className="bg-barrush-charcoal/80 border-barrush-steel/30">
              <CardHeader>
                <CardTitle className="text-barrush-gold flex items-center gap-2 text-zinc-50">
                  <Truck className="h-5 w-5" />
                  Shipping Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-barrush-cream">Full Name *</Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({
                      ...formData,
                      name: e.target.value
                    })} className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-barrush-cream">Phone Number *</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({
                      ...formData,
                      phone: e.target.value
                    })} className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-barrush-cream">Address *</Label>
                    <Input id="location" value={formData.location} onChange={e => setFormData({
                    ...formData,
                    location: e.target.value
                  })} className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream" placeholder="Enter your full address" required />
                  </div>

                  <div>
                    <Label htmlFor="deliveryZone" className="text-barrush-cream bg-slate-900">Delivery Zone *</Label>
                    <Select onValueChange={value => setFormData({
                    ...formData,
                    deliveryZone: value
                  })}>
                      <SelectTrigger className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream">
                        <SelectValue placeholder="Select delivery zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tezo">Tezo - KES 200</SelectItem>
                        <SelectItem value="mnarani">Mnarani - KES 200</SelectItem>
                        <SelectItem value="bofa">Bofa - KES 200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="locationDetails" className="text-barrush-cream">Location Details</Label>
                    <Textarea id="locationDetails" value={formData.locationDetails} onChange={e => setFormData({
                    ...formData,
                    locationDetails: e.target.value
                  })} className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream" placeholder="Landmark, building name, apartment number, etc." />
                  </div>

                  <div>
                    <Label htmlFor="deliveryInstructions" className="text-barrush-cream">Delivery Instructions</Label>
                    <Textarea id="deliveryInstructions" value={formData.deliveryInstructions} onChange={e => setFormData({
                    ...formData,
                    deliveryInstructions: e.target.value
                  })} className="bg-barrush-burgundy/20 border-barrush-burgundy text-barrush-cream" placeholder="Special instructions for delivery..." />
                  </div>

                  <Button type="submit" disabled={cartItems.length === 0} className="w-full bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold py-6 text-lg text-zinc-50">
                    Proceed to Payment - KES {total}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default CheckoutSection;