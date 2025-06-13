
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
}

// High-quality domains for alcohol product photography
const HIGH_QUALITY_DOMAINS = [
  'drinkworks.com',
  'totalwine.com',
  'thewhiskyexchange.com',
  'masterofmalt.com',
  'wine.com',
  'drizly.com',
  'bevmo.com',
  'liquor.com',
  'wine-searcher.com',
  'vivino.com',
  'distiller.com',
  'caskers.com',
  'reservebar.com',
  'flaviar.com'
];

const MEDIUM_QUALITY_DOMAINS = [
  'amazon.com',
  'walmart.com',
  'target.com',
  'costco.com',
  'samsclub.com',
  'shopify.com',
  'bigcommerce.com'
];

const LOW_QUALITY_SOURCES = [
  'youtube.com',
  'youtu.be',
  'pinterest.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'tiktok.com',
  'reddit.com',
  'blogspot.com',
  'wordpress.com',
  'wikimedia.org',
  'wikipedia.org'
];

// Assess image quality based on URL characteristics
const assessImageQuality = (url: string): ImageQualityScore => {
  if (!url) return { url, score: 0, source: 'low' };

  const lowerUrl = url.toLowerCase();
  let score = 10; // Base score
  let source: 'high' | 'medium' | 'low' = 'medium';

  // Check for high-quality domains
  if (HIGH_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 50;
    source = 'high';
  }
  // Check for medium-quality domains
  else if (MEDIUM_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 25;
    source = 'medium';
  }
  // Penalize low-quality sources heavily
  else if (LOW_QUALITY_SOURCES.some(domain => lowerUrl.includes(domain))) {
    score -= 40;
    source = 'low';
  }

  // Boost score for high-resolution indicators
  if (lowerUrl.includes('1200') || lowerUrl.includes('1000') || lowerUrl.includes('large') || lowerUrl.includes('original')) {
    score += 15;
  }

  // Boost score for product-specific image indicators
  if (lowerUrl.includes('product') || lowerUrl.includes('bottle') || lowerUrl.includes('wine') || lowerUrl.includes('spirits')) {
    score += 10;
  }

  // Penalize thumbnail or small image indicators
  if (lowerUrl.includes('thumb') || lowerUrl.includes('small') || lowerUrl.includes('150') || lowerUrl.includes('200')) {
    score -= 20;
  }

  // Penalize social media image formats
  if (lowerUrl.includes('maxresdefault') || lowerUrl.includes('hqdefault') || lowerUrl.includes('mqdefault')) {
    score -= 30;
  }

  return { url, score: Math.max(0, score), source };
};

// Select the best quality image from all available URLs
const selectBestImageUrl = (scrapedImage: ScrapedImage): { url: string; quality: string; urlNumber: string } => {
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
  const scoredUrls = allUrls.map(item => ({
    ...assessImageQuality(item.url),
    urlNumber: item.number
  }));

  // Filter out low-quality sources entirely
  const cleanUrls = scoredUrls.filter(item => item.source !== 'low' && item.score > 15);

  if (cleanUrls.length === 0) {
    console.log(`⚠️ No clean product photos found, using curated fallback`);
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      quality: "curated-fallback",
      urlNumber: "none"
    };
  }

  // Select the highest scoring clean URL
  const bestUrl = cleanUrls.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  console.log(`🎯 Selected URL ${bestUrl.urlNumber} (score: ${bestUrl.score}, quality: ${bestUrl.source})`);
  
  return {
    url: bestUrl.url,
    quality: bestUrl.source,
    urlNumber: bestUrl.urlNumber
  };
};

// Enhanced image matching function with quality filtering
export const findMatchingImage = (productName: string, scrapedImages: ScrapedImage[]): { url: string; matchLevel: string } => {
  if (!scrapedImages.length) {
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      matchLevel: "curated-fallback"
    };
  }

  console.log(`🔍 Finding clean product photo for: "${productName}"`);
  
  // Level 1: Exact match with quality filtering
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      if (normalizeString(productName) === normalizeString(img['Product Name'])) {
        const { url, quality, urlNumber } = selectBestImageUrl(img);
        if (quality !== "curated-fallback") {
          console.log(`✅ Level 1 - Exact match with clean photo: "${img['Product Name']}" (URL ${urlNumber})`);
          return { url, matchLevel: `exact-${quality}` };
        }
      }
    }
  }

  // Level 2: High similarity match with quality filtering
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
    const { url, quality, urlNumber } = selectBestImageUrl(bestMatch.image);
    if (quality !== "curated-fallback") {
      console.log(`✅ Level 2 - High similarity with clean photo (${bestMatch.similarity.toFixed(2)}): "${bestMatch.image['Product Name']}" (URL ${urlNumber})`);
      return { url, matchLevel: `high-similarity-${quality}` };
    }
  }

  // Level 3: Brand + Volume match with quality filtering
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
        const { url, quality, urlNumber } = selectBestImageUrl(img);
        if (quality !== "curated-fallback") {
          console.log(`✅ Level 3 - Brand + Volume with clean photo: "${img['Product Name']}" (URL ${urlNumber})`);
          return { url, matchLevel: `brand-volume-${quality}` };
        }
      }
    }
  }

  // Level 4: Brand-only match with quality filtering
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const imageBrand = extractBrand(img['Product Name']);
      
      if (productBrand && imageBrand && 
          normalizeString(productBrand) === normalizeString(imageBrand)) {
        const { url, quality, urlNumber } = selectBestImageUrl(img);
        if (quality !== "curated-fallback") {
          console.log(`✅ Level 4 - Brand match with clean photo: "${img['Product Name']}" (URL ${urlNumber})`);
          return { url, matchLevel: `brand-only-${quality}` };
        }
      }
    }
  }

  // Level 5: Category-based fallback with quality filtering
  const category = getCategoryFromName(productName, 0);
  const categoryMatches = scrapedImages.filter(img => 
    img['Product Name'] && getCategoryFromName(img['Product Name'], 0) === category
  );

  // From category matches, find the highest quality image
  let bestCategoryMatch: { image: ScrapedImage; quality: string; score: number } | null = null;
  
  for (const img of categoryMatches) {
    const { url, quality, urlNumber } = selectBestImageUrl(img);
    if (quality !== "curated-fallback") {
      const score = quality === 'high' ? 3 : quality === 'medium' ? 2 : 1;
      if (!bestCategoryMatch || score > bestCategoryMatch.score) {
        bestCategoryMatch = { 
          image: img, 
          quality: `category-${quality}`,
          score 
        };
      }
    }
  }

  if (bestCategoryMatch) {
    const { url } = selectBestImageUrl(bestCategoryMatch.image);
    console.log(`✅ Level 5 - Category match with clean photo (${category}): "${bestCategoryMatch.image['Product Name']}"`);
    return { url, matchLevel: bestCategoryMatch.quality };
  }

  // Final fallback - use curated high-quality stock image
  console.log(`🎨 No clean product photos found for: "${productName}" - using curated stock image`);
  return {
    url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    matchLevel: "curated-fallback"
  };
};
