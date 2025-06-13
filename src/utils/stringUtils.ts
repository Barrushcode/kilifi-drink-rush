
// Normalize strings for better matching
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/ml/gi, 'ML') // Standardize ML
    .replace(/\bl\b/gi, 'L') // Standardize L
    .replace(/&/g, 'and') // Replace & with and
    .replace(/[^\w\s]/g, '') // Remove special characters except spaces
    .trim();
};

// Extract brand name from product name
export const extractBrand = (name: string): string => {
  const normalized = normalizeString(name);
  const words = normalized.split(' ');
  // Usually brand is the first 1-2 words
  return words.slice(0, 2).join(' ');
};

// Extract volume/size from product name
export const extractVolume = (name: string): string | null => {
  const volumeMatch = name.match(/(\d+(?:\.\d+)?)\s*(ml|l|ML|L)\b/i);
  return volumeMatch ? volumeMatch[0].toLowerCase() : null;
};

// Calculate string similarity (simple implementation)
export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Word-based similarity
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  
  return commonWords.length / Math.max(words1.length, words2.length);
};
