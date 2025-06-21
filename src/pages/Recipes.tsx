
import React from 'react';
import CocktailRecipesSection from '@/components/CocktailRecipesSection';

const Recipes = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen pt-20">
        <CocktailRecipesSection />
      </div>
    </div>
  );
};

export default Recipes;
