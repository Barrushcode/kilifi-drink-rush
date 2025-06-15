
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Read env (filled automatically by Supabase)
// You can set these in project dashboard if needed
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Main handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Get all product titles
  const { data: allProducts, error: productsError } = await supabase
    .from("allthealcoholicproducts")
    .select("Title")
    .order("Title", { ascending: true });
  if (productsError) {
    return new Response(
      `Could not load products: ${productsError.message}`,
      { status: 500, headers: corsHeaders }
    );
  }

  // Get all Refined image names (lower/trim)
  const { data: images, error: imagesError } = await supabase
    .from("refinedproductimages")
    .select('"Product Name"');
  if (imagesError) {
    return new Response(
      `Could not load images: ${imagesError.message}`,
      { status: 500, headers: corsHeaders }
    );
  }
  const imageProductNames = new Set(
    images
      .map((img: any) =>
        (img["Product Name"] ?? "").toString().toLowerCase().trim()
      )
  );

  // Find products with NO image match
  const missing: string[] = [];
  for (const prod of allProducts) {
    const name = (prod.Title ?? "").toLowerCase().trim();
    if (!imageProductNames.has(name)) {
      missing.push(prod.Title);
    }
  }

  // Generate CSV
  const csvRows = [
    "Missing Product Name",
    ...missing.map((title) => `"${title.replace(/"/g, '""')}"`),
  ];
  const csvContent = csvRows.join("\n");

  // Create Response
  return new Response(csvContent, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"products-missing-images.csv\""
    },
  });
});
