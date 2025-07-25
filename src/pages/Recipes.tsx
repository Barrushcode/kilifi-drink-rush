import React, { useEffect } from 'react';
import CocktailRecipeDisplay from '@/components/CocktailRecipeDisplay';
import { uploadCocktailImagesToStorage } from '@/utils/uploadCocktailImages';

const Recipes = () => {
  useEffect(() => {
    // Upload cocktail images to storage when component mounts
    uploadCocktailImagesToStorage();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate">
      <div className="w-full pt-20">
        <CocktailRecipeDisplay />
      </div>
    </div>
  );
};
export default Recipes;