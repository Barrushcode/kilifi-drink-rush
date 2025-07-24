import { supabase } from "@/integrations/supabase/client";

/**
 * Enhanced Supabase product image URL getter with better error handling and fallbacks
 */

// Cache for storing available images
let imageCache: string[] | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all available images from storage with multiple fallback strategies
async function getAvailableImages(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (imageCache && now < cacheExpiry) {
    return imageCache;
  }
  
  try {
    console.log('[ENHANCED STORAGE] Fetching from pictures bucket...');
    
    // Strategy 1: List with proper parameters
    let { data, error } = await supabase.storage
      .from("pictures")
      .list("", {
        limit: 2000,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      });
    
    if (error || !data) {
      console.log('[ENHANCED STORAGE] Strategy 1 failed, trying strategy 2...');
      
      // Strategy 2: Simple list
      ({ data, error } = await supabase.storage.from("pictures").list());
    }
    
    if (error || !data) {
      console.log('[ENHANCED STORAGE] Strategy 2 failed, trying strategy 3...');
      
      // Strategy 3: List with undefined path
      ({ data, error } = await supabase.storage.from("pictures").list(undefined));
    }
    
    if (error || !data) {
      console.error('[ENHANCED STORAGE] All listing strategies failed:', error);
      return [];
    }
    
    const fileNames = data.map(file => file.name).filter(name => 
      // Only include actual image files
      /\.(jpg|jpeg|png|webp|gif)$/i.test(name)
    );
    
    // Update cache
    imageCache = fileNames;
    cacheExpiry = now + CACHE_DURATION;
    
    console.log(`[ENHANCED STORAGE] Successfully loaded ${fileNames.length} images`);
    if (fileNames.length > 0) {
      console.log('[ENHANCED STORAGE] Sample files:', fileNames.slice(0, 3));
    }
    
    return fileNames;
    
  } catch (error) {
    console.error('[ENHANCED STORAGE] Exception in getAvailableImages:', error);
    return [];
  }
}

// Force refresh the image cache
export function refreshImageCache(): void {
  imageCache = null;
  cacheExpiry = 0;
  console.log('[ENHANCED STORAGE] Cache cleared');
}

// Generate name variants for better matching
function* generateNameVariants(productName: string) {
  const base = productName.trim();
  
  yield base; // Exact match first
  yield base.toUpperCase();
  yield base.toLowerCase();
  yield base.replace(/\s+/g, ""); // Remove spaces
  yield base.replace(/\s+/g, "-"); // Spaces to hyphens  
  yield base.replace(/\s+/g, "_"); // Spaces to underscores
  yield base.replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special chars except spaces
  yield base.replace(/[^a-zA-Z0-9]/g, ""); // Remove all non-alphanumeric
  
  // Try with common variations
  if (base.includes("ML")) {
    yield base.replace("ML", "ml");
    yield base.replace(" ML", "ml");
    yield base.replace("ML", "");
  }
  
  if (base.includes("L")) {
    yield base.replace("L", "l");
  }
}

// Calculate similarity between strings
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Simple Levenshtein distance
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

export async function getSupabaseProductImageUrl(productName: string): Promise<string | null> {
  const bucketName = "pictures";
  
  try {
    console.log(`[ENHANCED LOOKUP] Searching for: "${productName}"`);
    
    // Get all available images
    const availableImages = await getAvailableImages();
    
    if (availableImages.length === 0) {
      console.log('[ENHANCED LOOKUP] No images available in bucket');
      return null;
    }
    
    // Generate name variants
    const nameVariants = Array.from(generateNameVariants(productName));
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    console.log(`[ENHANCED LOOKUP] Trying ${nameVariants.length} name variants`);
    
    // Try exact matches first
    for (const variant of nameVariants) {
      for (const ext of extensions) {
        const fileName = `${variant}${ext}`;
        if (availableImages.includes(fileName)) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          if (data?.publicUrl) {
            console.log(`[ENHANCED LOOKUP] ✅ Exact match found: ${fileName}`);
            return data.publicUrl;
          }
        }
        
        // Try with numbered variations
        for (let i = 1; i <= 3; i++) {
          const numberedFile = `${variant} (${i})${ext}`;
          if (availableImages.includes(numberedFile)) {
            const { data } = supabase.storage.from(bucketName).getPublicUrl(numberedFile);
            if (data?.publicUrl) {
              console.log(`[ENHANCED LOOKUP] ✅ Numbered match found: ${numberedFile}`);
              return data.publicUrl;
            }
          }
        }
      }
    }
    
    // Try similarity matching
    const productNameLower = productName.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    
    for (const imageName of availableImages) {
      const imageNameWithoutExt = imageName.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '').toLowerCase();
      const similarity = calculateSimilarity(productNameLower, imageNameWithoutExt);
      
      // Lower threshold for better matching
      if (similarity > 0.5 && similarity > bestScore) {
        bestScore = similarity;
        bestMatch = imageName;
      }
    }
    
    if (bestMatch && bestScore > 0.5) {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(bestMatch);
      if (data?.publicUrl) {
        console.log(`[ENHANCED LOOKUP] ✅ Similar match found: ${bestMatch} (${Math.round(bestScore * 100)}% match)`);
        return data.publicUrl;
      }
    }
    
    console.log(`[ENHANCED LOOKUP] ❌ No match found for "${productName}"`);
    return null;
    
  } catch (error) {
    console.error(`[ENHANCED LOOKUP] Error searching for "${productName}":`, error);
    return null;
  }
}