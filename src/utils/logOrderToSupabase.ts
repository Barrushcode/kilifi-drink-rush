
import { supabase } from "@/integrations/supabase/client";

/**
 * Log a completed order into Supabase's orders table.
 * @returns {Promise<void>}
 */
export async function logOrderToSupabase({
  buyerName,
  buyerEmail,
  buyerGender,
  buyerPhone,
  region,
  city,
  street,
  building,
  instructions,
  items,
  subtotal,
  deliveryFee,
  totalAmount,
  orderReference,
  orderSource = "web"
}: {
  buyerName: string;
  buyerEmail: string;
  buyerGender?: string;
  buyerPhone?: string;
  region: string;
  city?: string;
  street?: string;
  building?: string;
  instructions?: string;
  items: any;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  orderReference: string;
  orderSource?: string;
}) {
  // Format products string from items array
  const productsString = items.map((item: any) => `${item.quantity} ${item.name}`).join(', ');
  
  const { data, error } = await supabase.from("orders").insert([
    {
      buyer_email: buyerEmail,
      buyer_name: buyerName,
      buyer_gender: buyerGender || null,
      buyer_phone: buyerPhone || null,
      region,
      city: city || null,
      street: street || null,
      building: building || null,
      instructions: instructions || null,
      items: JSON.stringify(items),
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      order_reference: orderReference,
      order_source: orderSource,
      customer_name: buyerName,
      customer_phone: buyerPhone || null,
      products: productsString,
      location: region,
      status: "paid",
      rider_ids: null,
      distributor_id: null
    }
  ]).select();
  
  if (error) {
    console.error("Order logging to Supabase failed:", error.message);
    throw error;
  }

  // Trigger SMS edge function if order was created successfully
  if (data && data[0]) {
    try {
      const { error: smsError } = await supabase.functions.invoke('send-sms', {
        body: {
          order_id: data[0].id
        }
      });
      
      if (smsError) {
        console.error("SMS sending failed:", smsError.message);
      }
    } catch (smsErr) {
      console.error("Error calling SMS function:", smsErr);
    }
  }

  return data?.[0];
}
