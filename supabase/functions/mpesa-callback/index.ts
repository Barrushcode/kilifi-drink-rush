
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const callbackData = await req.json();
    console.log("Received M-PESA callback:", JSON.stringify(callbackData, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract payment details from callback
    const stkCallback = callbackData.Body?.stkCallback;
    if (!stkCallback) {
      console.log("No stkCallback found in request");
      return new Response("OK", { status: 200 });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;
    
    // Prepare payment record
    const paymentRecord = {
      merchant_request_id: MerchantRequestID,
      checkout_request_id: CheckoutRequestID,
      result_code: ResultCode,
      result_desc: ResultDesc,
      callback_data: callbackData,
      created_at: new Date().toISOString()
    };

    // If payment was successful, extract additional details
    if (ResultCode === 0 && stkCallback.CallbackMetadata?.Item) {
      const items = stkCallback.CallbackMetadata.Item;
      
      for (const item of items) {
        switch (item.Name) {
          case 'Amount':
            paymentRecord.amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            paymentRecord.mpesa_receipt_number = item.Value;
            break;
          case 'TransactionDate':
            paymentRecord.transaction_date = item.Value;
            break;
          case 'PhoneNumber':
            paymentRecord.phone_number = item.Value;
            break;
        }
      }
      
      console.log("Payment successful:", paymentRecord);
    } else {
      console.log("Payment failed or cancelled:", ResultDesc);
    }

    // Store the payment record in database
    const { error } = await supabase
      .from('mpesa_payments')
      .insert(paymentRecord);

    if (error) {
      console.error("Error storing payment record:", error);
    } else {
      console.log("Payment record stored successfully");
    }

    // Always return 200 OK to Safaricom
    return new Response("OK", { 
      status: 200,
      headers: { "Content-Type": "text/plain", ...corsHeaders }
    });

  } catch (err: any) {
    console.error("Callback processing error:", err);
    // Still return 200 OK to avoid Safaricom retries
    return new Response("OK", { 
      status: 200,
      headers: { "Content-Type": "text/plain", ...corsHeaders }
    });
  }
});
