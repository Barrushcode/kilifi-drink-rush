
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CocktailData {
  Name: string;
  'Recipe (Ingredients)': string;
  Instructions: string;
  image_filename: string;
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
          .select(`
            Name,
            "Recipe (Ingredients)",
            Instructions,
            image_filename
          `)
          .order('Name');

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('✅ Fetched cocktails data:', data);
        setCocktails(data || []);
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

