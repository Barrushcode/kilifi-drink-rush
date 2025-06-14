
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Use environment variable for Resend API key for security
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to?: string;
  subject?: string;
  html?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    // Handle CORS preflight request
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html }: EmailRequest = await req.json();

    // Ensure all required fields are present
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields: to, subject, and html are required." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const response = await resend.emails.send({
      from: "Barrush Delivery <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });

    return new Response(JSON.stringify({ ok: true, data: response }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("Error sending email:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
