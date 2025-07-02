
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate optimized name variants for faster image matching
 */
function* generateNameVariants(productName: string) {
  const base = productName.trim();
  
  // Only check the most likely variants to speed up lookup
  const variants = [
    base,                           // Exact match
    base.toUpperCase(),            // UPPERCASE
    base.replace(/\s+/g, " "),     // Normalized spaces
    base.replace(/\s+/g, "_"),     // Underscore
    base.replace(/\s+/g, "-"),     // Hyphen
  ];

  // Deduplicate and yield
  const set = new Set(variants);
  for (const v of set) yield v;
}

// Cache for image URLs to avoid repeated lookups
const imageCache = new Map<string, string | null>();

/**
 * Gets a public URL for a given product image in Supabase storage (bucket "pictures").
 * Now optimized with caching and fewer variants for faster loading.
 */
export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  // Check cache first
  if (imageCache.has(productName)) {
    return imageCache.get(productName) || null;
  }

  const bucketName = "pictures";
  // Reduced extensions for faster lookup
  const extensions = [".jpg", ".jpeg", ".png", ".webp"];
  
  for (const nameVariant of generateNameVariants(productName)) {
    for (const ext of extensions) {
      const filePath = `${nameVariant}${ext}`;
      
      try {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (data && data.publicUrl) {
          // Quick HEAD request to confirm file exists
          const response = await fetch(data.publicUrl, { 
            method: "HEAD",
            signal: AbortSignal.timeout(2000) // 2 second timeout
          });
          
          if (response.ok) {
            console.log(`[SUPABASE IMAGE FOUND]`, data.publicUrl);
            // Cache the result
            imageCache.set(productName, data.publicUrl);
            return data.publicUrl;
          }
        }
      } catch (err) {
        // Continue to next variant on error
        continue;
      }
    }
  }
  
  console.log(`[SUPABASE IMAGE LOOKUP] No match found for "${productName}"`);
  // Cache the null result to avoid future lookups
  imageCache.set(productName, null);
  return null;
}

// Clear cache periodically to prevent memory issues
setInterval(() => {
  if (imageCache.size > 1000) {
    imageCache.clear();
    console.log('[SUPABASE IMAGE CACHE] Cache cleared');
  }
}, 300000); // Clear every 5 minutes if cache gets too large
