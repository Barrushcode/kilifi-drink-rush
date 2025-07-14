import { supabase } from '@/integrations/supabase/client';

export const getCocktailImageUrl = (imageName: string): string => {
  const { data } = supabase.storage
    .from('cocktails')
    .getPublicUrl(`${imageName}.jpg`);
  return data.publicUrl;
};

export const loadCocktailImages = (): Record<string, string> => {
  const imageKeys = [
    'old-fashioned',
    'martini', 
    'manhattan',
    'negroni',
    'whiskey-sour',
    'daiquiri',
    'mojito',
    'cosmopolitan',
    'margarita',
    'espresso-martini',
    'moscow-mule',
    'pina-colada'
  ];

  const imageMapping: Record<string, string> = {};
  
  imageKeys.forEach(key => {
    imageMapping[key] = getCocktailImageUrl(key);
  });

  return imageMapping;
};