
import { normalizeString, extractVolume, calculateSimilarity } from '@/utils/stringUtils';
import { getMajorCategory, hasCategoryConflict } from '@/utils/categoryMatchingUtils';
import { extractAlcoholBrand, getBrandPreferenceBonus } from '@/utils/brandAndVolumeUtils';
import { AIProductImageService } from '@/utils/AIProductImageService';
import { isLowQualityOrUnrelatedImage } from '@/utils/badImageUtils';

interface RefinedImage {
  id: number;
  'Product Name': string | null;
  'Final Image URL': string;
}

export const findMatchingImage = async (productName: string, refinedImages: RefinedImage[]): Promise<{ url: string; matchLevel: string }> => {
  if (!refinedImages.length) {
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      matchLevel: "curated-fallback"
    };
  }

  const productCat = getMajorCategory(productName);
  console.log(`🔍 Finding image for: "${productName}" (category: ${productCat})`);

  let selected: { url: string; matchLevel: string } | null = null;

  // Level 1: Exact match
  for (const img of refinedImages) {
    if (img['Product Name']) {
      if (
        normalizeString(productName) === normalizeString(img['Product Name']) &&
        !hasCategoryConflict(productName, img['Product Name'])
      ) {
        selected = { url: img['Final Image URL'], matchLevel: 'exact-refined' };
        break;
      }
    }
  }

  // Level 2: High similarity match
  if (!selected) {
    let bestMatches: { image: RefinedImage; score: number }[] = [];
    for (const img of refinedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const similarity = calculateSimilarity(productName, img['Product Name']);
        const brandBonus = getBrandPreferenceBonus(productName, img['Product Name']);
        const totalScore = similarity + brandBonus;
        if (totalScore > 0.7) bestMatches.push({ image: img, score: totalScore });
      }
    }
    
    bestMatches.sort((a, b) => b.score - a.score);
    if (bestMatches.length > 0) {
      selected = { url: bestMatches[0].image['Final Image URL'], matchLevel: 'high-similarity-refined' };
    }
  }

  // Level 3: Brand + volume match
  if (!selected) {
    const productVolume = extractVolume(productName);
    const productBrand = extractAlcoholBrand(productName);
    for (const img of refinedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const imageBrand = extractAlcoholBrand(img['Product Name']);
        const imageVolume = extractVolume(img['Product Name']);
        if (
          productBrand && imageBrand && normalizeString(productBrand) === normalizeString(imageBrand) &&
          productVolume && imageVolume && normalizeString(productVolume) === normalizeString(imageVolume)
        ) {
          selected = { url: img['Final Image URL'], matchLevel: 'brand-volume-refined' };
          break;
        }
      }
    }
  }

  // Level 4: Brand-only match
  if (!selected) {
    const productBrand = extractAlcoholBrand(productName);
    for (const img of refinedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const imageBrand = extractAlcoholBrand(img['Product Name']);
        if (
          productBrand && imageBrand && normalizeString(productBrand) === normalizeString(imageBrand)
        ) {
          selected = { url: img['Final Image URL'], matchLevel: 'brand-only-refined' };
          break;
        }
      }
    }
  }

  // Level 5: Partial similarity match
  if (!selected) {
    for (const img of refinedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const similarity = calculateSimilarity(productName, img['Product Name']);
        if (similarity > 0.4) {
          selected = { url: img['Final Image URL'], matchLevel: 'partial-similarity-refined' };
          break;
        }
      }
    }
  }

  // Fallback images
  if (!selected) {
    if (productCat === "wine" || productCat === "red" || productCat === "white" || productCat === "rose") {
      selected = {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        matchLevel: "fallback-wine"
      };
    } else if (productCat === "beer") {
      selected = {
        url: "https://images.unsplash.com/photo-1514361892635-ce9f1fecb6dd?auto=format&fit=crop&w=1000&q=80",
        matchLevel: "fallback-beer"
      };
    } else {
      selected = {
        url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        matchLevel: "curated-fallback"
      };
    }
  }

  // Final quality check with AI fallback
  if (
    !selected.url ||
    isLowQualityOrUnrelatedImage(selected.url, productName)
  ) {
    let aiUrl = AIProductImageService.getImageCache().get(productName.toLowerCase());
    if (!aiUrl) {
      AIProductImageService.generateProductImage(productName)
        .then(url => {})
        .catch(e => { console.error("AI image generation failed for", productName, e); });
      return {
        url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        matchLevel: "ai-fallback-pending"
      };
    }
    return {
      url: aiUrl,
      matchLevel: "ai-mockup"
    };
  }

  return selected;
};
