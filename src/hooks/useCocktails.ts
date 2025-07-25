
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CocktailData {
  Name: string;
  'Recipe (Ingredients)': string;
  Instructions: string;
  image_filename: string;
  Image: string;
}

export const useCocktails = () => {
  const [cocktails, setCocktails] = useState<CocktailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('Cocktails page')
          .select('*')
          .order('Name');

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('✅ Fetched cocktails data:', data);
        // Map the data to ensure all required fields are present
        const cocktailsData = (data || []).map((item: any) => ({
          Name: item.Name,
          'Recipe (Ingredients)': item['Recipe (Ingredients)'],
          Instructions: item.Instructions,
          image_filename: item.image_filename || '',
          Image: item.Image || ''
        }));
        setCocktails(cocktailsData);
      } catch (err) {
        console.error('Error fetching cocktails:', err);
        setError(err instanceof Error ? err.message : 'Failed to load cocktails');
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, []);

  return { cocktails, loading, error };
};

