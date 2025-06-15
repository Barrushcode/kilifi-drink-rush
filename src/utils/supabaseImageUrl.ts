
import { supabase } from "@/integrations/supabase/client";

/**
 * Try multiple variants for a product name to improve storage image matching.
 */
function* generateNameVariants(productName: string) {
  const base = productName.trim();
  const transformed = [
    base,
    base.toUpperCase(),
    base.toLowerCase(),
    base.replace(/\s+/g, ""),
    base.replace(/\s+/g, "-"),
    base.replace(/\s+/g, "_"),
    base.replace(/[^a-zA-Z0-9]/g, ""), // Remove non-alphanumeric
  ];
  // Deduplicate
  const set = new Set(transformed);
  for (const v of set) yield v;
}

/**
 * Gets a public URL for a given product image in Supabase storage (bucket "productimage").
 * Tries a wide range of file name/extension variations and logs each step.
 */
export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  const extensions = [
    ".jpg", ".jpeg", ".png", ".webp",
    ".JPG", ".JPEG", ".PNG", ".WEBP"
  ];
  for (const nameVariant of generateNameVariants(productName)) {
    for (const ext of extensions) {
      const filePath = `${nameVariant}${ext}`;
      // Log what is being checked for debug purposes
      console.log(`[SUPABASE IMAGE LOOKUP] Trying file:`, filePath);
      const { data } = supabase.storage.from("productimage").getPublicUrl(filePath);
      if (data && data.publicUrl) {
        try {
          // HEAD request to confirm file actually exists at public URL
          const response = await fetch(data.publicUrl, { method: "HEAD" });
          if (response.ok) {
            console.log(`[SUPABASE IMAGE FOUND]`, data.publicUrl);
            return data.publicUrl;
          }
        } catch (err) {
          // Log error for debugging
          console.warn(`[SUPABASE IMAGE ERROR] Error fetching HEAD for:`, data.publicUrl, err);
        }
      }
    }
  }
  console.log(`[SUPABASE IMAGE LOOKUP] No match found for "${productName}" in bucket "productimage".`);
  return null;
}
