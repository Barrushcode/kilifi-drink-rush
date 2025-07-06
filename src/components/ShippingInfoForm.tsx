
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContacts } from "@/hooks/useContacts";

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
  selectedRiders: number[];
  selectedDistributor: number | null;
  handleInputChange: (field: string, value: string) => void;
  handleZoneChange: (value: string) => void;
  handleRidersChange: (riderIds: number[]) => void;
  handleDistributorChange: (distributorId: number | null) => void;
}

const ShippingInfoForm: React.FC<ShippingInfoFormProps> = ({
  shippingDetails,
  errors,
  deliveryZones,
  selectedZone,
  selectedRiders,
  selectedDistributor,
  handleInputChange,
  handleZoneChange,
  handleRidersChange,
  handleDistributorChange
}) => {
  const selectedZoneObj = deliveryZones.find(zone => zone.value === selectedZone);
  const { riders, distributors, loading } = useContacts();

  return (
    <Card className="bg-barrush-charcoal/80 border-neon-pink border w-full">
      <CardHeader>
        <CardTitle className="text-neon-pink text-zinc-50">Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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

          {/* Rider Selection */}
          <div className="space-y-2">
            <Label className="text-white">Assign Riders</Label>
            {loading ? (
              <p className="text-gray-400">Loading riders...</p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {riders.map(rider => (
                  <label key={rider.id} className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={selectedRiders.includes(rider.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleRidersChange([...selectedRiders, rider.id]);
                        } else {
                          handleRidersChange(selectedRiders.filter(id => id !== rider.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span>{rider.Name}</span>
                  </label>
                ))}
                {riders.length === 0 && (
                  <p className="text-gray-400">No riders available</p>
                )}
              </div>
            )}
          </div>

          {/* Distributor Selection */}
          <div className="space-y-2">
            <Label htmlFor="distributor" className="text-white">Assign Distributor</Label>
            {loading ? (
              <p className="text-gray-400">Loading distributors...</p>
            ) : (
              <select 
                name="distributor"
                value={selectedDistributor || ''}
                onChange={(e) => handleDistributorChange(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full bg-neon-purple/40 border-neon-purple text-white rounded-md p-2"
              >
                <option value="" className="text-black">Select a distributor</option>
                {distributors.map(distributor => (
                  <option key={distributor.id} value={distributor.id} className="text-black">
                    {distributor.Name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingInfoForm;
