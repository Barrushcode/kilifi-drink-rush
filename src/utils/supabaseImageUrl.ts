
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
    return imageCache;
  } catch (error) {
    console.error('[SUPABASE IMAGE CACHE] Error fetching image list:', error);
    return [];
  }
}

export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  const bucketName = "pictures";
  
  // Cache for failed lookups to avoid repeated attempts
  const cacheKey = `image_lookup_${productName}`;
  
  // Clear cache for Jack Daniels products to force refresh
  if (productName.toLowerCase().includes('jack daniel')) {
    sessionStorage.removeItem(cacheKey);
    // Also clear the image cache to force a fresh fetch
    imageCache = null;
  }
  
  if (sessionStorage.getItem(cacheKey) === 'not_found') {
    return null;
  }

  // First try exact match with all supported image extensions
  const exactMatches = [
    `${productName}.jpg`,
    `${productName}.jpeg`,
    `${productName}.jfif`,
    `${productName}.png`,
    `${productName}.webp`,
    `${productName}.bmp`,
    `${productName}.gif`,
    `${productName}.tiff`,
    `${productName}.svg`
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
          console.log(`[SUPABASE IMAGE FOUND - EXACT]`, data.publicUrl);
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
    `${productName} (2).jpeg`,
    `${productName} (1).jfif`,
    `${productName} (2).jfif`,
    `${productName} (1).png`,
    `${productName} (2).png`
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
          console.log(`[SUPABASE IMAGE FOUND - VARIATION]`, data.publicUrl);
          return data.publicUrl;
        }
      } catch (err) {
        continue;
      }
    }
  }

  // If no exact match, find closest matching image name
  const availableImages = await getAvailableImages();
  if (availableImages.length > 0) {
    const productNameLower = productName.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const imageName of availableImages) {
      const imageNameWithoutExt = imageName.replace(/\.(jpg|jpeg|jfif|png|webp|bmp|gif|tiff|svg)$/i, '').toLowerCase();
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

