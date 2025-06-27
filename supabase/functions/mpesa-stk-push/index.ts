
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MpesaStkRequest {
  phone: string;
  amount: number;
  till: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, amount, till }: MpesaStkRequest = await req.json();

    // Validate inputs
    if (!phone || !amount || !till) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required params: phone, amount, till" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Your M-Pesa credentials - Updated with new values
    const consumerKey = Deno.env.get("SAFARICOM_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("SAFARICOM_CONSUMER_SECRET");
    const passkey = "725a276fe2a83f80e47286da61710e4d0648ee8bb803ed8f9b95dd7ebaec1d99";
    const shortCode = "3534039"; // Updated business short code

    if (!consumerKey || !consumerSecret) {
      return new Response(
        JSON.stringify({ ok: false, error: "Safaricom API credentials not configured in environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get access token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` }
    });
    
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to get M-Pesa access token", details: tokenData }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const accessToken = tokenData.access_token;

    // Prepare STK push payload
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const password = btoa(shortCode + passkey + timestamp);
    
    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: Math.round(Number(amount)),
      PartyA: phone.startsWith('+254') ? phone.substring(1) : phone.startsWith('0') ? '254' + phone.substring(1) : phone,
      PartyB: shortCode,
      PhoneNumber: phone.startsWith('+254') ? phone.substring(1) : phone.startsWith('0') ? '254' + phone.substring(1) : phone,
      CallBackURL: "https://barrush.com/mpesa-callback", // Replace with your actual callback URL
      AccountReference: "Barrush Order",
      TransactionDesc: "Barrush Alcohol Delivery Payment"
    };

    // Send STK push request
    const stkResponse = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const stkResult = await stkResponse.json();
    
    if (!stkResponse.ok || stkResult.ResponseCode !== "0") {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: stkResult.ResponseDescription || "Failed to initiate M-Pesa payment",
          details: stkResult 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: stkResult.CustomerMessage || "Payment request sent to your phone",
        checkoutRequestID: stkResult.CheckoutRequestID,
        details: stkResult 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (err: any) {
    console.error("M-Pesa STK Push Error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
