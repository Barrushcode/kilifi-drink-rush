
import { getCategoryFromName } from './categoryUtils';

// This function helps to determine MAJOR category (wine, whisky, vodka, beer, etc)
export function getMajorCategory(name: string): string {
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
export const hasCategoryConflict = (productName: string, imageName: string): boolean => {
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
