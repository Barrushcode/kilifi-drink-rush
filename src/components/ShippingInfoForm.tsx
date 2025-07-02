
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ShippingDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  building: string;
  area: string;
  city: string;
  instructions: string;
}

interface DeliveryZone {
  name: string;
  value: string;
  fee: number;
}

type Errors = { [key: string]: string };

interface ShippingInfoFormProps {
  shippingDetails: ShippingDetails;
  errors: Errors;
  deliveryZones: DeliveryZone[];
  selectedZone: string;
  handleInputChange: (field: string, value: string) => void;
  handleZoneChange: (value: string) => void;
}

const ShippingInfoForm: React.FC<ShippingInfoFormProps> = ({
  shippingDetails,
  errors,
  deliveryZones,
  selectedZone,
  handleInputChange,
  handleZoneChange
}) => {
  const selectedZoneObj = deliveryZones.find(zone => zone.value === selectedZone);

  return (
    <Card className="bg-barrush-charcoal/80 border-neon-pink border w-full">
      <CardHeader>
        <CardTitle className="text-neon-pink text-zinc-50">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form action="https://formsubmit.co/barrushdelivery@gmail.com" method="POST" className="space-y-4">
          {/* FormSubmit configuration */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="https://lovable.page/thank-you" />
          <input type="hidden" name="_subject" value="New Checkout Form Submission - Barrush Delivery" />
          <input type="hidden" name="_template" value="table" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">First Name *</Label>
              <Input 
                id="firstName" 
                name="firstName"
                value={shippingDetails.firstName} 
                onChange={e => handleInputChange('firstName', e.target.value)} 
                placeholder="Enter first name" 
                className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
                required
              />
              {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Last Name *</Label>
              <Input 
                id="lastName" 
                name="lastName"
                value={shippingDetails.lastName} 
                onChange={e => handleInputChange('lastName', e.target.value)} 
                placeholder="Enter last name" 
                className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
                required
              />
              {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Phone Number *</Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel" 
              value={shippingDetails.phone} 
              onChange={e => handleInputChange('phone', e.target.value)} 
              placeholder="0712345678 or +254712345678" 
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
              required
            />
            {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address *</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              value={shippingDetails.email} 
              onChange={e => handleInputChange('email', e.target.value)} 
              placeholder="your@email.com" 
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
              required
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="street" className="text-white">Street Address *</Label>
            <Input 
              id="street" 
              name="street"
              value={shippingDetails.street} 
              onChange={e => handleInputChange('street', e.target.value)} 
              placeholder="Street name and number" 
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
              required
            />
            {errors.street && <p className="text-red-400 text-sm">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building" className="text-white">Building/Apartment</Label>
              <Input 
                id="building" 
                name="building"
                value={shippingDetails.building} 
                onChange={e => handleInputChange('building', e.target.value)} 
                placeholder="Building name/number" 
                className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area" className="text-white">Area/Estate *</Label>
              <Input 
                id="area" 
                name="area"
                value={shippingDetails.area} 
                onChange={e => handleInputChange('area', e.target.value)} 
                placeholder="Area or estate name" 
                className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
                required
              />
              {errors.area && <p className="text-red-400 text-sm">{errors.area}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-white">City *</Label>
            <Input 
              id="city" 
              name="city"
              value={shippingDetails.city} 
              onChange={e => handleInputChange('city', e.target.value)} 
              placeholder="Nairobi, Mombasa, etc." 
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 w-full" 
              required
            />
            {errors.city && <p className="text-red-400 text-sm">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryZone" className="text-white">Delivery Location *</Label>
            <select 
              name="deliveryZone"
              value={selectedZone}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="w-full bg-neon-purple/40 border-neon-purple text-white rounded-md p-2"
              required
            >
              {deliveryZones.map(zone => (
                <option key={zone.value} value={zone.value} className="text-black">
                  {zone.name} (KES {zone.fee})
                </option>
              ))}
            </select>
            {/* Hidden inputs to capture delivery zone details */}
            <input type="hidden" name="deliveryZoneName" value={selectedZoneObj?.name || ''} />
            <input type="hidden" name="deliveryZoneFee" value={selectedZoneObj?.fee || 0} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-white">Special Delivery Instructions</Label>
            <Textarea 
              id="instructions" 
              name="instructions"
              value={shippingDetails.instructions} 
              onChange={e => handleInputChange('instructions', e.target.value)} 
              placeholder="Gate code, directions, or special requests (optional)" 
              className="bg-neon-purple/40 border-neon-purple text-white placeholder:text-gray-400 min-h-[80px] w-full" 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold py-3 text-lg"
          >
            Submit Order Details
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShippingInfoForm;
