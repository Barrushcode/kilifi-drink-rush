
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MpesaStkRequest {
  phone: string;
  amount: number;
  name?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, amount, name }: MpesaStkRequest = await req.json();

    // Validate inputs
    if (!phone || !amount) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required params: phone, amount" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get live credentials from environment
    const consumerKey = Deno.env.get("SAFARICOM_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("SAFARICOM_CONSUMER_SECRET");
    const passkey = Deno.env.get("SAFARICOM_PASSKEY") || "725a276fe2a83f80e47286da61710e4d0648ee8bb803ed8f9b95dd7ebaec1d99";
    const shortCode = "3534039"; // Your live shortcode

    if (!consumerKey || !consumerSecret) {
      console.error("Missing Safaricom credentials");
      return new Response(
        JSON.stringify({ ok: false, error: "Safaricom credentials not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing STK push for phone: ${phone}, amount: ${amount}`);

    // Get access token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` }
    });
    
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Failed to get access token:", tokenData);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to acquire Safaricom API token" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const accessToken = tokenData.access_token;
    console.log("Access token acquired successfully");

    // Prepare STK push payload
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const password = btoa(shortCode + passkey + timestamp);
    
    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: "https://tyfsxboxshbkdetweuke.supabase.co/functions/v1/mpesa-callback",
      AccountReference: name || "Barrush Order",
      TransactionDesc: "Barrush Purchase"
    };

    console.log("Sending STK push request...");

    // Send STK push request
    const resp = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });
    
    const result = await resp.json();
    console.log("STK push response:", result);
    
    if (!resp.ok || result.ResponseCode !== "0") {
      console.error("STK push failed:", result);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: result.ResponseDescription || "Failed to initiate STK Push",
          details: result 
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("STK push sent successfully");
    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: result.CustomerMessage || "Payment request sent to your phone",
        checkoutRequestId: result.CheckoutRequestID
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err: any) {
    console.error("STK push error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err?.message ?? "Unexpected error in STK push." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
