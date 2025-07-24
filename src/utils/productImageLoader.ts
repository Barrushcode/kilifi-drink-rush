import { supabase } from "@/integrations/supabase/client";

/**
 * Dedicated product image loader for the 'pictures' bucket
 * This is separate from cocktail image loading logic
 */

// Cache for product images only
let productImageCache: string[] | null = null;
let productCacheExpiry: number = 0;
const PRODUCT_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Category-specific fallback images for products
const getCategoryFallbackImage = (productName: string): string => {
  const name = productName.toLowerCase();
  
  if (name.includes('beer')) {
    return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('whiskey') || name.includes('whisky')) {
    return 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('vodka')) {
    return 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('wine')) {
    return 'https://images.unsplash.com/photo-1506377247717-84a0f8d814f4?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('rum')) {
    return 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=400&h=400&fit=crop&crop=center';
  }
  if (name.includes('gin')) {
    return 'https://images.unsplash.com/photo-1544145762-54623c6b8e91?w=400&h=400&fit=crop&crop=center';
  }
  
  // Default fallback for any product
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center';
};

// Get all available product images from the 'pictures' bucket
async function getProductImages(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (productImageCache && now < productCacheExpiry) {
    return productImageCache;
  }
  
  try {
    console.log('[PRODUCT IMAGES] Fetching from pictures bucket...');
    
    // List files from pictures bucket
    const { data, error } = await supabase.storage
      .from("pictures")
      .list();
    
    if (error) {
      console.error('[PRODUCT IMAGES] Failed to list files:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('[PRODUCT IMAGES] No files found in pictures bucket');
      return [];
    }
    
    // Filter for image files only and ensure they're files (not folders)
    const imageFiles = data
      .filter(file => file.name && /\.(jpg|jpeg|png|jfif|webp|gif)$/i.test(file.name))
      .map(file => file.name);
    
    // Update cache
    productImageCache = imageFiles;
    productCacheExpiry = now + PRODUCT_CACHE_DURATION;
    
    console.log(`[PRODUCT IMAGES] Successfully loaded ${imageFiles.length} product images`);
    if (imageFiles.length > 0) {
      console.log('[PRODUCT IMAGES] Sample files:', imageFiles.slice(0, 5));
    }
    
    return imageFiles;
    
  } catch (error) {
    console.error('[PRODUCT IMAGES] Exception:', error);
    return [];
  }
}

// Generate name variations for product matching
function* generateProductNameVariants(productName: string) {
  const base = productName.trim();
  
  // Basic variations
  yield base;
  yield base.toUpperCase();
  yield base.toLowerCase();
  
  // Remove/replace common patterns
  yield base.replace(/\s+/g, ""); // Remove all spaces
  yield base.replace(/\s+/g, "-"); // Spaces to hyphens
  yield base.replace(/\s+/g, "_"); // Spaces to underscores
  
  // Handle ML/L variations
  if (base.includes("ML")) {
    yield base.replace("ML", "ml");
    yield base.replace(" ML", "ml");
    yield base.replace("ML", "");
    yield base.replace(" ML", "");
  }
  
  if (base.includes("L") && !base.includes("ML")) {
    yield base.replace("L", "l");
    yield base.replace(" L", "l");
    yield base.replace("L", "");
    yield base.replace(" L", "");
  }
  
  // Remove special characters
  yield base.replace(/[^a-zA-Z0-9\s]/g, "");
  yield base.replace(/[^a-zA-Z0-9]/g, "");
  
  // Try with different case combinations
  const words = base.split(/\s+/);
  if (words.length > 1) {
    yield words.map(w => w.toUpperCase()).join(" ");
    yield words.map(w => w.toLowerCase()).join(" ");
    yield words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }
}

// Calculate similarity for fuzzy matching
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

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

/**
 * Get product image URL from the 'pictures' bucket
 * This function is specifically for products from the productprice table
 */
export async function getProductImageUrl(productName: string): Promise<string> {
  try {
    console.log(`[PRODUCT IMAGE] Looking for: "${productName}"`);
    
    // Get all available images from the pictures bucket
    const availableImages = await getProductImages();
    
    if (availableImages.length === 0) {
      console.log('[PRODUCT IMAGE] No images found in pictures bucket');
      return getCategoryFallbackImage(productName);
    }
    
    // Try to find a matching image using name variations
    const baseUrl = 'https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/pictures/';
    
    for (const nameVariant of generateProductNameVariants(productName)) {
      // Check if any available image matches this name variant (case-insensitive)
      const matchingImage = availableImages.find(imageName => {
        const imageBaseName = imageName.replace(/\.(jpg|jpeg|png|jfif|webp|gif)$/i, '');
        return imageBaseName.toLowerCase() === nameVariant.toLowerCase();
      });
      
      if (matchingImage) {
        const imageUrl = baseUrl + encodeURIComponent(matchingImage);
        console.log(`[PRODUCT IMAGE] ✅ Found match: "${matchingImage}" for variant: "${nameVariant}"`);
        return imageUrl;
      }
    }
    
    // Try fuzzy matching as a fallback
    let bestMatch = '';
    let bestSimilarity = 0;
    const threshold = 0.7; // Minimum similarity threshold
    
    for (const imageName of availableImages) {
      const imageBaseName = imageName.replace(/\.(jpg|jpeg|png|jfif|webp|gif)$/i, '');
      const similarity = calculateSimilarity(productName.toLowerCase(), imageBaseName.toLowerCase());
      
      if (similarity > bestSimilarity && similarity >= threshold) {
        bestSimilarity = similarity;
        bestMatch = imageName;
      }
    }
    
    if (bestMatch) {
      const imageUrl = baseUrl + encodeURIComponent(bestMatch);
      console.log(`[PRODUCT IMAGE] ✅ Found fuzzy match: "${bestMatch}" (similarity: ${bestSimilarity.toFixed(2)})`);
      return imageUrl;
    }
    
    // If no match found, return fallback
    console.log(`[PRODUCT IMAGE] ❌ No match found for "${productName}"`);
    return getCategoryFallbackImage(productName);
    
  } catch (error) {
    console.error(`[PRODUCT IMAGE] Error for "${productName}":`, error);
    return getCategoryFallbackImage(productName);
  }
}

// Force refresh the product image cache
export function refreshProductImageCache(): void {
  productImageCache = null;
  productCacheExpiry = 0;
  console.log('[PRODUCT IMAGE] Cache cleared');
}

// Initialize cache refresh on module load
refreshProductImageCache();