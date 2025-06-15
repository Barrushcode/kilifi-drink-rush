
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
  const { error } = await supabase.from("orders").insert([
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
      order_source: orderSource
    }
  ]);
  if (error) {
    // Not blocking the user, but you might want to alert in admin dash if repeated failures.
    console.error("Order logging to Supabase failed:", error.message);
  }
}
