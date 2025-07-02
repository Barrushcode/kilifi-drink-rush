
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

  console.log(`[SUPABASE IMAGE LOOKUP] Starting optimized lookup for: ${productName}`);

  // Generate fewer, more targeted filename variations
  const baseVariations = generateTargetedFilenames(productName);
  
  // Try the most likely candidates first (limit to top 5)
  const primaryCandidates = baseVariations.slice(0, 5);
  
  try {
    // Use Promise.allSettled for parallel requests instead of sequential
    const results = await Promise.allSettled(
      primaryCandidates.map(async (filename) => {
        const { data } = await supabase.storage
          .from('pictures')
          .createSignedUrl(filename, 60);
        
        if (data?.signedUrl) {
          // Verify the URL is accessible
          const response = await fetch(data.signedUrl, { method: 'HEAD' });
          if (response.ok) {
            return data.signedUrl;
          }
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

    console.log(`[SUPABASE IMAGE LOOKUP] No match found for "${productName}" in primary candidates.`);
    return null;

  } catch (error) {
    console.error(`[SUPABASE IMAGE ERROR] Failed to lookup image for ${productName}:`, error);
    return null;
  }
};

const generateTargetedFilenames = (productName: string): string[] => {
  const cleanName = productName.trim();
  const variations: string[] = [];

  // Most common patterns based on the logs
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  
  // Direct matches (most likely)
  extensions.forEach(ext => {
    variations.push(`${cleanName}.${ext}`);
    variations.push(`${cleanName}.${ext.toUpperCase()}`);
  });

  // Handle spacing variations
  const noSpaces = cleanName.replace(/\s+/g, '');
  const withHyphens = cleanName.replace(/\s+/g, '-');
  const withUnderscores = cleanName.replace(/\s+/g, '_');

  extensions.forEach(ext => {
    variations.push(`${noSpaces}.${ext}`);
    variations.push(`${withHyphens}.${ext}`);
    variations.push(`${withUnderscores}.${ext}`);
  });

  // Remove duplicates and return limited set
  return [...new Set(variations)];
};

// Clear cache periodically to prevent memory issues
setInterval(() => {
  if (imageUrlCache.size > 1000) {
    imageUrlCache.clear();
    console.log('[SUPABASE IMAGE CACHE] Cache cleared due to size limit');
  }
}, 300000); // Clear every 5 minutes if too large
