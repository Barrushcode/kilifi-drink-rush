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
        const { data, error } = await supabase
          .from('Cocktails page')
          .select('*')
          .order('Name');

        if (error) throw error;
        setCocktails(data || []);
      } catch (err) {
        console.error('Error fetching cocktails:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, []);

  return { cocktails, loading, error };
};

export const getCocktailImageUrl = (filename: string): string => {
  if (!filename) return '';
  
  const { data } = supabase.storage
    .from('cocktailimages')
    .getPublicUrl(filename);
  
  return data.publicUrl;
};