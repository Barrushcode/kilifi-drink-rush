
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ImageScrapingService } from '@/utils/ImageScrapingService';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products from allthealcoholicproducts table...');
      
      const { data, error } = await supabase
        .from('allthealcoholicproducts')
        .select('Title, Description, Price')
        .limit(50); // Limit to 50 products for better performance

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully fetched data:', data);

      // Transform the data and fetch appropriate images
      const transformedProducts: Product[] = await Promise.all(
        (data || []).map(async (product, index) => {
          // Fetch appropriate image for the product
          const productImage = await ImageScrapingService.searchProductImage(product.Title || '');
          
          return {
            id: index + 1,
            name: product.Title || 'Unknown Product',
            price: product.Price ? `KES ${Number(product.Price).toLocaleString()}` : 'Price on request',
            description: product.Description || 'No description available',
            category: getCategoryFromName(product.Title),
            image: productImage
          };
        })
      );

      console.log('Transformed products with images:', transformedProducts);
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
