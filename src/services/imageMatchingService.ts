import { normalizeString, extractBrand, extractVolume, calculateSimilarity } from '@/utils/stringUtils';
import { getCategoryFromName } from '@/utils/categoryUtils';
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

interface ImageQualityScore {
  url: string;
  score: number;
  source: 'high' | 'medium' | 'low';
  urlNumber: string;
}

// Known alcohol brands for preference matching (not exclusion)
const ALCOHOL_BRANDS = [
  'macallan', 'johnnie walker', 'hennessy', 'remy martin', 'martell',
  'absolut', 'grey goose', 'belvedere', 'ciroc', 'smirnoff',
  'glenfiddich', 'glenlivet', 'chivas regal', 'jameson', 'jack daniels',
  'dom perignon', 'moet', 'veuve clicquot', 'cristal', 'krug',
  'patron', 'don julio', 'jose cuervo', 'bacardi', 'captain morgan',
  'tanqueray', 'bombay', 'hendricks', 'beefeater', 'gin mare',
  '100 pipers', 'teachers', 'ballantines', 'black label', 'red label',
  'blue label', 'gold label', 'green label', 'double black',
  'camus', 'courvoisier', 'napoleon', 'vsop', 'xo'
];

// High-quality domains for alcohol product photography
const HIGH_QUALITY_DOMAINS = [
  'drinkworks.com', 'totalwine.com', 'thewhiskyexchange.com', 'masterofmalt.com',
  'wine.com', 'drizly.com', 'bevmo.com', 'liquor.com', 'wine-searcher.com',
  'vivino.com', 'distiller.com', 'caskers.com', 'reservebar.com', 'flaviar.com',
  'lcbo.com', 'thirstie.com', 'vinepair.com', 'whiskyshop.com'
];

const MEDIUM_QUALITY_DOMAINS = [
  'amazon.com', 'walmart.com', 'target.com', 'costco.com', 'samsclub.com',
  'shopify.com', 'bigcommerce.com', 'squarespace.com'
];

const LOW_QUALITY_SOURCES = [
  'youtube.com', 'youtu.be', 'pinterest.com', 'facebook.com', 'instagram.com',
  'twitter.com', 'tiktok.com', 'reddit.com', 'blogspot.com', 'wordpress.com',
  'wikimedia.org', 'wikipedia.org', 'tumblr.com'
];

// Extract brand from product name with known alcohol brands
const extractAlcoholBrand = (productName: string): string | null => {
  const normalized = normalizeString(productName);
  
  for (const brand of ALCOHOL_BRANDS) {
    if (normalized.includes(brand)) {
      return brand;
    }
  }
  
  // Fallback to general brand extraction
  return extractBrand(productName);
};

// This function helps to determine MAJOR category (wine, whisky, vodka, beer, etc)
function getMajorCategory(name: string): string {
  const category = getCategoryFromName(name, 0).toLowerCase();
  if (category.includes('wine')) return 'wine';
  if (category.includes('whisky')) return 'whisky';
  if (category.includes('vodka')) return 'vodka';
  if (category.includes('gin')) return 'gin';
  if (category.includes('rum')) return 'rum';
  if (category.includes('tequila')) return 'tequila';
  if (category.includes('brandy') || category.includes('cognac')) return 'brandy';
  if (category.includes('beer')) return 'beer';
  return category; // fallback
}

// Check for major category conflicts (wine vs spirits vs beer)
const hasCategoryConflict = (productName: string, imageName: string): boolean => {
  const productCat = getMajorCategory(productName);
  const imageCat = getMajorCategory(imageName);

  // Only block major category mismatches
  if (productCat && imageCat && productCat !== imageCat) {
    // If either is "wine", but not both, block especially (reduce wrong matches for wine to whisky etc)
    if (productCat === 'wine' || imageCat === 'wine') return true;
    // Also block whisky <-> gin, etc.
    return true;
  }
  return false;
};

// Enhanced image quality assessment with higher base scores
const assessImageQuality = (url: string, urlNumber: string): ImageQualityScore => {
  if (!url) return { url, score: 0, source: 'low', urlNumber };

  const lowerUrl = url.toLowerCase();
  let score = 30; // Higher base score for more permissive matching
  let source: 'medium' | 'high' | 'low' = 'medium';

  // High-quality domains get significant boost
  if (HIGH_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 50;
    source = 'high';
  }
  // Medium-quality domains
  else if (MEDIUM_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 25;
    source = 'medium';
  }
  // Less penalty for low-quality sources (still usable if needed)
  else if (LOW_QUALITY_SOURCES.some(domain => lowerUrl.includes(domain))) {
    score -= 20; // Reduced penalty
    source = 'low';
  }

  // Boost for product-specific indicators
  if (lowerUrl.includes('product') || lowerUrl.includes('bottle')) score += 15;
  if (lowerUrl.includes('wine') || lowerUrl.includes('spirits') || lowerUrl.includes('whisky')) score += 10;
  
  // High resolution indicators
  if (lowerUrl.includes('1200') || lowerUrl.includes('1000') || lowerUrl.includes('large')) score += 20;
  if (lowerUrl.includes('original') || lowerUrl.includes('full')) score += 15;

  // Reduced penalties for smaller images (still usable)
  if (lowerUrl.includes('thumb') || lowerUrl.includes('small') || lowerUrl.includes('150')) score -= 15;
  if (lowerUrl.includes('200') || lowerUrl.includes('300')) score -= 10;

  // Social media penalties (but not as harsh)
  if (lowerUrl.includes('maxresdefault') || lowerUrl.includes('hqdefault')) score -= 25;

  return { url, score: Math.max(0, score), source, urlNumber };
};

// Select the best quality image from all available URLs that matches the product category
const selectBestImageUrl = (scrapedImage: ScrapedImage, productName: string): { url: string; quality: string; urlNumber: string } => {
  const allUrls = [
    { url: scrapedImage['Image URL 1'], number: '1' },
    { url: scrapedImage['Image URL 2'], number: '2' },
    { url: scrapedImage['Image URL 3'], number: '3' },
    { url: scrapedImage['Image URL 4'], number: '4' },
    { url: scrapedImage['Image URL 5'], number: '5' },
    { url: scrapedImage['Image URL 6'], number: '6' },
    { url: scrapedImage['Image URL 7'], number: '7' },
    { url: scrapedImage['Image URL 8'], number: '8' },
    { url: scrapedImage['Image URL 9'], number: '9' },
    { url: scrapedImage['Image URL 10'], number: '10' }
  ].filter(item => item.url && item.url.trim() !== '');

  if (allUrls.length === 0) {
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      quality: "fallback",
      urlNumber: "none"
    };
  }

  // Score all available URLs
  const scoredUrls = allUrls.map(item => assessImageQuality(item.url, item.number));

  // More permissive filtering - only exclude extremely low scores
  const cleanUrls = scoredUrls.filter(item => item.score > 10);

  if (cleanUrls.length === 0) {
    // No usable product photos found
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      quality: "curated-fallback",
      urlNumber: "none"
    };
  }

  // Select the highest scoring URL
  const bestUrl = cleanUrls.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    url: bestUrl.url,
    quality: bestUrl.source,
    urlNumber: bestUrl.urlNumber
  };
};

// Calculate brand preference bonus (not exclusion)
const getBrandPreferenceBonus = (productName: string, imageName: string): number => {
  const productBrand = extractAlcoholBrand(productName);
  const imageBrand = extractAlcoholBrand(imageName);
  
  if (productBrand && imageBrand && normalizeString(productBrand) === normalizeString(imageBrand)) {
    return 0.1; // 10% bonus for same brand
  }
  
  return 0;
};

// Main image matching function — now blocks major category mismatches hard and does fallback
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

  // If still not found: fallback image (curated for wine)
  if (!selected) {
    if (productCat === "wine" || productCat === "red" || productCat === "white" || productCat === "rose") {
      // Unsplash: generic wine bottle photo
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
    // Use public getter for imageCache instead of private property access
    let aiUrl = AIProductImageService.getImageCache().get(productName.toLowerCase());
    if (!aiUrl) {
      AIProductImageService.generateProductImage(productName)
        .then(url => {})
        .catch(e => { console.error("AI image generation failed for", productName, e); });
      // Return fallback for now
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
