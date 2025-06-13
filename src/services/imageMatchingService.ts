
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
  urlNumber: string;
}

// Known alcohol brands for exact matching
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

// Check if two brands conflict (completely different brands)
const brandsConflict = (brand1: string, brand2: string): boolean => {
  if (!brand1 || !brand2) return false;
  
  const norm1 = normalizeString(brand1);
  const norm2 = normalizeString(brand2);
  
  // Different known brands are conflicts
  const brand1Match = ALCOHOL_BRANDS.find(b => norm1.includes(b));
  const brand2Match = ALCOHOL_BRANDS.find(b => norm2.includes(b));
  
  if (brand1Match && brand2Match && brand1Match !== brand2Match) {
    console.log(`🚫 Brand conflict detected: ${brand1Match} vs ${brand2Match}`);
    return true;
  }
  
  return false;
};

// Enhanced image quality assessment
const assessImageQuality = (url: string, urlNumber: string): ImageQualityScore => {
  if (!url) return { url, score: 0, source: 'low', urlNumber };

  const lowerUrl = url.toLowerCase();
  let score = 20; // Higher base score
  let source: 'high' | 'medium' | 'low' = 'medium';

  // High-quality domains get significant boost
  if (HIGH_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 60;
    source = 'high';
  }
  // Medium-quality domains
  else if (MEDIUM_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 30;
    source = 'medium';
  }
  // Heavily penalize low-quality sources
  else if (LOW_QUALITY_SOURCES.some(domain => lowerUrl.includes(domain))) {
    score -= 50;
    source = 'low';
  }

  // Boost for product-specific indicators
  if (lowerUrl.includes('product') || lowerUrl.includes('bottle')) score += 15;
  if (lowerUrl.includes('wine') || lowerUrl.includes('spirits') || lowerUrl.includes('whisky')) score += 10;
  
  // High resolution indicators
  if (lowerUrl.includes('1200') || lowerUrl.includes('1000') || lowerUrl.includes('large')) score += 20;
  if (lowerUrl.includes('original') || lowerUrl.includes('full')) score += 15;
  
  // Penalize thumbnails and small images heavily
  if (lowerUrl.includes('thumb') || lowerUrl.includes('small') || lowerUrl.includes('150')) score -= 30;
  if (lowerUrl.includes('200') || lowerUrl.includes('300')) score -= 20;
  
  // Social media penalties
  if (lowerUrl.includes('maxresdefault') || lowerUrl.includes('hqdefault')) score -= 40;

  return { url, score: Math.max(0, score), source, urlNumber };
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
  const scoredUrls = allUrls.map(item => assessImageQuality(item.url, item.number));

  // Filter out low-quality sources entirely and very low scores
  const cleanUrls = scoredUrls.filter(item => item.source !== 'low' && item.score > 25);

  if (cleanUrls.length === 0) {
    console.log(`⚠️ No quality product photos found, using curated fallback`);
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

  console.log(`🎯 Selected URL ${bestUrl.urlNumber} (score: ${bestUrl.score}, quality: ${bestUrl.source}) from ${allUrls.length} available URLs`);
  
  return {
    url: bestUrl.url,
    quality: bestUrl.source,
    urlNumber: bestUrl.urlNumber
  };
};

// Enhanced image matching function with stricter brand matching
export const findMatchingImage = (productName: string, scrapedImages: ScrapedImage[]): { url: string; matchLevel: string } => {
  if (!scrapedImages.length) {
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      matchLevel: "curated-fallback"
    };
  }

  console.log(`🔍 Finding image for: "${productName}"`);
  const productBrand = extractAlcoholBrand(productName);
  console.log(`🏷️ Product brand detected: "${productBrand}"`);
  
  // Level 1: Exact match with quality filtering
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      if (normalizeString(productName) === normalizeString(img['Product Name'])) {
        const { url, quality, urlNumber } = selectBestImageUrl(img);
        if (quality !== "curated-fallback") {
          console.log(`✅ Level 1 - Exact match: "${img['Product Name']}" (URL ${urlNumber})`);
          return { url, matchLevel: `exact-${quality}` };
        }
      }
    }
  }

  // Level 2: Very high similarity match with brand validation
  let bestMatch: { image: ScrapedImage; similarity: number } | null = null;
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const imageBrand = extractAlcoholBrand(img['Product Name']);
      
      // Skip if brands conflict
      if (productBrand && imageBrand && brandsConflict(productBrand, imageBrand)) {
        continue;
      }
      
      const similarity = calculateSimilarity(productName, img['Product Name']);
      if (similarity > 0.92 && (!bestMatch || similarity > bestMatch.similarity)) {
        bestMatch = { image: img, similarity };
      }
    }
  }
  
  if (bestMatch) {
    const { url, quality, urlNumber } = selectBestImageUrl(bestMatch.image);
    if (quality !== "curated-fallback") {
      console.log(`✅ Level 2 - High similarity (${bestMatch.similarity.toFixed(3)}): "${bestMatch.image['Product Name']}" (URL ${urlNumber})`);
      return { url, matchLevel: `high-similarity-${quality}` };
    }
  }

  // Level 3: Exact brand + volume match
  const productVolume = extractVolume(productName);
  
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const imageBrand = extractAlcoholBrand(img['Product Name']);
      const imageVolume = extractVolume(img['Product Name']);
      
      if (productBrand && imageBrand && 
          normalizeString(productBrand) === normalizeString(imageBrand) &&
          productVolume && imageVolume &&
          normalizeString(productVolume) === normalizeString(imageVolume)) {
        const { url, quality, urlNumber } = selectBestImageUrl(img);
        if (quality !== "curated-fallback") {
          console.log(`✅ Level 3 - Brand + Volume match: "${img['Product Name']}" (URL ${urlNumber})`);
          return { url, matchLevel: `brand-volume-${quality}` };
        }
      }
    }
  }

  // Level 4: Brand-only match (stricter)
  for (const img of scrapedImages) {
    if (img['Product Name']) {
      const imageBrand = extractAlcoholBrand(img['Product Name']);
      
      if (productBrand && imageBrand && 
          normalizeString(productBrand) === normalizeString(imageBrand)) {
        const { url, quality, urlNumber } = selectBestImageUrl(img);
        if (quality !== "curated-fallback") {
          console.log(`✅ Level 4 - Brand match: "${img['Product Name']}" (URL ${urlNumber})`);
          return { url, matchLevel: `brand-only-${quality}` };
        }
      }
    }
  }

  // Final fallback - use curated high-quality stock image
  console.log(`🎨 No suitable product photos found for: "${productName}" - using curated stock image`);
  return {
    url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    matchLevel: "curated-fallback"
  };
};
