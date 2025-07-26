import React, { useEffect } from 'react';
import CocktailRecipesSection from '@/components/CocktailRecipesSection';
import CocktailImageUpload from '@/components/CocktailImageUpload';
import { uploadCocktailImagesToStorage } from '@/utils/uploadCocktailImages';
import SEOHead from '@/components/SEOHead';

const Recipes = () => {
  useEffect(() => {
    // Upload cocktail images to storage when component mounts
    uploadCocktailImagesToStorage();
  }, []);

  const recipesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Cocktail Recipes Collection",
    "description": "Premium cocktail recipes with ingredient delivery available in Kilifi County",
    "url": "https://barrush.lovable.app/recipes",
    "numberOfItems": 12,
    "itemListElement": [
      {
        "@type": "Recipe",
        "name": "Classic Martini",
        "description": "Perfect classic martini recipe with premium gin and vermouth",
        "recipeCategory": "Cocktail",
        "recipeCuisine": "International"
      },
      {
        "@type": "Recipe", 
        "name": "Mojito",
        "description": "Fresh and refreshing mojito with mint, lime, and premium rum",
        "recipeCategory": "Cocktail",
        "recipeCuisine": "Cuban"
      }
    ]
  };

  return <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <SEOHead
        title="Cocktail Recipes | Premium Ingredients Delivery Kilifi | Barrush"
        description="Discover amazing cocktail recipes and order premium ingredients for delivery in Kilifi County. Martini, Mojito, Margarita recipes with all ingredients available for fast delivery."
        keywords="cocktail recipes Kilifi, cocktail ingredients delivery, martini recipe, mojito recipe, margarita recipe, cocktail supplies Kilifi, mixology ingredients Kenya, premium cocktail delivery Kilifi"
        url="https://barrush.lovable.app/recipes"
        structuredData={recipesStructuredData}
      />
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen pt-20">
        
        <CocktailRecipesSection />
      </div>
    </div>;
};
export default Recipes;