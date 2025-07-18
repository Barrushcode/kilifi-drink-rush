
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
  
  // Cache for failed lookups to avoid repeated attempts
  const cacheKey = `image_lookup_${productName}`;
  if (sessionStorage.getItem(cacheKey) === 'not_found') {
    return null;
  }

  // First try exact match with common extensions
  const exactMatches = [
    `${productName}.jpg`,
    `${productName}.jpeg`,
    `${productName}.png`,
    `${productName}.webp`
  ];

  for (const filePath of exactMatches) {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (data && data.publicUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(data.publicUrl, { 
          method: "HEAD",
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`[SUPABASE IMAGE FOUND]`, data.publicUrl);
          return data.publicUrl;
        }
      } catch (err) {
        continue;
      }
    }
  }

  // If exact match fails, try with (1), (2) variations for multiple images
  const variationMatches = [
    `${productName} (1).jpg`,
    `${productName} (2).jpg`,
    `${productName} (1).jpeg`,
    `${productName} (2).jpeg`
  ];

  for (const filePath of variationMatches) {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (data && data.publicUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(data.publicUrl, { 
          method: "HEAD",
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`[SUPABASE IMAGE FOUND]`, data.publicUrl);
          return data.publicUrl;
        }
      } catch (err) {
        continue;
      }
    }
  }
  
  // Cache failed lookup to avoid repeated attempts
  sessionStorage.setItem(cacheKey, 'not_found');
  console.log(`[SUPABASE IMAGE LOOKUP] No match found for "${productName}" in bucket "${bucketName}".`);
  return null;
}

