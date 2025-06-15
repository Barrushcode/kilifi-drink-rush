
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets a public URL for a given product image in Supabase storage.
 * Checks a wide range of image extensions (all common cases).
 */
export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  // Support more variations (case insensitive)
  const extensions = [
    ".jpg", ".jpeg", ".png", ".webp",
    ".JPG", ".JPEG", ".PNG", ".WEBP"
  ];
  for (const ext of extensions) {
    const filePath = `${productName}${ext}`;
    const { data } = supabase.storage.from("productimages").getPublicUrl(filePath);
    if (data && data.publicUrl) {
      try {
        const response = await fetch(data.publicUrl, { method: "HEAD" });
        if (response.ok) {
          return data.publicUrl;
        }
      } catch { /* silent fail */ }
    }
  }
  return null;
}

