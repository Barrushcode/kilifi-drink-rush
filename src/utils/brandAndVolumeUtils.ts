
import { normalizeString, extractBrand, extractVolume } from './stringUtils';

// Known alcohol brands for preference matching (not exclusion)
const ALCOHOL_BRANDS = [
  'macallan', 'johnnie walker', 'hennessy', 'remy martin', 'martell', 'absolut', 'grey goose', 'belvedere',
  'ciroc', 'smirnoff', 'glenfiddich', 'glenlivet', 'chivas regal', 'jameson', 'jack daniels', 'dom perignon',
  'moet', 'veuve clicquot', 'cristal', 'krug', 'patron', 'don julio', 'jose cuervo', 'bacardi',
  'captain morgan', 'tanqueray', 'bombay', 'hendricks', 'beefeater', 'gin mare', '100 pipers', 'teachers',
  'ballantines', 'black label', 'red label', 'blue label', 'gold label', 'green label', 'double black',
  'camus', 'courvoisier', 'napoleon', 'vsop', 'xo'
];

// Extract brand from product name with known alcohol brands
export const extractAlcoholBrand = (productName: string): string | null => {
  const normalized = normalizeString(productName);

  for (const brand of ALCOHOL_BRANDS) {
    if (normalized.includes(brand)) {
      return brand;
    }
  }

  // Fallback to general brand extraction
  return extractBrand(productName);
};

// Calculate brand preference bonus (not exclusion)
export const getBrandPreferenceBonus = (productName: string, imageName: string): number => {
  const productBrand = extractAlcoholBrand(productName);
  const imageBrand = extractAlcoholBrand(imageName);

  if (productBrand && imageBrand && normalizeString(productBrand) === normalizeString(imageBrand)) {
    return 0.1; // 10% bonus for same brand
  }

  return 0;
};
