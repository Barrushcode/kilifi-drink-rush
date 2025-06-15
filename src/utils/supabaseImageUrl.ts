
import { supabase } from "@/integrations/supabase/client";

/**
 * Try multiple variants for a product name to improve storage image matching.
 * Now also includes the exact original (untrimmed) input for cases with extra spaces.
 */
function* generateNameVariants(productName: string) {
  const base = productName.trim();
  const original = productName; // Untrimmed, may have trailing/leading spaces

  // Variants with trimmed name
  const transformed = [
    base,
    base.toUpperCase(),
    base.toLowerCase(),
    base.replace(/\s+/g, ""),
    base.replace(/\s+/g, "-"),
    base.replace(/\s+/g, "_"),
    base.replace(/[^a-zA-Z0-9]/g, ""), // Remove non-alphanumeric
  ];

  // If the original is different from base (thus has extra spaces etc), include it as a variant as well
  if (original !== base) {
    transformed.push(original);
    transformed.push(original.replace(/\s+/g, "-"));
    transformed.push(original.replace(/\s+/g, "_"));
    transformed.push(original.replace(/[^a-zA-Z0-9]/g, ""));
  }

  // Deduplicate
  const set = new Set(transformed);
  for (const v of set) yield v;
}

/**
 * Gets a public URL for a given product image in Supabase storage (bucket "pictures").
 * Tries a wide range of file name/extension variations and logs each step.
 */
export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  const bucketName = "pictures";
  const extensions = [
    ".jpg", ".jpeg", ".png", ".webp",
    ".JPG", ".JPEG", ".PNG", ".WEBP"
  ];
  for (const nameVariant of generateNameVariants(productName)) {
    for (const ext of extensions) {
      const filePath = `${nameVariant}${ext}`;
      // Log what is being checked for debug purposes
      console.log(`[SUPABASE IMAGE LOOKUP] Trying file:`, filePath);
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
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
  console.log(`[SUPABASE IMAGE LOOKUP] No match found for "${productName}" in bucket "${bucketName}".`);
  return null;
}

