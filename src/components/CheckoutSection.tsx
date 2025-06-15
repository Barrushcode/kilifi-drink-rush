
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { postToZapierWebhook } from "@/utils/zapierWebhook";
import ShippingInfoForm from './ShippingInfoForm';
import ZapierWebhookInput from './ZapierWebhookInput';
import OrderSummaryCard from './OrderSummaryCard';
import PaymentOptionsPanel from './PaymentOptionsPanel';
import AlternativePaymentInfo from './AlternativePaymentInfo';

const DELIVERY_ZONES = [{
  name: 'Tezo',
  value: 'tezo',
  fee: 250
}, {
  name: 'Mnarani',
  value: 'mnarani',
  fee: 150
}, {
  name: 'Bofa',
  value: 'bofa',
  fee: 200
}];
const TILL_NUMBER = '5950470';

const CheckoutSection: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalAmount,
    getTotalItems
  } = useCart();
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
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0].value); // default: Tezo
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState("");

  // Find the selected zone object
  const zoneObject = DELIVERY_ZONES.find(z => z.value === selectedZone);
  const subtotal = getTotalAmount();
  // Free delivery: If subtotal > 5000, fee = 0
  const deliveryFee = subtotal > 5000 ? 0 : zoneObject ? zoneObject.fee : 0;
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

  const handleZoneChange = (value: string) => {
    setSelectedZone(value);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
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

  // --- Add simulate payment handler ---
  const handleSimulatePayment = async () => {
    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      return;
    }
    if (!shippingDetails.email) {
      setErrors(prev => ({
        ...prev,
        email: "Email is required for email simulation"
      }));
      return;
    }
    try {
      const reference = "SIM" + Math.floor(Math.random() * 1000000);
      const { toast } = await import('@/components/ui/use-toast');
      // Use the Supabase client to call the edge function
      const recipients = [shippingDetails.email, "barrushdelivery@gmail.com"];
      const {
        data,
        error
      } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: recipients, // send to both addresses
          subject: `Your Barrush Order Confirmation (Simulated): #${reference}`,
          html: `
            <p style="font-size: 18px; color: #d946ef;"><strong>This is a simulated confirmation for testing purposes.</strong></p>
            <p>Reference: ${reference}</p>
            <hr />
            <p>Order for <strong>${shippingDetails.firstName} ${shippingDetails.lastName}</strong></p>
            <p>Delivery: ${zoneObject?.name} (KES ${deliveryFee})</p>
            <p>Total simulated: KES ${totalAmount.toLocaleString()}</p>
          `
        }
      });
      if (!error && data && data.ok) {
        toast({
          title: "Simulated order email sent!",
          description: "Check your inbox for the test confirmation.",
          className: "bg-green-600 text-white"
        });
      } else {
        toast({
          title: "Simulation failed!",
          description: error?.message || data?.error || "Unknown error",
          variant: "destructive"
        });
      }
      // ✴️ POST TO ZAPIER WEBHOOK (if URL is present)
      if (zapierWebhookUrl) {
        await postToZapierWebhook(zapierWebhookUrl, {
          simulation: true,
          reference,
          type: "test",
          shippingDetails,
          items,
          subtotal,
          deliveryZone: zoneObject?.name,
          deliveryFee,
          totalAmount
        });
      }
    } catch (err: any) {
      const {
        toast
      } = await import('@/components/ui/use-toast');
      toast({
        title: "Simulation failed!",
        description: err?.message || "Failed to send simulated email.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-barrush-midnight py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-rose-300">Your Cart is Empty</h1>
          <p className="text-white mb-6">Add some products to your cart to continue</p>
          <button onClick={() => window.location.href = '/products'} className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded font-semibold">Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-barrush-midnight py-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neon-pink mb-4 text-zinc-50">
            Checkout
          </h1>
          <p className="text-xl text-white">
            Complete your order securely
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-none">
          {/* Order Summary */}
          <div className="w-full max-w-full">
            <OrderSummaryCard
              items={items}
              getTotalItems={getTotalItems}
              getTotalAmount={getTotalAmount}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              zoneObject={zoneObject}
              deliveryFee={deliveryFee}
              subtotal={subtotal}
              totalAmount={totalAmount}
            />
          </div>
          {/* Right Column - Forms and Payment */}
          <div className="space-y-6 w-full max-w-full">
            <ShippingInfoForm
              shippingDetails={shippingDetails}
              errors={errors}
              deliveryZones={DELIVERY_ZONES}
              selectedZone={selectedZone}
              handleInputChange={handleInputChange}
              handleZoneChange={handleZoneChange}
            />
            <ZapierWebhookInput
              zapierWebhookUrl={zapierWebhookUrl}
              setZapierWebhookUrl={setZapierWebhookUrl}
            />
            <PaymentOptionsPanel
              totalAmount={totalAmount}
              shippingDetails={shippingDetails}
              TILL_NUMBER={TILL_NUMBER}
              handleSimulatePayment={handleSimulatePayment}
              items={items}
            />
            <AlternativePaymentInfo totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
