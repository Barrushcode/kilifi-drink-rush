
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

    // Your M-Pesa live credentials
    const consumerKey = Deno.env.get("SAFARICOM_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("SAFARICOM_CONSUMER_SECRET");
    const passkey = "725a276fe2a83f80e47286da61710e4d0648ee8bb803ed8f9b95dd7ebaec1d99";
    const shortCode = "3534039"; // Live business short code

    console.log("Environment check:", {
      hasConsumerKey: !!consumerKey,
      hasConsumerSecret: !!consumerSecret,
      shortCode,
      consumerKeyLength: consumerKey?.length,
      consumerSecretLength: consumerSecret?.length
    });

    if (!consumerKey || !consumerSecret) {
      return new Response(
        JSON.stringify({ ok: false, error: "Safaricom API credentials not configured in environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get access token from PRODUCTION API
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    console.log("Requesting access token from production API...");
    
    const tokenRes = await fetch("https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      method: "GET",
      headers: { 
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("Token response status:", tokenRes.status);
    
    let tokenData;
    try {
      const tokenText = await tokenRes.text();
      console.log("Token response text:", tokenText);
      tokenData = JSON.parse(tokenText);
    } catch (parseError) {
      console.error("Failed to parse token response:", parseError);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to parse Safaricom token response", details: `Status: ${tokenRes.status}` }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Token request failed:", tokenData);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to get M-Pesa access token", details: tokenData }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const accessToken = tokenData.access_token;
    console.log("Access token obtained successfully");

    // Prepare STK push payload with live credentials
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
                     (now.getMonth() + 1).toString().padStart(2, '0') +
                     now.getDate().toString().padStart(2, '0') +
                     now.getHours().toString().padStart(2, '0') +
                     now.getMinutes().toString().padStart(2, '0') +
                     now.getSeconds().toString().padStart(2, '0');
    
    const password = btoa(shortCode + passkey + timestamp);
    
    // Format phone number to start with 2547...
    let formattedPhone = phone;
    if (phone.startsWith('+254')) {
      formattedPhone = phone.substring(1);
    } else if (phone.startsWith('0')) {
      formattedPhone = '254' + phone.substring(1);
    } else if (!phone.startsWith('254')) {
      formattedPhone = '254' + phone;
    }
    
    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: Math.round(Number(amount)),
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: "https://barrush.com/mpesa-callback", // Keep your existing callback URL
      AccountReference: "Barrush Order",
      TransactionDesc: "Barrush Alcohol Delivery Payment"
    };

    console.log("STK Push payload:", { ...payload, Password: "[HIDDEN]" });

    // Send STK push request to PRODUCTION API
    const stkResponse = await fetch("https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    console.log("STK response status:", stkResponse.status);
    
    let stkResult;
    try {
      const stkText = await stkResponse.text();
      console.log("STK response text:", stkText);
      stkResult = JSON.parse(stkText);
    } catch (parseError) {
      console.error("Failed to parse STK response:", parseError);
      return new Response(
        JSON.stringify({ ok: false, error: "Failed to parse M-Pesa STK response", details: `Status: ${stkResponse.status}` }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    console.log("STK result:", stkResult);
    
    if (!stkResponse.ok || stkResult.ResponseCode !== "0") {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: stkResult.ResponseDescription || stkResult.errorMessage || "Failed to initiate M-Pesa payment",
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
