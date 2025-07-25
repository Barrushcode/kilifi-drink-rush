import { supabase } from '@/integrations/supabase/client';

// Mapping of image files to cocktail names
const imageMapping = {
  'public/lovable-uploads/44a4a4ba-cffd-475b-9ee9-b01cb49950c1.png': 'PinaColada.jpg',
  'public/lovable-uploads/6e95cca3-f825-42e2-b3c2-f1c2e836bf92.png': 'EspressoMartini.jpg', 
  'public/lovable-uploads/5b21662a-a35d-4c75-bbe8-0bb916cc4f7b.png': 'Margarita.jpg',
  'public/lovable-uploads/33909e07-a832-454a-ac10-ab43b4d0fc7e.png': 'Cosmopolitan.jpg',
  'public/lovable-uploads/dc8975f1-e8c3-4262-a472-de4b8e371d89.png': 'Mojito.jpg',
  'public/lovable-uploads/197e543c-a153-452e-98ee-6b22f10be709.png': 'MoscowMule.jpg',
  'public/lovable-uploads/dfe6e0db-c708-479e-96b3-1f04e7ac75f2.png': 'WhiskeySour.jpg',
  'public/lovable-uploads/5dce9d14-2121-4d0e-9b9a-24217fb4cb0f.png': 'Manhattan.jpg'
};

export const uploadCocktailImagesToStorage = async () => {
  try {
    console.log('Starting cocktail image upload to storage...');
    
    for (const [localPath, fileName] of Object.entries(imageMapping)) {
      try {
        // Fetch the image from the public folder
        const response = await fetch(localPath);
        if (!response.ok) {
          console.error(`Failed to fetch ${localPath}:`, response.statusText);
          continue;
        }
        
        const blob = await response.blob();
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('cocktails')
          .upload(fileName, blob, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) {
          console.error(`Error uploading ${fileName}:`, error);
        } else {
          console.log(`✅ Successfully uploaded ${fileName}`);
        }
      } catch (err) {
        console.error(`Error processing ${localPath}:`, err);
      }
    }
    
    console.log('Cocktail image upload process completed');
  } catch (error) {
    console.error('Error in uploadCocktailImagesToStorage:', error);
  }
};