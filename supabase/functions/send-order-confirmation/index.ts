
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
  to?: string | string[];
  subject?: string;
  html?: string;
  orderDetails?: {
    reference: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: {
      street: string;
      building: string;
      area: string;
      city: string;
    };
    deliveryZone: {
      name: string;
      fee: number;
    };
    deliveryInstructions: string;
    items: any[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
  };
}

const generateOrderEmailHTML = (orderDetails: any) => {
  // Delivery time estimates based on zone
  const getDeliveryTime = (zoneName: string) => {
    const zone = zoneName.toLowerCase();
    if (zone.includes('nairobi')) return '15-20 minutes';
    if (zone.includes('mtongwe') || zone.includes('diani')) return '10-15 minutes';
    if (zone.includes('kilifi')) return '5-10 minutes';
    return '15-30 minutes'; // default
  };

  const deliveryTime = getDeliveryTime(orderDetails.deliveryZone.name);
  
  const itemsHTML = orderDetails.items.map((item: any) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 8px;">${item.name} ${item.size ? `(${item.size})` : ''}</td>
      <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right;">${item.priceFormatted || `KES ${(item.price * item.quantity).toLocaleString()}`}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <!-- Header with Logo -->
      <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center; position: relative;">
        <div style="margin-bottom: 15px;">
          <img src="https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/lovable-uploads/4c04bd38-2934-4f85-8897-76401cef6d00.png" alt="Barrush Delivery Logo" style="height: 80px; width: auto; margin: 0 auto;" />
        </div>
        <h1 style="color: white; margin: 10px 0 0 0; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Order Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Your order will be delivered in ${deliveryTime}</p>
      </div>

      <!-- Order Reference -->
      <div style="padding: 20px; background-color: #f8fafc; border-left: 4px solid #ec4899;">
        <h2 style="margin: 0; color: #1f2937; font-size: 18px;">Order Reference: <span style="color: #ec4899; font-weight: bold;">#${orderDetails.reference}</span></h2>
        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Estimated delivery: ${deliveryTime}</p>
      </div>

      <!-- Customer Information -->
      <div style="padding: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Customer Information</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
          <p style="margin: 5px 0; color: #4b5563;"><strong>Name:</strong> ${orderDetails.customerName}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Email:</strong> ${orderDetails.customerEmail}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Phone:</strong> ${orderDetails.customerPhone}</p>
        </div>
      </div>

      <!-- Delivery Information -->
      <div style="padding: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Delivery Information</h3>
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 5px 0; color: #4b5563;"><strong>Delivery Zone:</strong> ${orderDetails.deliveryZone.name}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Delivery Fee:</strong> KES ${orderDetails.deliveryZone.fee.toLocaleString()}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Street Address:</strong> ${orderDetails.deliveryAddress.street}</p>
          ${orderDetails.deliveryAddress.building ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Building:</strong> ${orderDetails.deliveryAddress.building}</p>` : ''}
          <p style="margin: 5px 0; color: #4b5563;"><strong>Area:</strong> ${orderDetails.deliveryAddress.area}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>City:</strong> ${orderDetails.deliveryAddress.city}</p>
          ${orderDetails.deliveryInstructions ? `
            <div style="margin-top: 10px; padding: 10px; background-color: #fef3c7; border-radius: 6px; border-left: 3px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;"><strong>Special Delivery Instructions:</strong></p>
              <p style="margin: 5px 0 0 0; color: #92400e; font-style: italic;">${orderDetails.deliveryInstructions}</p>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Order Items -->
      <div style="padding: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151;">Item</th>
              <th style="padding: 12px 8px; text-align: center; font-weight: 600; color: #374151;">Qty</th>
              <th style="padding: 12px 8px; text-align: right; font-weight: 600; color: #374151;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      </div>

      <!-- Order Summary -->
      <div style="padding: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Order Summary</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #4b5563;">Subtotal:</span>
            <span style="color: #4b5563; font-weight: 600;">KES ${orderDetails.subtotal.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #4b5563;">Delivery Fee (${orderDetails.deliveryZone.name}):</span>
            <span style="color: #4b5563; font-weight: 600;">KES ${orderDetails.deliveryFee.toLocaleString()}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #1f2937; font-weight: bold; font-size: 18px;">Total:</span>
            <span style="color: #ec4899; font-weight: bold; font-size: 18px;">KES ${orderDetails.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 20px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; margin: 0 0 10px 0;">Thank you for choosing Barrush Delivery!</p>
        <p style="color: #9ca3af; margin: 0; font-size: 14px;">If you have any questions, please contact us at barrushdelivery@gmail.com</p>
      </div>
    </div>
  `;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== EMAIL FUNCTION CALLED ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY not found in environment variables");
      return new Response(
        JSON.stringify({ ok: false, error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    console.log("✅ RESEND_API_KEY found");

    const requestBody = await req.json();
    console.log("📧 Email request body:", JSON.stringify(requestBody, null, 2));
    
    const { to, subject, html, orderDetails }: EmailRequest = requestBody;

    // If orderDetails are provided, use the enhanced template
    let emailHTML = html;
    if (orderDetails) {
      console.log("📋 Generating email from orderDetails template");
      emailHTML = generateOrderEmailHTML(orderDetails);
    }

    // Ensure all required fields are present
    if (!to || !subject || !emailHTML) {
      console.error("❌ Missing required fields:", { to: !!to, subject: !!subject, html: !!emailHTML });
      return new Response(
        JSON.stringify({ ok: false, error: "Missing required fields: to, subject, and html/orderDetails are required." }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const recipients = Array.isArray(to) ? to : [to];
    console.log("📬 Recipients:", recipients);
    const results = [];

    // Send separate emails to each recipient to ensure delivery
    for (const recipient of recipients) {
      try {
        console.log(`📤 Sending email to: ${recipient}`);
        const response = await resend.emails.send({
          from: "Barrush Delivery <onboarding@resend.dev>",
          to: [recipient],
          bcc: ["barrushdelivery@gmail.com"],
          subject: subject,
          html: emailHTML,
        });
        console.log(`✅ Email sent successfully to ${recipient}:`, response);
        results.push({ recipient, status: 'sent', data: response });
      } catch (emailError: any) {
        console.error(`❌ Failed to send email to ${recipient}:`, emailError);
        results.push({ recipient, status: 'failed', error: emailError.message });
      }
    }

    console.log("📊 Final results:", results);
    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("💥 Fatal error in email function:", err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message, stack: err.stack }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
