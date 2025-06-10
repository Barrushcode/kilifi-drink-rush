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
      
    </section>;
};
export default CheckoutSection;