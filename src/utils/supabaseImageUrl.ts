
import { supabase } from '@/integrations/supabase/client';

// Cache for image URLs to avoid repeated lookups
const imageUrlCache = new Map<string, string | null>();

// Batch processing for multiple image lookups
const pendingLookups = new Map<string, Promise<string | null>>();

export const getSupabaseProductImageUrl = async (productName: string): Promise<string | null> => {
  // Check cache first
  if (imageUrlCache.has(productName)) {
    return imageUrlCache.get(productName) || null;
  }

  // Check if lookup is already in progress
  if (pendingLookups.has(productName)) {
    return pendingLookups.get(productName) || null;
  }

  // Create the lookup promise
  const lookupPromise = performImageLookup(productName);
  pendingLookups.set(productName, lookupPromise);

  try {
    const result = await lookupPromise;
    imageUrlCache.set(productName, result);
    return result;
  } finally {
    pendingLookups.delete(productName);
  }
};

const performImageLookup = async (productName: string): Promise<string | null> => {
  if (!productName) return null;

  console.log(`[SUPABASE IMAGE LOOKUP] Starting fast lookup for: ${productName}`);

  // Generate targeted filename variations for faster matching
  const variations = generateFastFilenames(productName);
  
  try {
    // Use Promise.allSettled for parallel requests with limited candidates
    const results = await Promise.allSettled(
      variations.map(async (filename) => {
        const { data } = await supabase.storage
          .from('pictures')
          .createSignedUrl(filename, 3600); // 1 hour cache
        
        if (data?.signedUrl) {
          return data.signedUrl;
        }
        return null;
      })
    );

    // Return the first successful result
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        console.log(`[SUPABASE IMAGE FOUND] ${result.value}`);
        return result.value;
      }
    }

    console.log(`[SUPABASE IMAGE LOOKUP] No match found for "${productName}"`);
    return null;

  } catch (error) {
    console.error(`[SUPABASE IMAGE ERROR] Failed to lookup image for ${productName}:`, error);
    return null;
  }
};

const generateFastFilenames = (productName: string): string[] => {
  const cleanName = productName.trim();
  const variations: string[] = [];

  // Most common patterns for fast matching
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  
  // Direct matches (most likely to succeed)
  extensions.forEach(ext => {
    variations.push(`${cleanName}.${ext}`);
  });

  // Common variations
  const noSpaces = cleanName.replace(/\s+/g, '');
  const withHyphens = cleanName.replace(/\s+/g, '-');
  const withUnderscores = cleanName.replace(/\s+/g, '_');
  const lowercase = cleanName.toLowerCase();

  extensions.forEach(ext => {
    variations.push(`${noSpaces}.${ext}`);
    variations.push(`${withHyphens}.${ext}`);
    variations.push(`${withUnderscores}.${ext}`);
    variations.push(`${lowercase}.${ext}`);
  });

  // Return limited set for speed (first 12 most likely matches)
  return [...new Set(variations)].slice(0, 12);
};

// Clear cache periodically to prevent memory issues
setInterval(() => {
  if (imageUrlCache.size > 500) {
    imageUrlCache.clear();
    console.log('[SUPABASE IMAGE CACHE] Cache cleared for memory optimization');
  }
}, 180000); // Clear every 3 minutes if too large
