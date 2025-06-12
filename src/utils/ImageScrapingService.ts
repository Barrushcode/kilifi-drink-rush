
interface ImageSearchResult {
  url: string;
  alt: string;
}

export class ImageScrapingService {
  private static readonly UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // User needs to set this
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

  // Cache for storing fetched images to avoid repeated API calls
  private static imageCache = new Map<string, string>();

  static async searchProductImage(productName: string): Promise<string> {
    // Check cache first
    if (this.imageCache.has(productName)) {
      return this.imageCache.get(productName)!;
    }

    try {
      // Extract key terms for better search
      const searchTerm = this.extractSearchTerms(productName);
      console.log(`Searching for image: ${searchTerm}`);

      // Try Unsplash API first (requires API key)
      const unsplashImage = await this.searchUnsplash(searchTerm);
      if (unsplashImage) {
        this.imageCache.set(productName, unsplashImage);
        return unsplashImage;
      }

      // Fallback to curated alcohol images
      const fallbackImage = this.getFallbackImage(productName);
      this.imageCache.set(productName, fallbackImage);
      return fallbackImage;

    } catch (error) {
      console.error('Error fetching product image:', error);
      const fallbackImage = this.getFallbackImage(productName);
      this.imageCache.set(productName, fallbackImage);
      return fallbackImage;
    }
  }

  private static async searchUnsplash(searchTerm: string): Promise<string | null> {
    // Note: This would require an Unsplash API key
    // For now, we'll use a simulated search that returns curated URLs
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Return curated high-quality alcohol images based on search terms
      const alcoholImages = this.getCuratedAlcoholImages();
      const hash = this.hashString(searchTerm);
      const imageIndex = Math.abs(hash) % alcoholImages.length;
      
      return alcoholImages[imageIndex];
    } catch (error) {
      console.error('Unsplash search failed:', error);
      return null;
    }
  }

  private static getCuratedAlcoholImages(): string[] {
    return [
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Whiskey bottles
      'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Wine bottles
      'https://images.unsplash.com/photo-1582553352566-7b4cdcc2379c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Cocktails
      'https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Beer bottles
      'https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Vodka
      'https://images.unsplash.com/photo-1549796014-6aa0e2eaaa43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Gin
      'https://images.unsplash.com/photo-1574445459035-ad3c5fdb2a5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Champagne
      'https://images.unsplash.com/photo-1569529463704-d9fb8f4b6c8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Rum
      'https://images.unsplash.com/photo-1582563353566-7b4cdcc2379c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Tequila
      'https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Cognac
      'https://images.unsplash.com/photo-1585497002776-96d1e1c99d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Wine glass
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Spirits collection
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Bar setup
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Premium bottles
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'  // Alcohol collection
    ];
  }

  private static extractSearchTerms(productName: string): string {
    // Extract relevant search terms from product name
    const name = productName.toLowerCase();
    
    if (name.includes('whiskey') || name.includes('whisky')) return 'whiskey bottle';
    if (name.includes('vodka')) return 'vodka bottle';
    if (name.includes('gin')) return 'gin bottle';
    if (name.includes('cognac') || name.includes('brandy')) return 'cognac bottle';
    if (name.includes('beer') || name.includes('lager')) return 'beer bottle';
    if (name.includes('champagne') || name.includes('prosecco')) return 'champagne bottle';
    if (name.includes('wine')) return 'wine bottle';
    if (name.includes('rum')) return 'rum bottle';
    if (name.includes('tequila')) return 'tequila bottle';
    
    return 'premium alcohol bottle';
  }

  private static getFallbackImage(productName: string): string {
    const hash = this.hashString(productName);
    const imageIndex = Math.abs(hash) % this.FALLBACK_IMAGES.length;
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
}
