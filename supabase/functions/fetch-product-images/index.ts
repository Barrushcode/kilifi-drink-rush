
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get API keys from secrets
const SPOONACULAR_API_KEY = Deno.env.get("SPOONACULAR_API_KEY");
const LCBO_API_KEY = Deno.env.get("LCBO_API_KEY");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function imageLooksGood(url: string): boolean {
  // Very simple heuristics: no avatars, memes, default img, etc.
  if (!url) return false;
  const badPatterns = [
    "placeholder", "default", "icon", "logo",
    "avatar", "selfie", "drawing", "illustration", "memes", "stock", "svg"
  ];
  return !badPatterns.some((pat) => url.toLowerCase().includes(pat)) && /\.(jpg|jpeg|png|webp)$/i.test(url);
}

function matchProductNames(apiProduct: string, ourProduct: string): boolean {
  // Require all "important" words in our name to be in the API result name
  const tokens = ourProduct.toLowerCase().split(/[\s,-/()]+/).filter(Boolean);
  const haystack = apiProduct.toLowerCase();
  let matches = 0;
  for (const t of tokens) if (haystack.includes(t)) matches++;
  return matches >= Math.max(2, Math.round(tokens.length * 0.6));
}

// Fetch from Spoonacular
async function fetchSpoonacularImage(name: string): Promise<string | null> {
  if (!SPOONACULAR_API_KEY) return null;
  const url = `https://api.spoonacular.com/food/products/search?query=${encodeURIComponent(name)}&apiKey=${SPOONACULAR_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.products || !Array.isArray(data.products)) return null;
  for (const prod of data.products) {
    if (prod.image && imageLooksGood(prod.image) && matchProductNames(prod.title || "", name)) {
      return prod.image;
    }
  }
  return null;
}

// Fetch from LCBO
async function fetchLcboImage(name: string): Promise<string | null> {
  if (!LCBO_API_KEY) return null;
  const url = `https://lcboapi.com/products?q=${encodeURIComponent(name)}`;
  const res = await fetch(url, { headers: { Authorization: `Token ${LCBO_API_KEY}` } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.result || !Array.isArray(data.result)) return null;
  for (const prod of data.result) {
    if (
      prod.image_url &&
      imageLooksGood(prod.image_url) &&
      matchProductNames(prod.name || "", name)
    ) {
      return prod.image_url;
    }
  }
  return null;
}

// Fetch from Open Food Facts
async function fetchOffImage(name: string): Promise<string | null> {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(name)}&search_simple=1&json=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.products || !Array.isArray(data.products)) return null;
  for (const prod of data.products) {
    if (
      prod.image_front_url &&
      imageLooksGood(prod.image_front_url) &&
      matchProductNames(prod.product_name || "", name)
    ) {
      return prod.image_front_url;
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
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return-minimal"
    },
    body: JSON.stringify({ image_url: imageUrl })
  });
  return res.ok;
}

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  
  // Optionally accept { limit } param in POST for manual trigger
  let limit = 20;
  try {
    if (req.method === "POST") {
      const body = await req.json();
      if (typeof body.limit === "number" && body.limit > 0) limit = body.limit;
    }
  } catch { }

  let updated = 0, errors: string[] = [];
  try {
    const allProducts = await fetchAllProducts();
    let processed = 0;
    for (const prod of allProducts) {
      if (processed++ >= limit) break;
      let found: string | null = null;
      found = await fetchSpoonacularImage(prod.name);
      if (!found) found = await fetchLcboImage(prod.name);
      if (!found) found = await fetchOffImage(prod.name);
      const ok = await updateProductImage(prod.id, found);
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
