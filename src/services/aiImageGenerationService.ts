
import { supabase } from '@/integrations/supabase/client';

interface AIImageRequest {
  productName: string;
  category: string;
}

interface AIImageResponse {
  imageUrl: string;
  cached: boolean;
}

export class AIImageGenerationService {
  private static cache = new Map<string, string>();

  static async generateProductImage(productName: string, category: string): Promise<AIImageResponse> {
    const cacheKey = `${productName.toLowerCase()}_${category.toLowerCase()}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return {
        imageUrl: this.cache.get(cacheKey)!,
        cached: true
      };
    }

    try {
      console.log(`🎨 Generating AI image for: ${productName} (${category})`);
      
      // Create a professional product description for image generation
      const prompt = this.createImagePrompt(productName, category);
      
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: { prompt, productName, category }
      });

      if (error) {
        console.error('AI image generation error:', error);
        return {
          imageUrl: this.getFallbackImage(category),
          cached: false
        };
      }

      const imageUrl = data.imageUrl || this.getFallbackImage(category);
      this.cache.set(cacheKey, imageUrl);
      
      return {
        imageUrl,
        cached: false
      };

    } catch (error) {
      console.error('AI image generation failed:', error);
      return {
        imageUrl: this.getFallbackImage(category),
        cached: false
      };
    }
  }

  private static createImagePrompt(productName: string, category: string): string {
    const cleanName = productName.replace(/[^\w\s]/g, '').trim();
    const categoryLower = category.toLowerCase();

    if (categoryLower.includes('wine') || categoryLower.includes('red') || categoryLower.includes('white')) {
      return `Professional product photography of a wine bottle labeled "${cleanName}", elegant glass bottle with wine label, clean white background, studio lighting, high-quality commercial product shot, no people, no text overlay`;
    }
    
    if (categoryLower.includes('beer')) {
      return `Professional product photography of a beer bottle or can labeled "${cleanName}", clean glass bottle or aluminum can, crisp white background, studio lighting, high-quality commercial product shot, no people, no text overlay`;
    }
    
    if (categoryLower.includes('whiskey') || categoryLower.includes('whisky') || categoryLower.includes('bourbon')) {
      return `Professional product photography of a whiskey bottle labeled "${cleanName}", amber glass bottle with elegant label, clean white background, studio lighting, high-quality commercial product shot, no people, no text overlay`;
    }
    
    if (categoryLower.includes('vodka')) {
      return `Professional product photography of a vodka bottle labeled "${cleanName}", clear glass bottle with clean label, white background, studio lighting, high-quality commercial product shot, no people, no text overlay`;
    }
    
    if (categoryLower.includes('gin')) {
      return `Professional product photography of a gin bottle labeled "${cleanName}", clear or tinted glass bottle with botanical-inspired label, clean white background, studio lighting, high-quality commercial product shot, no people, no text overlay`;
    }

    // Generic alcohol fallback
    return `Professional product photography of an alcohol bottle labeled "${cleanName}", elegant glass bottle, clean white background, studio lighting, high-quality commercial product shot, no people, no text overlay`;
  }

  private static getFallbackImage(category: string): string {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('wine') || categoryLower.includes('red') || categoryLower.includes('white')) {
      return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80";
    }
    
    if (categoryLower.includes('beer')) {
      return "https://images.unsplash.com/photo-1514361892635-ce9f1fecb6dd?auto=format&fit=crop&w=1000&q=80";
    }
    
    // Generic alcohol fallback
    return "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  }

  static clearCache(): void {
    this.cache.clear();
    console.log('🧹 AI Image Generation cache cleared');
  }

  static async clearBrowserImageCache(): Promise<void> {
    try {
      // Force browser to reload images by clearing cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('🧹 Browser image cache cleared successfully');
      }
    } catch (error) {
      console.error('Failed to clear browser cache:', error);
    }
  }
}
