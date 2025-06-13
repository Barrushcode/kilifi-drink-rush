
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

interface ScrapedImage {
  id: number;
  'Product Name': string | null;
  'Image URL 1': string;
  'Image URL 2': string | null;
  'Image URL 3': string | null;
  'Image URL 4': string | null;
  'Image URL 5': string | null;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced category detection with mini-category support
  const getCategoryFromName = (name: string, price: number): string => {
    if (!name) return 'Other';
    const lowerName = name.toLowerCase();
    
    // Check for pack/set indicators first
    const isMultiPack = lowerName.includes('pack') || lowerName.includes('set') || 
                      lowerName.includes('bundle') || lowerName.includes('case') ||
                      /\d+\s*(x|×)\s*\d+/i.test(lowerName); // patterns like "6x330ml"
    
    // Beer categories
    if (lowerName.includes('beer') || lowerName.includes('lager') || lowerName.includes('ale')) {
      if (isMultiPack || lowerName.includes('6') || price > 2000) {
        return '6-Packs & Beer Sets';
      }
      return 'Beer';
    }
    
    // Wine categories
    if (lowerName.includes('wine') || lowerName.includes('merlot') || lowerName.includes('cabernet') || 
        lowerName.includes('chardonnay') || lowerName.includes('sauvignon')) {
      if (isMultiPack || lowerName.includes('set') || price > 3000) {
        return 'Wine Sets & Collections';
      }
      return 'Wine';
    }
    
    // Whiskey/Whisky categories
    if (lowerName.includes('whiskey') || lowerName.includes('whisky') || lowerName.includes('bourbon') || 
        lowerName.includes('scotch')) {
      if (isMultiPack || lowerName.includes('set') || price > 5000) {
        return 'Whiskey Collections';
      }
      return 'Whiskey';
    }
    
    // Vodka categories
    if (lowerName.includes('vodka')) {
      if (isMultiPack || price > 4000) {
        return 'Vodka Premium Sets';
      }
      return 'Vodka';
    }
    
    // Champagne/Sparkling
    if (lowerName.includes('champagne') || lowerName.includes('prosecco') || lowerName.includes('sparkling')) {
      if (isMultiPack || price > 4000) {
        return 'Champagne & Sparkling Sets';
      }
      return 'Champagne';
    }
    
    // Gin categories
    if (lowerName.includes('gin')) {
      if (isMultiPack || price > 3500) {
        return 'Gin Premium Collections';
      }
      return 'Gin';
    }
    
    // Cognac/Brandy
    if (lowerName.includes('cognac') || lowerName.includes('brandy') || lowerName.includes('hennessy') || 
        lowerName.includes('remy martin')) {
      return 'Cognac & Premium Brandy';
    }
    
    // Rum categories
    if (lowerName.includes('rum')) {
      if (isMultiPack || price > 3000) {
        return 'Rum Collections';
      }
      return 'Rum';
    }
    
    // Tequila categories
    if (lowerName.includes('tequila')) {
      if (isMultiPack || price > 3000) {
        return 'Tequila Premium Sets';
      }
      return 'Tequila';
    }
    
    // Default premium category for expensive items
    if (price > 5000) {
      return 'Premium Collection';
    }
    
    return 'Spirits';
  };

  // Normalize strings for better matching
  const normalizeString = (str: string): string => {
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
  const extractBrand = (name: string): string => {
    const normalized = normalizeString(name);
    const words = normalized.split(' ');
    // Usually brand is the first 1-2 words
    return words.slice(0, 2).join(' ');
  };

  // Extract volume/size from product name
  const extractVolume = (name: string): string | null => {
    const volumeMatch = name.match(/(\d+(?:\.\d+)?)\s*(ml|l|ML|L)\b/i);
    return volumeMatch ? volumeMatch[0].toLowerCase() : null;
  };

  // Calculate string similarity (simple implementation)
  const calculateSimilarity = (str1: string, str2: string): number => {
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

  // Improved image matching function with multiple strategies
  const findMatchingImage = (productName: string, scrapedImages: ScrapedImage[]): { url: string; matchLevel: string } => {
    if (!scrapedImages.length) {
      return {
        url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        matchLevel: "fallback"
      };
    }

    console.log(`🔍 Finding match for product: "${productName}"`);
    
    // Level 1: Exact match (case-insensitive)
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        if (normalizeString(productName) === normalizeString(img['Product Name'])) {
          console.log(`✅ Level 1 - Exact match found: "${img['Product Name']}"`);
          return { url: img['Image URL 1'], matchLevel: "exact" };
        }
      }
    }

    // Level 2: High similarity match (>0.8)
    let bestMatch: { image: ScrapedImage; similarity: number } | null = null;
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        const similarity = calculateSimilarity(productName, img['Product Name']);
        if (similarity > 0.8 && (!bestMatch || similarity > bestMatch.similarity)) {
          bestMatch = { image: img, similarity };
        }
      }
    }
    
    if (bestMatch) {
      console.log(`✅ Level 2 - High similarity match (${bestMatch.similarity.toFixed(2)}): "${bestMatch.image['Product Name']}"`);
      return { url: bestMatch.image['Image URL 1'], matchLevel: "high-similarity" };
    }

    // Level 3: Brand + Volume match
    const productBrand = extractBrand(productName);
    const productVolume = extractVolume(productName);
    
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        const imageBrand = extractBrand(img['Product Name']);
        const imageVolume = extractVolume(img['Product Name']);
        
        if (productBrand && imageBrand && 
            normalizeString(productBrand) === normalizeString(imageBrand) &&
            productVolume && imageVolume &&
            normalizeString(productVolume) === normalizeString(imageVolume)) {
          console.log(`✅ Level 3 - Brand + Volume match: "${img['Product Name']}"`);
          return { url: img['Image URL 1'], matchLevel: "brand-volume" };
        }
      }
    }

    // Level 4: Brand-only match
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        const imageBrand = extractBrand(img['Product Name']);
        
        if (productBrand && imageBrand && 
            normalizeString(productBrand) === normalizeString(imageBrand)) {
          console.log(`✅ Level 4 - Brand match: "${img['Product Name']}"`);
          return { url: img['Image URL 1'], matchLevel: "brand-only" };
        }
      }
    }

    // Level 5: Partial word match (>0.4 similarity)
    for (const img of scrapedImages) {
      if (img['Product Name']) {
        const similarity = calculateSimilarity(productName, img['Product Name']);
        if (similarity > 0.4 && (!bestMatch || similarity > bestMatch.similarity)) {
          bestMatch = { image: img, similarity };
        }
      }
    }
    
    if (bestMatch) {
      console.log(`✅ Level 5 - Partial match (${bestMatch.similarity.toFixed(2)}): "${bestMatch.image['Product Name']}"`);
      return { url: bestMatch.image['Image URL 1'], matchLevel: "partial" };
    }

    // Level 6: Category-based fallback
    const category = getCategoryFromName(productName, 0);
    const categoryMatch = scrapedImages.find(img => 
      img['Product Name'] && getCategoryFromName(img['Product Name'], 0) === category
    );

    if (categoryMatch) {
      console.log(`✅ Level 6 - Category match (${category}): "${categoryMatch['Product Name']}"`);
      return { url: categoryMatch['Image URL 1'], matchLevel: "category" };
    }

    // Final fallback
    console.log(`❌ No match found for: "${productName}" - using fallback image`);
    return {
      url: scrapedImages[0]?.['Image URL 1'] || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      matchLevel: "fallback"
    };
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Fetching all products and images...');
      
      // Fetch all products and scraped images in parallel
      const [productsResponse, imagesResponse] = await Promise.all([
        supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price')
          .order('Price', { ascending: false })
          .limit(1000), // Show up to 1000 products
        supabase
          .from('scraped product images')
          .select('id, "Product Name", "Image URL 1", "Image URL 2", "Image URL 3", "Image URL 4", "Image URL 5"')
      ]);

      if (productsResponse.error) {
        console.error('❌ Products fetch error:', productsResponse.error);
        throw productsResponse.error;
      }

      if (imagesResponse.error) {
        console.error('❌ Images fetch error:', imagesResponse.error);
        throw imagesResponse.error;
      }

      console.log(`📦 Successfully fetched ${productsResponse.data?.length} products`);
      console.log(`🖼️ Successfully fetched ${imagesResponse.data?.length} images`);

      const scrapedImages = imagesResponse.data || [];

      // Log some example image names for debugging
      console.log('📋 Sample image names:', scrapedImages.slice(0, 5).map(img => img['Product Name']).filter(Boolean));

      // Transform the products data and match with images
      const transformedProducts: Product[] = (productsResponse.data || []).map((product, index) => {
        const productPrice = Number(product.Price) || 0;
        const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice);
        const { url: productImage, matchLevel } = findMatchingImage(product.Title || 'Unknown Product', scrapedImages);
        
        console.log(`📊 Product: "${product.Title}" | Price: ${productPrice} | Category: ${category} | Match: ${matchLevel}`);
        
        return {
          id: index + 1,
          name: product.Title || 'Unknown Product',
          price: `KES ${productPrice.toLocaleString()}`,
          description: product.Description || 'Quality selection for every taste',
          category,
          image: productImage
        };
      });

      console.log(`✨ Successfully processed ${transformedProducts.length} products with improved image matching`);
      setProducts(transformedProducts);
    } catch (error) {
      console.error('💥 Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};
