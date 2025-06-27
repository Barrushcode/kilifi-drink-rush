import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { amount, phoneNumber } = await req.json();
    if (!amount || !phoneNumber) {
      return new Response(JSON.stringify({
        error: "Missing amount or phoneNumber"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    // === LIVE SAFARICOM CREDENTIALS ===
    const shortCode = "3534039";
    const passkey = "725a276fe2a83f80e47286da61710e4d0648ee8bb803ed8f9b95dd7ebaec1d99";
    const consumerKey = "3NHM8z92wl4MqS1w1Vyq3WN26SuTBwWW0KdGEQ6e7MGAy4Jc";
    const consumerSecret = "G509mxRD0EfxxfLcWxqjduGVmG8UuRCTHQsmuEiHWncxVFSLxjXECAnvzYqN7Owx";
    // === Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = btoa(shortCode + passkey + timestamp);
    // === Get access token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      console.error("Access token error:", tokenData);
      return new Response(JSON.stringify({
        error: "Failed to get Safaricom access token"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    // === Prepare STK Push Payload
    const stkPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://example.com/callback",
      AccountReference: "Barrush",
      TransactionDesc: "Barrush Order Payment"
    };
    const stkRes = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(stkPayload)
    });
    const stkData = await stkRes.json();
    if (!stkRes.ok || stkData.ResponseCode !== "0") {
      console.error("STK Error:", stkData);
      return new Response(JSON.stringify({
        error: stkData.ResponseDescription || "STK push failed"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    return new Response(JSON.stringify({
      message: stkData.CustomerMessage || "STK Push initiated",
      safaricom: stkData
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(JSON.stringify({
      error: err.message || "Unexpected error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
});
