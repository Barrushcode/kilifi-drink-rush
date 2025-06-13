
import { normalizeString, extractBrand, extractVolume, calculateSimilarity } from '@/utils/stringUtils';
import { getCategoryFromName } from '@/utils/categoryUtils';

interface ScrapedImage {
  id: number;
  'Product Name': string | null;
  'Image URL 1': string;
  'Image URL 2': string | null;
  'Image URL 3': string | null;
  'Image URL 4': string | null;
  'Image URL 5': string | null;
}

// Improved image matching function with multiple strategies
export const findMatchingImage = (productName: string, scrapedImages: ScrapedImage[]): { url: string; matchLevel: string } => {
  if (!scrapedImages.length) {
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      matchLevel: "fallback"
    };
  }

  console.log(`🔍 Finding match for product: "${productName}"`);
  
  // Level 1: Exact match (case-insensitive)
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      if (normalizeString(productName) === normalizeString(img['Product Name'])) {
        console.log(`✅ Level 1 - Exact match found: "${img['Product Name']}"`);
        return { url: img['Image URL 1'], matchLevel: "exact" };
      }
    }
  }

  // Level 2: High similarity match (>0.8)
  let bestMatch: { image: ScrapedImage; similarity: number } | null = null;
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const similarity = calculateSimilarity(productName, img['Product Name']);
      if (similarity > 0.8 && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { image: img, similarity };
      }
    }
  }
  
  if (bestMatch) {
    console.log(`✅ Level 2 - High similarity match (${bestMatch.similarity.toFixed(2)}): "${bestMatch.image['Product Name']}"`);
    return { url: bestMatch.image['Image URL 1'], matchLevel: "high-similarity" };
  }

  // Level 3: Brand + Volume match
  const productBrand = extractBrand(productName);
  const productVolume = extractVolume(productName);
  
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const imageBrand = extractBrand(img['Product Name']);
      const imageVolume = extractVolume(img['Product Name']);
      
      if (productBrand && imageBrand && 
          normalizeString(productBrand) === normalizeString(imageBrand) &&
          productVolume && imageVolume &&
          normalizeString(productVolume) === normalizeString(imageVolume)) {
        console.log(`✅ Level 3 - Brand + Volume match: "${img['Product Name']}"`);
        return { url: img['Image URL 1'], matchLevel: "brand-volume" };
      }
    }
  }

  // Level 4: Brand-only match
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const imageBrand = extractBrand(img['Product Name']);
      
      if (productBrand && imageBrand && 
          normalizeString(productBrand) === normalizeString(imageBrand)) {
        console.log(`✅ Level 4 - Brand match: "${img['Product Name']}"`);
        return { url: img['Image URL 1'], matchLevel: "brand-only" };
      }
    }
  }

  // Level 5: Partial word match (>0.4 similarity)
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const similarity = calculateSimilarity(productName, img['Product Name']);
      if (similarity > 0.4 && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { image: img, similarity };
      }
    }
  }
  
  if (bestMatch) {
    console.log(`✅ Level 5 - Partial match (${bestMatch.similarity.toFixed(2)}): "${bestMatch.image['Product Name']}"`);
    return { url: bestMatch.image['Image URL 1'], matchLevel: "partial" };
  }

  // Level 6: Category-based fallback
  const category = getCategoryFromName(productName, 0);
  const categoryMatch = scrapedImages.find(img => 
    img['Product Name'] && getCategoryFromName(img['Product Name'], 0) === category
  );

  if (categoryMatch) {
    console.log(`✅ Level 6 - Category match (${category}): "${categoryMatch['Product Name']}"`);
    return { url: categoryMatch['Image URL 1'], matchLevel: "category" };
  }

  // Final fallback
  console.log(`❌ No match found for: "${productName}" - using fallback image`);
  return {
    url: scrapedImages[0]?.['Image URL 1'] || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    matchLevel: "fallback"
  };
};
