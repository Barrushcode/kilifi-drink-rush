
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { postToZapierWebhook } from "@/utils/zapierWebhook";
import { logOrderToSupabase } from "@/utils/logOrderToSupabase";

export interface ShippingDetails {
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

interface UseCheckoutProps {
  items: any[];
  getTotalAmount: () => number;
  getTotalItems: () => number;
  logOrderToSupabase: typeof logOrderToSupabase;
  postToZapierWebhook: typeof postToZapierWebhook;
}

export function useCheckout(
  DELIVERY_ZONES: DeliveryZone[],
  items: any[],
  getTotalAmount: () => number
) {
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
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
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0].value);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState("");

  const zoneObject = DELIVERY_ZONES.find(z => z.value === selectedZone);
  const subtotal = getTotalAmount();
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

  // --- Simulate payment handler (exposed for PaymentOptionsPanel) ---
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
      const recipients = [shippingDetails.email, "barrushdelivery@gmail.com"];
      const { data, error } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: recipients, // send to both addresses
          subject: `Order Confirmed! (Simulated): #${reference}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h1 style="color: #10b981">Order Confirmed! (Simulated)</h1>
              <p><b>This is only a demo confirmation to show what a real customer email would look like.</b></p>
              <ul>
                <li><b>Name:</b> ${shippingDetails.firstName} ${shippingDetails.lastName}</li>
                <li><b>Reference:</b> ${reference}</li>
                <li><b>Delivery:</b> ${zoneObject?.name} (KES ${deliveryFee})</li>
                <li><b>Total:</b> KES ${totalAmount.toLocaleString()}</li>
              </ul>
            </div>
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
      await logOrderToSupabase({
        buyerName: shippingDetails.firstName + " " + shippingDetails.lastName,
        buyerEmail: shippingDetails.email,
        buyerPhone: shippingDetails.phone,
        region: zoneObject?.name || "",
        city: shippingDetails.city,
        street: shippingDetails.street,
        building: shippingDetails.building,
        instructions: shippingDetails.instructions,
        items,
        subtotal,
        deliveryFee,
        totalAmount,
        orderReference: reference,
        orderSource: "simulated"
      });
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
      const { toast } = await import('@/components/ui/use-toast');
      toast({
        title: "Simulation failed!",
        description: err?.message || "Failed to send simulated email.",
        variant: "destructive"
      });
    }
  };

  return {
    shippingDetails,
    setShippingDetails,
    selectedZone,
    setSelectedZone,
    errors,
    setErrors,
    zapierWebhookUrl,
    setZapierWebhookUrl,
    zoneObject,
    subtotal,
    deliveryFee,
    totalAmount,
    handleInputChange,
    handleZoneChange,
    validateForm,
    handleSimulatePayment
  };
}

