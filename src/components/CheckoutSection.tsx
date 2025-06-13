
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PaystackCheckout from './PaystackCheckout';

const CheckoutSection: React.FC = () => {
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
  const totalAmount = 2500; // Example amount in KES

  const handleInputChange = (field: string, value: string) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
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

    // Email validation
    if (shippingDetails.email && !/\S+@\S+\.\S+/.test(shippingDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Kenya format)
    if (shippingDetails.phone && !/^(\+254|0)[17]\d{8}$/.test(shippingDetails.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen bg-barrush-midnight py-12 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-4 text-zinc-50">
            Checkout
          </h1>
          <p className="text-xl text-white">
            Complete your order securely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Order Summary */}
          <Card className="bg-barrush-charcoal/80 border-barrush-gold border w-full">
            <CardHeader>
              <CardTitle className="text-barrush-gold text-zinc-50">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-white">
                <span>Subtotal:</span>
                <span>KES 2,200</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Express Delivery (15 minutes):</span>
                <span>KES 300</span>
              </div>
              <div className="border-t border-barrush-burgundy pt-4">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total:</span>
                  <span className="text-barrush-gold">KES {totalAmount}</span>
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

          {/* Right Column - Forms and Payment */}
          <div className="space-y-6 w-full">
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
            <div className="w-full">
              <PaystackCheckout 
                amount={totalAmount} 
                onValidationRequired={validateForm}
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
                    Send KES {totalAmount} and contact us with your transaction ID
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
