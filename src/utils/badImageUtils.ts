
/**
 * Utility to check for low quality, missing, selfie, or unrelated alcohol product images.
 */

const BAD_IMAGE_DOMAINS = [
  "unsplash.com",
  "youtube.com", "youtu.be",
  "pinterest.com",
  "facebook.com", "instagram.com", "twitter.com", "tiktok.com", "reddit.com",
  "blogspot.com", "wordpress.com",
  "wikimedia.org", "wikipedia.org",
  "tumblr.com",
  "placeholder", "no-image", "svg", "icon", "logo"
];

// Heuristics for low res or irrelevant images (e.g. selfie, generic)
function isLowQualityOrUnrelatedImage(url: string, productName: string): boolean {
  if (!url || typeof url !== "string") return true;

  const lowerUrl = url.toLowerCase();

  // Clearly missing/generic sources
  if (
    BAD_IMAGE_DOMAINS.some(d => lowerUrl.includes(d)) ||
    lowerUrl.endsWith('.svg') ||
    /150|default|thumb|generic|avatar|selfie|profile|user|portrait|qr|barcode|receipt|idcard/i.test(lowerUrl) ||
    lowerUrl.includes("placeholder") ||
    !/\.(jpg|jpeg|png|webp)$/i.test(lowerUrl)
  ) return true;

  // Check for faces or selfies by filename keywords (very rough)
  // Ideally: run a face detector on the image, but that's too heavy here

  // Rudimentary: unrelated images often have 'thumb', 'profile', 'user', 'avatar', 'icon', etc in their URL
  if (/thumb|profile|user|avatar|icon|logo|selfie/i.test(lowerUrl)) {
    return true;
  }

  // Image filename too short or full of numbers/ids
  const parts = lowerUrl.split('/');
  const filename = parts[parts.length - 1] || '';
  if (filename.replace(/\d/g, '').length < 4) return true;
  
  // Generic filenames (e.g. "unnamed.jpg", "image.png", etc)
  if (/unnamed|image|photo|file/.test(filename)) return true;

  // Conservative: if all tests pass, accept
  return false;
}

export { isLowQualityOrUnrelatedImage };
