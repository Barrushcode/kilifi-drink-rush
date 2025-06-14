import { supabase } from '@/integrations/supabase/client';

interface ImageAnalysisResult {
  url: string;
  urlNumber: string;
  score: number;
  reasoning: string;
  isAppropriate: boolean;
}

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

export class IntelligentImageSelectionService {
  private static cache = new Map<string, ImageAnalysisResult>();

  static async analyzeImageAppropriatenessWithAI(imageUrl: string, productName: string): Promise<ImageAnalysisResult> {
    const cacheKey = `${imageUrl}_${productName}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      console.log(`🤖 AI analyzing image for: ${productName} - ${imageUrl}`);
      
      const { data, error } = await supabase.functions.invoke('analyze-product-image', {
        body: {
          imageUrl,
          productName
        }
      });

      if (error) {
        console.error('AI analysis error:', error);
        return {
          url: imageUrl,
          urlNumber: '1',
          score: 50,
          reasoning: 'Analysis failed, using fallback score',
          isAppropriate: true
        };
      }

      const result = {
        url: imageUrl,
        urlNumber: '1',
        score: data.score || 50,
        reasoning: data.reasoning || 'AI analysis completed',
        isAppropriate: data.isAppropriate !== false
      };

      this.cache.set(cacheKey, result);
      return result;

    } catch (error) {
      console.error('AI image analysis failed:', error);
      return {
        url: imageUrl,
        urlNumber: '1',
        score: 50,
        reasoning: 'Analysis error, using fallback',
        isAppropriate: true
      };
    }
  }

  static async selectBestImageWithAI(scrapedImage: ScrapedImage, productName: string): Promise<{ url: string; quality: string; urlNumber: string; reasoning?: string }> {
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

    // If only one URL, return it without AI analysis
    if (allUrls.length === 1) {
      return {
        url: allUrls[0].url,
        quality: "single-option",
        urlNumber: allUrls[0].number
      };
    }

    console.log(`🔍 AI analyzing ${allUrls.length} images for: ${productName}`);

    // Analyze first 5 images with AI (to avoid too many API calls)
    const imagesToAnalyze = allUrls.slice(0, 5);
    const analysisPromises = imagesToAnalyze.map(async (item) => {
      const analysis = await this.analyzeImageAppropriatenessWithAI(item.url, productName);
      return {
        ...analysis,
        urlNumber: item.number
      };
    });

    try {
      const analyses = await Promise.all(analysisPromises);
      
      // Filter appropriate images and sort by score
      const appropriateImages = analyses
        .filter(analysis => analysis.isAppropriate)
        .sort((a, b) => b.score - a.score);

      if (appropriateImages.length > 0) {
        const best = appropriateImages[0];
        console.log(`✨ AI selected best image (URL ${best.urlNumber}): ${best.reasoning}`);
        return {
          url: best.url,
          quality: "ai-selected",
          urlNumber: best.urlNumber,
          reasoning: best.reasoning
        };
      }

      // If no appropriate images found, return the first one
      return {
        url: allUrls[0].url,
        quality: "fallback-first",
        urlNumber: allUrls[0].number,
        reasoning: "No appropriate images found by AI, using first available"
      };

    } catch (error) {
      console.error('AI image selection failed:', error);
      return {
        url: allUrls[0].url,
        quality: "ai-error-fallback",
        urlNumber: allUrls[0].number,
        reasoning: "AI analysis failed, using first available"
      };
    }
  }

  static clearCache(): void {
    this.cache.clear();
    console.log('🧹 Intelligent Image Selection cache cleared');
  }
}
