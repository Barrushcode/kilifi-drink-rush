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
    "name": "Premium Cocktail Recipes - Old Fashioned, Martini, Manhattan, Negroni, Mojito, Margarita & More",
    "description": "12 premium cocktail recipes including Old Fashioned, Martini, Manhattan, Negroni, Whiskey Sour, Daiquiri, Mojito, Cosmopolitan, Margarita, Espresso Martini, Moscow Mule, and Piña Colada with ingredient delivery in Kilifi County",
    "url": "https://barrush.lovable.app/recipes",
    "numberOfItems": 12,
    "itemListElement": [
      {
        "@type": "Recipe",
        "name": "Old Fashioned Cocktail Recipe",
        "description": "Classic Old Fashioned recipe with bourbon whiskey, bitters, and sugar",
        "recipeCategory": "Classic Cocktail",
        "recipeCuisine": "American"
      },
      {
        "@type": "Recipe",
        "name": "Martini Cocktail Recipe", 
        "description": "Perfect classic martini recipe with premium gin and dry vermouth",
        "recipeCategory": "Classic Cocktail",
        "recipeCuisine": "International"
      },
      {
        "@type": "Recipe",
        "name": "Manhattan Cocktail Recipe",
        "description": "New York's signature Manhattan cocktail with rye whiskey and sweet vermouth",
        "recipeCategory": "Classic Cocktail", 
        "recipeCuisine": "American"
      },
      {
        "@type": "Recipe",
        "name": "Negroni Cocktail Recipe",
        "description": "Italian Negroni aperitif with gin, Campari, and sweet vermouth",
        "recipeCategory": "Classic Cocktail",
        "recipeCuisine": "Italian"
      },
      {
        "@type": "Recipe",
        "name": "Mojito Cocktail Recipe",
        "description": "Cuban Mojito with white rum, fresh mint, lime, and soda water",
        "recipeCategory": "Modern Cocktail",
        "recipeCuisine": "Cuban"
      },
      {
        "@type": "Recipe",
        "name": "Margarita Cocktail Recipe", 
        "description": "Classic Margarita with tequila, Cointreau, and fresh lime juice",
        "recipeCategory": "Modern Cocktail",
        "recipeCuisine": "Mexican"
      },
      {
        "@type": "Recipe",
        "name": "Espresso Martini Recipe",
        "description": "Espresso Martini with vodka, coffee liqueur, and fresh espresso",
        "recipeCategory": "Modern Cocktail",
        "recipeCuisine": "International"
      }
    ]
  };

  return <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <SEOHead
        title="Old Fashioned Martini Manhattan Negroni Mojito Margarita Recipes | Kilifi Ingredient Delivery | Barrush"
        description="12 premium cocktail recipes: Old Fashioned, Martini, Manhattan, Negroni, Whiskey Sour, Daiquiri, Mojito, Cosmopolitan, Margarita, Espresso Martini, Moscow Mule, Piña Colada. All ingredients delivered in Kilifi County."
        keywords="Old Fashioned recipe Kilifi, Martini recipe delivery Kilifi, Manhattan cocktail Kilifi, Negroni recipe Kenya, Whiskey Sour ingredients Kilifi, Daiquiri recipe delivery, Mojito recipe Kilifi, Cosmopolitan ingredients Kenya, Margarita recipe delivery Kilifi, Espresso Martini Kilifi, Moscow Mule recipe Kenya, Piña Colada ingredients Kilifi, cocktail recipes Kenya, premium cocktail delivery Kilifi County"
        url="https://barrush.lovable.app/recipes"
        structuredData={recipesStructuredData}
      />
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen pt-20">
        
        <CocktailRecipesSection />
      </div>
    </div>;
};
export default Recipes;