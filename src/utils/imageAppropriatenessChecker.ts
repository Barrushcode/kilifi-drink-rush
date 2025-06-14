
import { AIImageGenerationService } from '@/services/aiImageGenerationService';

interface ImageCheckResult {
  isAppropriate: boolean;
  confidence: number;
  reason: string;
  suggestedAction: 'use' | 'fallback' | 'generate_ai';
}

export class ImageAppropriatenessChecker {
  
  static checkImageAppropriateness(imageUrl: string, productName: string, category: string): ImageCheckResult {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return {
        isAppropriate: false,
        confidence: 1.0,
        reason: 'No image URL provided',
        suggestedAction: 'generate_ai'
      };
    }

    const url = imageUrl.toLowerCase();
    const name = productName.toLowerCase();
    const cat = category.toLowerCase();

    // Check for obviously inappropriate domains/sources
    const badDomains = [
      'youtube.com', 'youtu.be', 'pinterest.com', 'facebook.com', 'instagram.com',
      'twitter.com', 'tiktok.com', 'reddit.com', 'blogspot.com', 'wordpress.com',
      'wikimedia.org', 'wikipedia.org', 'tumblr.com'
    ];

    if (badDomains.some(domain => url.includes(domain))) {
      return {
        isAppropriate: false,
        confidence: 0.9,
        reason: 'Image from inappropriate social/content domain',
        suggestedAction: 'generate_ai'
      };
    }

    // Check for inappropriate file indicators
    const inappropriateIndicators = [
      'fan', 'motor', 'engine', 'machine', 'tool', 'device', 'equipment',
      'person', 'people', 'face', 'selfie', 'portrait', 'avatar',
      'placeholder', 'no-image', 'default', 'generic', 'missing',
      'logo', 'icon', 'symbol', 'badge', 'emblem'
    ];

    const hasInappropriateKeywords = inappropriateIndicators.some(keyword => 
      url.includes(keyword) || 
      (productName && !productName.toLowerCase().includes(keyword) && url.includes(keyword))
    );

    if (hasInappropriateKeywords) {
      return {
        isAppropriate: false,
        confidence: 0.8,
        reason: 'Image appears to contain inappropriate content based on URL keywords',
        suggestedAction: 'generate_ai'
      };
    }

    // Check if image format is appropriate
    if (!url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)) {
      return {
        isAppropriate: false,
        confidence: 0.7,
        reason: 'Not a standard image format',
        suggestedAction: 'generate_ai'
      };
    }

    // If all checks pass, assume it's appropriate
    return {
      isAppropriate: true,
      confidence: 0.6,
      reason: 'Passed basic appropriateness checks',
      suggestedAction: 'use'
    };
  }

  static async getAppropriateImage(imageUrl: string, productName: string, category: string): Promise<string> {
    const check = this.checkImageAppropriateness(imageUrl, productName, category);
    
    if (check.isAppropriate && check.suggestedAction === 'use') {
      return imageUrl;
    }

    // Generate AI image for inappropriate content
    console.log(`🤖 Generating AI image for ${productName}: ${check.reason}`);
    const aiResult = await AIImageGenerationService.generateProductImage(productName, category);
    return aiResult.imageUrl;
  }
}
