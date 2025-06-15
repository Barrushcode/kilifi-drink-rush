
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets a public URL for a given product image in Supabase storage.
 * Checks for .jpg, .png, .webp extensions in order.
 */
export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  const extensions = [".jpg", ".png", ".webp"];
  for (const ext of extensions) {
    const filePath = `${productName}${ext}`;
    const { data } = supabase.storage.from("productimages").getPublicUrl(filePath);
    if (data && data.publicUrl) {
      // This does not check if file exists, just generates URL. Let's try HEAD request to see if it exists.
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
