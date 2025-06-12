
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

      // Transform the data to match our Product interface
      const transformedProducts: Product[] = (data || []).map((product, index) => ({
        id: index + 1,
        name: product.Title || 'Unknown Product',
        price: product.Price ? `KES ${Number(product.Price).toLocaleString()}` : 'Price on request',
        description: product.Description || 'No description available',
        category: getCategoryFromName(product.Title),
        image: `https://images.unsplash.com/photo-${[
          '1569529465841-dfecdab7503b',
          '1551538827-9c037cb4f32a', 
          '1582553352566-7b4cdcc2379c',
          '1612528443702-f6741f70a049',
          '1558642891-54be180ea339',
          '1549796014-6aa0e2eaaa43',
          '1574445459035-ad3c5fdb2a5e',
          '1569529463704-d9fb8f4b6c8b',
          '1582563353566-7b4cdcc2379c',
          '1612528443702-f6741f70a049'
        ][index % 10]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`
      }));

      console.log('Transformed products:', transformedProducts);
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
