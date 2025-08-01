
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('productprice')
          .select('Category')
          .not('Category', 'is', null);

        if (error) throw error;

        // Get unique categories
        const uniqueCategories = Array.from(
          new Set(data.map(item => item.Category).filter(Boolean))
        ).sort();

        setCategories(['All', ...uniqueCategories]);
        console.log('📋 Fetched categories:', uniqueCategories);
      } catch (error) {
        console.error('💥 Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
