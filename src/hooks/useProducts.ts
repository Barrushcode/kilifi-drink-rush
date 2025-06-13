
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

  // Helper function to determine category from product name
  const getCategoryFromName = (name: string): string => {
    if (!name) return 'Other';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('whiskey') || lowerName.includes('whisky')) return 'Whiskey';
    if (lowerName.includes('vodka')) return 'Vodka';
    if (lowerName.includes('gin')) return 'Gin';
    if (lowerName.includes('cognac') || lowerName.includes('brandy')) return 'Cognac';
    if (lowerName.includes('beer') || lowerName.includes('lager')) return 'Beer';
    if (lowerName.includes('champagne') || lowerName.includes('prosecco')) return 'Champagne';
    if (lowerName.includes('wine')) return 'Wine';
    if (lowerName.includes('rum')) return 'Rum';
    if (lowerName.includes('tequila')) return 'Tequila';
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
    const category = getCategoryFromName(productName);
    const categoryMatch = scrapedImages.find(img => 
      img['Product Name'] && getCategoryFromName(img['Product Name']) === category
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
      
      console.log('Fetching products and images...');
      
      // Fetch products and scraped images in parallel
      const [productsResponse, imagesResponse] = await Promise.all([
        supabase
          .from('allthealcoholicproducts')
          .select('Title, Description, Price')
          .limit(50),
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

      console.log('Successfully fetched products:', productsResponse.data);
      console.log('Successfully fetched images:', imagesResponse.data);

      const scrapedImages = imagesResponse.data || [];

      // Transform the products data and match with images
      const transformedProducts: Product[] = (productsResponse.data || []).map((product, index) => {
        const category = getCategoryFromName(product.Title);
        const productImage = findMatchingImage(product.Title || 'Unknown Product', scrapedImages);
        
        return {
          id: index + 1,
          name: product.Title || 'Unknown Product',
          price: product.Price ? `KES ${Number(product.Price).toLocaleString()}` : 'Price on request',
          description: product.Description || 'No description available',
          category,
          image: productImage
        };
      });

      console.log('Transformed products with matched images:', transformedProducts);
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
