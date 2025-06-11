
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
      
      console.log('Starting to fetch products from allthealcoholicproducts table...');
      
      const { data, error } = await supabase
        .from('allthealcoholicproducts')
        .select('Title, Description, Price, "Product image URL"');

      console.log('Supabase response - data:', data);
      console.log('Supabase response - error:', error);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);
      console.log('Number of products fetched:', data?.length || 0);

      // Transform the data to match our Product interface
      const transformedProducts: Product[] = (data || []).map((product, index) => {
        console.log(`Transforming product ${index + 1}:`, product);
        return {
          id: index + 1, // Generate ID since the table doesn't have one
          name: product.Title || 'Unknown Product',
          price: product.Price ? product.Price.toString() : '0',
          description: product.Description || '',
          category: getCategoryFromName(product.Title),
          image: product['Product image URL'] || `https://images.unsplash.com/photo-${[
            '1569529465841-dfecdab7503b',
            '1551538827-9c037cb4f32a', 
            '1582553352566-7b4cdcc2379c',
            '1612528443702-f6741f70a049',
            '1558642891-54be180ea339',
            '1549796014-6aa0e2eaaa43'
          ][index % 6]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`
        };
      });

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
