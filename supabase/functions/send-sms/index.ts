import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const afrikasTalkingApiKey = Deno.env.get('AFRIKAS_TALKING_API_KEY')!;
const afrikasTalkingUsername = 'sandbox'; // Use 'sandbox' for testing or your actual username

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  products: string;
  location: string;
  total_amount: number;
  order_reference: string;
}

interface Contact {
  id: number;
  Name: string;
  'Phone Number_1': string;
  'Phone Number_2'?: string;
  'Job Description'?: string;
}

async function sendSMS(to: string, message: string) {
  const url = 'https://api.sandbox.africastalking.com/version1/messaging';
  
  const params = new URLSearchParams();
  params.append('username', afrikasTalkingUsername);
  params.append('to', to);
  params.append('message', message);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apiKey': afrikasTalkingApiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params
    });

    const result = await response.json();
    console.log('SMS sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

async function getContactById(contactId: number): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('Contacts')
    .select('*')
    .eq('id', contactId)
    .single();

  if (error) {
    console.error('Error fetching contact:', error);
    return null;
  }

  return data;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: 'order_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      console.error('Error fetching order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderData = order as Order;
    const results = [];

    // 1. Send SMS to customer
    if (orderData.customer_phone) {
      const customerMessage = `Hi ${orderData.customer_name}! Your order #${orderData.order_reference} has been confirmed. Items: ${orderData.products}. Total: KES ${orderData.total_amount}. Delivery to: ${orderData.location}. Track your order or reorder at: https://barrush.lovableapp.com`;
      
      try {
        const customerResult = await sendSMS(orderData.customer_phone, customerMessage);
        results.push({ type: 'customer', success: true, result: customerResult });
      } catch (error) {
        results.push({ type: 'customer', success: false, error: error.message });
      }
    }

    // 2. Send SMS to all riders
    const { data: allRiders, error: ridersError } = await supabase
      .from('Contacts')
      .select('*')
      .ilike('Job Description', '%rider%');

    if (!ridersError && allRiders) {
      for (const rider of allRiders) {
        if (rider['Phone Number_1']) {
          const riderMessage = `New delivery assignment! Order #${orderData.order_reference} - Customer: ${orderData.customer_name} (${orderData.customer_phone}). Items: ${orderData.products}. Delivery: ${orderData.location}. Amount: KES ${orderData.total_amount}`;
          
          try {
            const riderResult = await sendSMS(rider['Phone Number_1'], riderMessage);
            results.push({ type: 'rider', name: rider.Name, success: true, result: riderResult });
          } catch (error) {
            results.push({ type: 'rider', name: rider.Name, success: false, error: error.message });
          }
        }
      }
    }

    // 3. Send SMS to all distributors
    const { data: allDistributors, error: distributorsError } = await supabase
      .from('Contacts')
      .select('*')
      .ilike('Job Description', '%distributor%');

    if (!distributorsError && allDistributors) {
      for (const distributor of allDistributors) {
        if (distributor['Phone Number_1']) {
          const distributorMessage = `Stock Alert! New order #${orderData.order_reference} requires: ${orderData.products}. Customer: ${orderData.customer_name}. Location: ${orderData.location}. Please prepare inventory.`;
          
          try {
            const distributorResult = await sendSMS(distributor['Phone Number_1'], distributorMessage);
            results.push({ type: 'distributor', name: distributor.Name, success: true, result: distributorResult });
          } catch (error) {
            results.push({ type: 'distributor', name: distributor.Name, success: false, error: error.message });
          }
        }
      }
    }

    console.log('SMS sending results:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order_id,
        sms_results: results 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-sms function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});