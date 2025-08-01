
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SPOONACULAR_API_KEY = Deno.env.get("SPOONACULAR_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utility to check for a "clean, professional, product-only bottle shot".
function isCleanAlcoholProductImage(imgUrl: string): boolean {
  if (!imgUrl || !/.(jpg|jpeg|png|webp)$/i.test(imgUrl)) return false;
  const badWords = [
    "avatar", "profile", "icon", "logo", "placeholder", "stock", "meme", "drawing", "cartoon",
    "illustration", "person", "people", "user", "svg", "selfie", "sample", "qr", "barcode"
  ];
  const lower = imgUrl.toLowerCase();
  return !badWords.some(w => lower.includes(w));
}

// Deep fuzzy match: require all strong tokens (brand, main type, size if present)
function goodProductMatch(apiName: string, ourName: string): boolean {
  const tokens = ourName.toLowerCase().replace(/[^a-z0-9\s]+/gi,"").split(/\s+/);
  let matchCount = 0;
  for(const t of tokens) {
    if (t.length > 2 && /\d/.test(t) === false && apiName.toLowerCase().includes(t)) matchCount++;
    if (/ml|l|lt|litre|liter/.test(t) && apiName.toLowerCase().includes(t)) matchCount++;
  }
  return matchCount >= Math.max(2, Math.round(tokens.length * 0.65));
}

// Return exact Spoonacular product image url, if match
async function fetchSpoonacularImage(name: string): Promise<string | null> {
  if (!SPOONACULAR_API_KEY) {
    console.error("No SPOONACULAR_API_KEY found.");
    return null;
  }
  const url = `https://api.spoonacular.com/food/products/search?query=${encodeURIComponent(name)}&apiKey=${SPOONACULAR_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Spoonacular fetch failed for name:", name);
    return null;
  }
  const data = await res.json();
  if (!data.products || !Array.isArray(data.products)) return null;
  const first = data.products[0];
  if (!first) return null;
  // Strict checking – must match brand, type, (and size if present)
  if (
    !!first.id &&
    !!first.imageType &&
    first.title &&
    goodProductMatch(first.title, name)
  ) {
    const imgUrl = `https://spoonacular.com/productImages/${first.id}-312x231.${first.imageType}`;
    if (isCleanAlcoholProductImage(imgUrl)) {
      return imgUrl;
    }
  }
  return null;
}

// Fetch products from Supabase
async function fetchAllProducts(): Promise<Array<{ id: number, name: string }>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return-minimal"
    }
  });
  if (!res.ok) throw new Error("Supabase fetch failed");
  const data = await res.json();
  return data;
}

// Update image_url for product in Supabase
async function updateProductImage(id: number, imageUrl: string | null) {
  const url = `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`;
  const body = JSON.stringify({ image_url: imageUrl });
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return-minimal"
    },
    body
  });
  return res.ok;
}

// MAIN HANDLER
serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  
  // Accept { limit } param for manual batch
  let limit = 20;
  try {
    if (req.method === "POST") {
      const body = await req.json();
      if (typeof body.limit === "number" && body.limit > 0) limit = body.limit;
    }
  } catch {}

  let updated = 0, errors: string[] = [];
  try {
    const allProducts = await fetchAllProducts();
    let processed = 0;
    for (const prod of allProducts) {
      if (processed++ >= limit) break;
      let found: string | null = null;
      found = await fetchSpoonacularImage(prod.name);
      // Set image_url to null if not found (NO fallback, NO LCBO or OFF)
      const ok = await updateProductImage(prod.id, found || null);
      if (!ok) errors.push(`Failed to update id=${prod.id}`);
      else updated++;
    }
    return new Response(JSON.stringify({ success: true, updated, errors }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message || err.toString(), updated, errors }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
