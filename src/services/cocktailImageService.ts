// Import all cocktail images as ES6 modules
import cosmopolitanImg from '@/assets/cosmopolitan.jpg';
import daiquiriImg from '@/assets/daiquiri.jpg';
import espressoMartiniImg from '@/assets/espresso-martini.jpg';
import manhattanImg from '@/assets/manhattan.jpg';
import margaritaImg from '@/assets/margarita.jpg';
import martiniImg from '@/assets/martini.jpg';
import mojitoImg from '@/assets/mojito.jpg';
import moscowMuleImg from '@/assets/moscow-mule.jpg';
import negroniImg from '@/assets/negroni.jpg';
import pinaColadaImg from '@/assets/pina-colada.jpg';
import whiskeySourImg from '@/assets/whiskey-sour.jpg';

// Map cocktail image filenames to imported images
const cocktailImageMap: Record<string, string> = {
  'cosmopolitan.jpg': cosmopolitanImg,
  'daiquiri.jpg': daiquiriImg,
  'espresso-martini.jpg': espressoMartiniImg,
  'manhattan.jpg': manhattanImg,
  'margarita.jpg': margaritaImg,
  'martini.jpg': martiniImg,
  'mojito.jpg': mojitoImg,
  'moscow-mule.jpg': moscowMuleImg,
  'negroni.jpg': negroniImg,
  'pina-colada.jpg': pinaColadaImg,
  'whiskey-sour.jpg': whiskeySourImg,
};

export const getCocktailImageUrl = (imageName: string): string => {
  // Use local images instead of Supabase storage
  return cocktailImageMap[imageName] || cosmopolitanImg; // fallback to cosmopolitan
};

export const loadCocktailImages = (): Record<string, string> => {
  return cocktailImageMap;
};