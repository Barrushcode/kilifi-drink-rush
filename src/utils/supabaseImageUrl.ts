
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
// Calculate similarity score between two strings
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Simple Levenshtein distance calculation
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// Cache for storing available images
let imageCache: string[] | null = null;

// Get all available images from storage
async function getAvailableImages(): Promise<string[]> {
  if (imageCache) return imageCache;
  
  try {
    const { data, error } = await supabase.storage.from("pictures").list();
    if (error) throw error;
    
    imageCache = data?.map(file => file.name) || [];
    console.log(`[SUPABASE IMAGE CACHE] Loaded ${imageCache.length} images from storage`);
    return imageCache;
  } catch (error) {
    console.error('[SUPABASE IMAGE CACHE] Error fetching image list:', error);
    return [];
  }
}

// Force refresh the image cache
export function refreshImageCache(): void {
  imageCache = null;
  // Clear session storage cache for lookups
  const keys = Object.keys(sessionStorage);
  keys.forEach(key => {
    if (key.startsWith('image_lookup_')) {
      sessionStorage.removeItem(key);
    }
  });
  console.log('[SUPABASE IMAGE CACHE] Cache cleared and refreshed');
}

export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  const bucketName = "pictures";
  
  // Cache for failed lookups to avoid repeated attempts
  const cacheKey = `image_lookup_${productName}`;
  if (sessionStorage.getItem(cacheKey) === 'not_found') {
    return null;
  }

  // Get all available images first for more efficient matching
  const availableImages = await getAvailableImages();
  if (availableImages.length === 0) {
    console.log('[SUPABASE IMAGE LOOKUP] No images found in storage bucket');
    return null;
  }

  // Generate name variants for better matching
  const nameVariants = Array.from(generateNameVariants(productName));
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  // Try exact matches first with all variants and extensions
  for (const variant of nameVariants) {
    for (const ext of extensions) {
      const fileName = `${variant}${ext}`;
      if (availableImages.includes(fileName)) {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        if (data?.publicUrl) {
          console.log(`[SUPABASE IMAGE FOUND - EXACT VARIANT] ${productName} -> ${fileName}`, data.publicUrl);
          return data.publicUrl;
        }
      }
    }
  }

  // Try with (1), (2) variations
  for (const variant of nameVariants) {
    for (const ext of extensions) {
      const variations = [`${variant} (1)${ext}`, `${variant} (2)${ext}`, `${variant} (3)${ext}`];
      for (const varFile of variations) {
        if (availableImages.includes(varFile)) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(varFile);
          if (data?.publicUrl) {
            console.log(`[SUPABASE IMAGE FOUND - NUMBERED VARIANT] ${productName} -> ${varFile}`, data.publicUrl);
            return data.publicUrl;
          }
        }
      }
    }
  }

  // If no exact match, find closest matching image name
  if (availableImages.length > 0) {
    const productNameLower = productName.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const imageName of availableImages) {
      const imageNameWithoutExt = imageName.replace(/\.(jpg|jpeg|png|webp)$/i, '').toLowerCase();
      const similarity = calculateSimilarity(productNameLower, imageNameWithoutExt);
      
      // Only consider matches with similarity > 0.6 (60% match)
      if (similarity > 0.6 && similarity > bestScore) {
        bestScore = similarity;
        bestMatch = imageName;
      }
    }

    if (bestMatch) {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(bestMatch);
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
            console.log(`[SUPABASE IMAGE FOUND - CLOSEST MATCH] ${productName} -> ${bestMatch} (${Math.round(bestScore * 100)}% match)`, data.publicUrl);
            return data.publicUrl;
          }
        } catch (err) {
          // Continue if this fails
        }
      }
    }
  }
  
  // Cache failed lookup to avoid repeated attempts
  sessionStorage.setItem(cacheKey, 'not_found');
  console.log(`[SUPABASE IMAGE LOOKUP] No match found for "${productName}" in bucket "${bucketName}".`);
  return null;
}

