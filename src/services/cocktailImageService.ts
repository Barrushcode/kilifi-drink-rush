import { supabase } from '@/integrations/supabase/client';

// Fallback image for cocktails
import cosmopolitanImg from '@/assets/cosmopolitan.jpg';

export const getCocktailImageUrl = (imageName: string): string => {
  if (!imageName) return cosmopolitanImg;
  
  // Generate Supabase storage URL for cocktail images
  const { data } = supabase.storage.from('cocktails').getPublicUrl(imageName);
  
  return data?.publicUrl || cosmopolitanImg;
};

// Get all available cocktail images from storage
export const getAvailableCocktailImages = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.storage.from('cocktails').list();
    if (error) throw error;
    
    return data?.map(file => file.name) || [];
  } catch (error) {
    console.error('[COCKTAIL IMAGES] Error fetching image list:', error);
    return [];
  }
};

export const loadCocktailImages = (): Record<string, string> => {
  // Legacy function - now uses storage bucket dynamically
  return {};
};