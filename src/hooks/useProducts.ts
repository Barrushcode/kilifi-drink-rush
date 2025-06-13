
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

  // Helper function to find best matching image for a product
  const findMatchingImage = (productName: string, scrapedImages: ScrapedImage[]): string => {
    const lowerProductName = productName.toLowerCase();
    
    // First, try to find exact or close matches
    const exactMatch = scrapedImages.find(img => 
      img['Product Name'] && img['Product Name'].toLowerCase().includes(lowerProductName)
    );
    
    if (exactMatch) {
      return exactMatch['Image URL 1'];
    }

    // Try to find partial matches based on product type
    const category = getCategoryFromName(productName, 0);
    const categoryMatch = scrapedImages.find(img => 
      img['Product Name'] && getCategoryFromName(img['Product Name'], 0) === category
    );

    if (categoryMatch) {
      return categoryMatch['Image URL 1'];
    }

    // Return first available image as fallback
    return scrapedImages[0]?.['Image URL 1'] || "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching all products and images...');
      
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
        console.error('Products fetch error:', productsResponse.error);
        throw productsResponse.error;
      }

      if (imagesResponse.error) {
        console.error('Images fetch error:', imagesResponse.error);
        throw imagesResponse.error;
      }

      console.log(`Successfully fetched ${productsResponse.data?.length} products:`, productsResponse.data);
      console.log('Successfully fetched images:', imagesResponse.data);

      const scrapedImages = imagesResponse.data || [];

      // Transform the products data and match with images
      const transformedProducts: Product[] = (productsResponse.data || []).map((product, index) => {
        const productPrice = Number(product.Price) || 0;
        const category = getCategoryFromName(product.Title || 'Unknown Product', productPrice);
        const productImage = findMatchingImage(product.Title || 'Unknown Product', scrapedImages);
        
        console.log(`Product: ${product.Title}, Price: ${productPrice}, Category: ${category}`);
        
        return {
          id: index + 1,
          name: product.Title || 'Unknown Product',
          price: `KES ${productPrice.toLocaleString()}`,
          description: product.Description || 'Quality selection for every taste',
          category,
          image: productImage
        };
      });

      console.log('Transformed products with enhanced categories:', transformedProducts);
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
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
