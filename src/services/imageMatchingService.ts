
import { normalizeString, extractVolume, calculateSimilarity } from '@/utils/stringUtils';
import { getMajorCategory, hasCategoryConflict } from '@/utils/categoryMatchingUtils';
import { extractAlcoholBrand, getBrandPreferenceBonus } from '@/utils/brandAndVolumeUtils';
import { ImageAppropriatenessChecker } from '@/utils/imageAppropriatenessChecker';

interface RefinedImage {
  id: number;
  'Product Name': string | null;
  'Final Image URL': string;
}

export const findMatchingImage = async (productName: string, refinedImages: RefinedImage[]): Promise<{ url: string; matchLevel: string }> => {
  if (!refinedImages.length) {
    // Generate AI image if no refined images available
    const aiImage = await ImageAppropriatenessChecker.getAppropriateImage('', productName, getMajorCategory(productName));
    return {
      url: aiImage,
      matchLevel: "ai-generated-no-data"
    };
  }

  const productCat = getMajorCategory(productName);
  console.log(`🔍 Finding image for: "${productName}" (category: ${productCat})`);

  let selectedImage: string | null = null;
  let matchLevel = '';

  // Level 1: Exact match
  for (const img of refinedImages) {
    if (img['Product Name']) {
      if (
        normalizeString(productName) === normalizeString(img['Product Name']) &&
        !hasCategoryConflict(productName, img['Product Name'])
      ) {
        selectedImage = img['Final Image URL'];
        matchLevel = 'exact-refined';
        break;
      }
    }
  }

  // Level 2: High similarity match
  if (!selectedImage) {
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
      selectedImage = bestMatches[0].image['Final Image URL'];
      matchLevel = 'high-similarity-refined';
    }
  }

  // Level 3: Brand + volume match
  if (!selectedImage) {
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
          selectedImage = img['Final Image URL'];
          matchLevel = 'brand-volume-refined';
          break;
        }
      }
    }
  }

  // Level 4: Brand-only match
  if (!selectedImage) {
    const productBrand = extractAlcoholBrand(productName);
    for (const img of refinedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const imageBrand = extractAlcoholBrand(img['Product Name']);
        if (
          productBrand && imageBrand && normalizeString(productBrand) === normalizeString(imageBrand)
        ) {
          selectedImage = img['Final Image URL'];
          matchLevel = 'brand-only-refined';
          break;
        }
      }
    }
  }

  // Level 5: Partial similarity match
  if (!selectedImage) {
    for (const img of refinedImages) {
      if (img['Product Name']) {
        if (hasCategoryConflict(productName, img['Product Name'])) continue;
        const similarity = calculateSimilarity(productName, img['Product Name']);
        if (similarity > 0.4) {
          selectedImage = img['Final Image URL'];
          matchLevel = 'partial-similarity-refined';
          break;
        }
      }
    }
  }

  // Final check: Validate image appropriateness and generate AI image if needed
  if (selectedImage) {
    const appropriateImage = await ImageAppropriatenessChecker.getAppropriateImage(
      selectedImage, 
      productName, 
      productCat
    );
    
    // If AI generated a new image, update match level
    if (appropriateImage !== selectedImage) {
      matchLevel = 'ai-generated-replacement';
    }
    
    return {
      url: appropriateImage,
      matchLevel
    };
  }

  // No match found - generate AI image
  const aiImage = await ImageAppropriatenessChecker.getAppropriateImage('', productName, productCat);
  return {
    url: aiImage,
    matchLevel: "ai-generated-no-match"
  };
};
