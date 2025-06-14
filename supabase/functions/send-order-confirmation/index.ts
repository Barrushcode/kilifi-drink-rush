
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend("re_AqrRGDDW_261DsQuAMF8vYP1fP82oj7JA");

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

    const emailTo = to || "barrushdelivery@gmail.com";
    const emailSubject = subject || "Hello World";
    const emailHtml = html || "<p>Congrats on sending your <strong>first email</strong>!</p>";

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [emailTo],
      subject: emailSubject,
      html: emailHtml,
    });

    return new Response(JSON.stringify({ ok: true, data: response }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
