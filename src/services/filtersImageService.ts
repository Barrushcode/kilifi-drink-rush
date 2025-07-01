
import { supabase } from '@/integrations/supabase/client';
import { correctProductName } from '@/utils/nameCorrectionUtils';

interface FilterImage {
  name: string;
  publicUrl: string;
}

export class FiltersImageService {
  private static imageCache = new Map<string, string>();
  
  static async getAllFilterImages(): Promise<FilterImage[]> {
    try {
      const { data: files, error } = await supabase.storage
        .from('filters')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) {
        console.error('Error fetching filter images:', error);
        return [];
      }

      const images: FilterImage[] = [];
      for (const file of files || []) {
        if (file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
          const { data } = supabase.storage
            .from('filters')
            .getPublicUrl(file.name);
          
          images.push({
            name: file.name.replace(/\.(jpg|jpeg|png|webp)$/i, ''),
            publicUrl: data.publicUrl
          });
        }
      }

      console.log(`📸 Loaded ${images.length} images from filters bucket`);
      return images;
    } catch (error) {
      console.error('Error in getAllFilterImages:', error);
      return [];
    }
  }

  static findBestMatch(productName: string, filterImages: FilterImage[]): string | null {
    const correctedName = correctProductName(productName);
    const normalizedProduct = this.normalizeForMatching(correctedName);

    // Try exact match first
    for (const image of filterImages) {
      const normalizedImage = this.normalizeForMatching(image.name);
      if (normalizedProduct === normalizedImage) {
        return image.publicUrl;
      }
    }

    // Try partial matches
    const productWords = normalizedProduct.split(' ').filter(word => word.length > 2);
    let bestMatch: { image: FilterImage; score: number } | null = null;

    for (const image of filterImages) {
      const normalizedImage = this.normalizeForMatching(image.name);
      const imageWords = normalizedImage.split(' ');
      
      let matchScore = 0;
      for (const word of productWords) {
        if (imageWords.some(imageWord => imageWord.includes(word) || word.includes(imageWord))) {
          matchScore++;
        }
      }

      const score = matchScore / productWords.length;
      if (score > 0.6 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { image, score };
      }
    }

    return bestMatch ? bestMatch.image.publicUrl : null;
  }

  private static normalizeForMatching(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
