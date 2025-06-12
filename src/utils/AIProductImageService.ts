
import { supabase } from '@/integrations/supabase/client';

interface AIImageResult {
  imageUrl: string;
  prompt: string;
}

export class AIProductImageService {
  // Cache for storing generated images to avoid repeated API calls
  private static imageCache = new Map<string, string>();
  
  // Fallback images for when AI generation fails
  private static readonly FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1582553352566-7b4cdcc2379c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1549796014-6aa0e2eaaa43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1574445459035-ad3c5fdb2a5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1569529463704-d9fb8f4b6c8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  ];

  static async generateProductImage(productName: string, category: string = '', description: string = ''): Promise<string> {
    // Check cache first
    const cacheKey = `${productName}-${category}`.toLowerCase();
    if (this.imageCache.has(cacheKey)) {
      console.log(`Using cached image for: ${productName}`);
      return this.imageCache.get(cacheKey)!;
    }

    try {
      console.log(`Generating AI image for product: ${productName}`);
      
      // Call the Supabase edge function for AI image generation
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          productName,
          category,
          description
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.imageUrl) {
        console.log(`Successfully generated image for: ${productName}`);
        this.imageCache.set(cacheKey, data.imageUrl);
        return data.imageUrl;
      } else {
        throw new Error('No image URL returned from AI generation');
      }

    } catch (error) {
      console.error('Error generating AI image:', error);
      
      // Fallback to curated image
      const fallbackImage = this.getFallbackImage(productName);
      this.imageCache.set(cacheKey, fallbackImage);
      return fallbackImage;
    }
  }

  private static getFallbackImage(productName: string): string {
    const hash = this.hashString(productName);
    const imageIndex = Math.abs(hash) % this.FALLBACK_IMAGES.length;
    console.log(`Using fallback image for: ${productName}`);
    return this.FALLBACK_IMAGES[imageIndex];
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  static clearCache(): void {
    this.imageCache.clear();
  }

  // Method to batch generate images for multiple products
  static async batchGenerateImages(products: Array<{name: string, category: string, description: string}>): Promise<void> {
    console.log(`Starting batch generation for ${products.length} products`);
    
    // Generate images in smaller batches to avoid overwhelming the API
    const batchSize = 3;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (product) => {
          try {
            await this.generateProductImage(product.name, product.category, product.description);
            // Small delay between requests to be respectful to the API
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Failed to generate image for ${product.name}:`, error);
          }
        })
      );
      
      // Longer delay between batches
      if (i + batchSize < products.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('Batch generation completed');
  }
}
