import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Testing Resend configuration...");
    
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY not found in environment variables");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    console.log("API Key found, initializing Resend...");
    const resend = new Resend(apiKey);
    
    console.log("Sending test email...");
    const response = await resend.emails.send({
      from: "Barrush Delivery <orders@send.barrush.co.ke>",
      to: ["barrushdelivery@gmail.com"],
      subject: "Test Email from Barrush Delivery - Domain Verification Test",
      html: `
        <h1>Test Email - Domain Verification</h1>
        <p>This is a test email to verify that the domain send.barrush.co.ke is properly configured.</p>
        <p>From: orders@send.barrush.co.ke</p>
        <p>If you receive this, your domain verification and API key are working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });
    
    console.log("Email sent successfully:", response);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test email sent successfully",
        emailId: response.data?.id,
        response: response
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    
  } catch (error: any) {
    console.error("Test email failed:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString(),
        stack: error.stack 
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});