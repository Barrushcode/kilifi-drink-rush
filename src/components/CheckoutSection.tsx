import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import PaystackCheckout from './PaystackCheckout';

const CheckoutSection: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalAmount, getTotalItems } = useCart();
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    building: '',
    area: '',
    city: '',
    instructions: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const deliveryFee = 300;
  const subtotal = getTotalAmount();
  const totalAmount = subtotal + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!shippingDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingDetails.email.trim()) newErrors.email = 'Email is required';
    if (!shippingDetails.street.trim()) newErrors.street = 'Street address is required';
    if (!shippingDetails.area.trim()) newErrors.area = 'Area is required';
    if (!shippingDetails.city.trim()) newErrors.city = 'City is required';

    if (shippingDetails.email && !/\S+@\S+\.\S+/.test(shippingDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (shippingDetails.phone && !/^(\+254|0)[17]\d{8}$/.test(shippingDetails.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-barrush-midnight py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-barrush-gold mb-4">Your Cart is Empty</h1>
          <p className="text-white mb-6">Add some products to your cart to continue</p>
          <Button 
            onClick={() => window.location.href = '/products'}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barrush-midnight py-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-4 text-zinc-50">
            Checkout
          </h1>
          <p className="text-xl text-white">
            Complete your order securely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-none">
          {/* Order Summary */}
          <div className="w-full max-w-full">
            <Card className="bg-barrush-charcoal/80 border-barrush-gold border w-full">
              <CardHeader>
                <CardTitle className="text-barrush-gold text-zinc-50">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-barrush-burgundy/20 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-gray-300 text-xs">{item.size}</p>
                        <p className="text-barrush-gold font-bold text-sm">{item.priceFormatted}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 border-gray-600"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 border-gray-600"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-barrush-burgundy pt-4 space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Subtotal ({getTotalItems()} items):</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Express Delivery (15 minutes):</span>
                    <span>KES {deliveryFee}</span>
                  </div>
                  <div className="border-t border-barrush-burgundy pt-2">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total:</span>
                      <span className="text-barrush-gold">KES {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-barrush-burgundy">
                  <h4 className="font-semibold text-barrush-gold mb-3 text-zinc-50">Payment Options</h4>
                  <p className="text-sm text-white mb-4">
                    Choose your preferred payment method:
                  </p>
                  <div className="space-y-2 text-white">
                    <p>• M-PESA Till Number: <strong className="text-barrush-gold">5950470</strong></p>
                    <p>• Card Payment via Paystack</p>
                    <p>• Mobile Money & Apple Pay (Paystack)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Forms and Payment */}
          <div className="space-y-6 w-full max-w-full">
            {/* Shipping Information */}
            <Card className="bg-barrush-charcoal/80 border-barrush-gold border w-full">
              <CardHeader>
                <CardTitle className="text-barrush-gold text-zinc-50">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingDetails.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingDetails.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="0712345678 or +254712345678"
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                  />
                  {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                  />
                  {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street" className="text-white">Street Address *</Label>
                  <Input
                    id="street"
                    value={shippingDetails.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    placeholder="Street name and number"
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                  />
                  {errors.street && <p className="text-red-400 text-sm">{errors.street}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building" className="text-white">Building/Apartment</Label>
                    <Input
                      id="building"
                      value={shippingDetails.building}
                      onChange={(e) => handleInputChange('building', e.target.value)}
                      placeholder="Building name/number"
                      className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-white">Area/Estate *</Label>
                    <Input
                      id="area"
                      value={shippingDetails.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="Area or estate name"
                      className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                    />
                    {errors.area && <p className="text-red-400 text-sm">{errors.area}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">City *</Label>
                  <Input
                    id="city"
                    value={shippingDetails.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Nairobi, Mombasa, etc."
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 w-full"
                  />
                  {errors.city && <p className="text-red-400 text-sm">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-white">Special Delivery Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={shippingDetails.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Gate code, directions, or special requests (optional)"
                    className="bg-barrush-burgundy/20 border-barrush-burgundy text-white placeholder:text-gray-400 min-h-[80px] w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Component with Validation */}
            <div className="w-full max-w-full">
              {/* Only PaystackCheckout is used; Stripe removed */}
              <PaystackCheckout 
                amount={totalAmount} 
                onValidationRequired={validateForm}
                shippingDetails={shippingDetails}
                cartItems={items}
              />
            </div>

            {/* Alternative Payment Info */}
            <Card className="bg-barrush-burgundy/20 border-barrush-burgundy border w-full">
              <CardContent className="p-6">
                <h4 className="font-semibold text-barrush-gold mb-3 text-zinc-50">Alternative Payment</h4>
                <p className="text-white mb-4">
                  You can also pay directly via M-PESA:
                </p>
                <div className="bg-barrush-charcoal/50 p-4 rounded-lg">
                  <p className="text-center text-white">
                    <strong className="text-barrush-gold text-xl">Till Number: 5950470</strong>
                  </p>
                  <p className="text-center text-sm text-white/80 mt-2">
                    Send KES {totalAmount.toLocaleString()} and contact us with your transaction ID
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
