import { normalizeString, extractVolume, calculateSimilarity } from '@/utils/stringUtils';
import { getMajorCategory, hasCategoryConflict } from '@/utils/categoryMatchingUtils';
import { extractAlcoholBrand, getBrandPreferenceBonus } from '@/utils/brandAndVolumeUtils';
import { selectBestImageUrl } from '@/utils/imageQualityUtils';
import { AIProductImageService } from '@/utils/AIProductImageService';
import { isLowQualityOrUnrelatedImage } from '@/utils/badImageUtils';

interface ScrapedImage {
  id: number;
  'Product Name': string | null;
  'Image URL 1': string;
  'Image URL 2': string | null;
  'Image URL 3': string | null;
  'Image URL 4': string | null;
  'Image URL 5': string | null;
  'Image URL 6': string | null;
  'Image URL 7': string | null;
  'Image URL 8': string | null;
  'Image URL 9': string | null;
  'Image URL 10': string | null;
}

export const findMatchingImage = (productName: string, scrapedImages: ScrapedImage[]): { url: string; matchLevel: string } => {
  if (!scrapedImages.length) {
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      matchLevel: "curated-fallback"
    };
  }

  const productCat = getMajorCategory(productName);
  console.log(`🔍 Finding image for: "${productName}" (category: ${productCat})`);

  let selected: { url: string; matchLevel: string } | null = null;

  // Level 1: Exact match with category and quality filtering
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      if (
        normalizeString(productName) === normalizeString(img['Product Name']) &&
        !hasCategoryConflict(productName, img['Product Name'])
      ) {
        const { url, quality, urlNumber } = selectBestImageUrl(img, productName);
        if (quality !== "curated-fallback") {
          selected = { url, matchLevel: `exact-${quality}` };
          break;
        }
      }
    }
  }

  // Level 2: High similarity match AND correct category
  if (!selected) {
    let bestMatches: { image: ScrapedImage; score: number }[] = [];
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const similarity = calculateSimilarity(productName, img['Product Name']);
        const brandBonus = getBrandPreferenceBonus(productName, img['Product Name']);
        const totalScore = similarity + brandBonus;
        if (totalScore > 0.7) bestMatches.push({ image: img, score: totalScore });
      }
    }
    bestMatches.sort((a, b) => b.score - a.score);
    for (const match of bestMatches) {
      const { url, quality, urlNumber } = selectBestImageUrl(match.image, productName);
      if (quality !== "curated-fallback") {
        selected = { url, matchLevel: `high-similarity-${quality}` };
        break;
      }
    }
  }

  // Level 3: Brand + volume match, block category conflicts
  if (!selected) {
    const productVolume = extractVolume(productName);
    const productBrand = extractAlcoholBrand(productName);
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const imageBrand = extractAlcoholBrand(img['Product Name']);
        const imageVolume = extractVolume(img['Product Name']);
        if (
          productBrand && imageBrand && normalizeString(productBrand) === normalizeString(imageBrand) &&
          productVolume && imageVolume && normalizeString(productVolume) === normalizeString(imageVolume)
        ) {
          const { url, quality, urlNumber } = selectBestImageUrl(img, productName);
          if (quality !== "curated-fallback") {
            selected = { url, matchLevel: `brand-volume-${quality}` };
            break;
          }
        }
      }
    }
  }

  // Level 4: Brand-only match, block category conflicts
  if (!selected) {
    const productBrand = extractAlcoholBrand(productName);
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const imageBrand = extractAlcoholBrand(img['Product Name']);
        if (
          productBrand && imageBrand && normalizeString(productBrand) === normalizeString(imageBrand)
        ) {
          const { url, quality, urlNumber } = selectBestImageUrl(img, productName);
          if (quality !== "curated-fallback") {
            selected = { url, matchLevel: `brand-only-${quality}` };
            break;
          }
        }
      }
    }
  }

  // Level 5: Partial similarity match and category, fallback if non-match
  if (!selected) {
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const similarity = calculateSimilarity(productName, img['Product Name']);
        if (similarity > 0.4) {
          const { url, quality, urlNumber } = selectBestImageUrl(img, productName);
          if (quality !== "curated-fallback") {
            selected = { url, matchLevel: `partial-similarity-${quality}` };
            break;
          }
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

  // If even fallback is bad, use AI/placeholder/final fallback
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
