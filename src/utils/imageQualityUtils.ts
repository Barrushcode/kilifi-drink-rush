
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

interface ImageQualityScore {
  url: string;
  score: number;
  source: 'high' | 'medium' | 'low';
  urlNumber: string;
}

// Enhanced image quality assessment with higher base scores
export const assessImageQuality = (url: string, urlNumber: string): ImageQualityScore => {
  if (!url) return { url, score: 0, source: 'low', urlNumber };

  const lowerUrl = url.toLowerCase();
  let score = 30;
  let source: 'medium' | 'high' | 'low' = 'medium';

  if (HIGH_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 50;
    source = 'high';
  } else if (MEDIUM_QUALITY_DOMAINS.some(domain => lowerUrl.includes(domain))) {
    score += 25;
    source = 'medium';
  } else if (LOW_QUALITY_SOURCES.some(domain => lowerUrl.includes(domain))) {
    score -= 20;
    source = 'low';
  }

  if (lowerUrl.includes('product') || lowerUrl.includes('bottle')) score += 15;
  if (lowerUrl.includes('wine') || lowerUrl.includes('spirits') || lowerUrl.includes('whisky')) score += 10;

  if (lowerUrl.includes('1200') || lowerUrl.includes('1000') || lowerUrl.includes('large')) score += 20;
  if (lowerUrl.includes('original') || lowerUrl.includes('full')) score += 15;

  if (lowerUrl.includes('thumb') || lowerUrl.includes('small') || lowerUrl.includes('150')) score -= 15;
  if (lowerUrl.includes('200') || lowerUrl.includes('300')) score -= 10;

  if (lowerUrl.includes('maxresdefault') || lowerUrl.includes('hqdefault')) score -= 25;

  return { url, score: Math.max(0, score), source, urlNumber };
};

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

// Enhanced version that can use AI when multiple URLs available
export const selectBestImageUrl = (scrapedImage: ScrapedImage, productName: string): { url: string; quality: string; urlNumber: string } => {
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

  // For now, use the traditional scoring approach
  // The AI enhancement will be used in the main image matching service
  const scoredUrls = allUrls.map(item => assessImageQuality(item.url, item.number));
  const cleanUrls = scoredUrls.filter(item => item.score > 10);

  if (cleanUrls.length === 0) {
    return {
      url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      quality: "curated-fallback",
      urlNumber: "none"
    };
  }

  const bestUrl = cleanUrls.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  return {
    url: bestUrl.url,
    quality: bestUrl.source,
    urlNumber: bestUrl.urlNumber
  };
};
