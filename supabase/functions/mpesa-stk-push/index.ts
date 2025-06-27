
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

    // Validate inputs minimally
    if (!phone || !amount || !till) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required params: phone, amount, till" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Collect env
    const consumerKey = Deno.env.get("SAFARICOM_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("SAFARICOM_CONSUMER_SECRET");
    const passkey = Deno.env.get("SAFARICOM_PASSKEY");
    const shortCode = Deno.env.get("SAFARICOM_BUSINESS_SHORT_CODE") ?? till;

    if (!consumerKey || !consumerSecret || !passkey || !shortCode) {
      return new Response(
        JSON.stringify({ ok: false, error: "Safaricom Daraja API credentials are not set (ask admin)." }),
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
        JSON.stringify({ ok: false, error: "Failed to acquire Safaricom API token" }),
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
      TransactionType: "CustomerBuyGoodsOnline", // For Till, not PayBill
      Amount: Number(amount),
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: "https://example.com/stk-callback", // No actual server yet
      AccountReference: "Barrush",
      TransactionDesc: "Barrush Order"
    };

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
    if (!resp.ok || result.ResponseCode !== "0") {
      return new Response(
        JSON.stringify({ ok: false, error: result.ResponseDescription || "Failed to initiate STK Push", saf_details: result }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: result.CustomerMessage, saf_details: result }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message ?? "Unexpected error in STK push." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
