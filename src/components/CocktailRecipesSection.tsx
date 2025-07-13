
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { downloadRecipeAsText } from '@/utils/recipeDownloadUtils';
import RecipeGrid from './RecipeGrid';
import { classicRecipes, modernRecipes } from '@/data/cocktailRecipes';
import { loadCocktailImages } from '@/services/cocktailImageService';

const CocktailRecipesSection: React.FC = () => {
  const [cocktailImages, setCocktailImages] = useState<Record<string, string>>({});

  useEffect(() => {
    setCocktailImages(loadCocktailImages());
  }, []);

  const handleDownload = (recipe: any) => {
    downloadRecipeAsText(recipe);
  };

  const mapRecipesWithImages = (recipes: typeof classicRecipes) => {
    return recipes.map(recipe => ({
      ...recipe,
      image: cocktailImages[recipe.imageKey] || recipe.fallbackImage
    }));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative min-h-screen">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif text-barrush-platinum">
            Master Cocktail Recipes
          </h1>
          <div className="w-24 h-0.5 bg-neon-pink mx-auto mb-6"></div>
          <p className="text-lg text-barrush-platinum/80 max-w-3xl mx-auto leading-relaxed font-iphone">
            Perfect the timeless classics and modern favorites with our professional mixology guides. 
            Download each recipe for your personal collection.
          </p>
        </div>
        
        <Tabs defaultValue="classic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 bg-glass-effect border border-barrush-steel/30 max-w-md mx-auto">
            <TabsTrigger 
              value="classic" 
              className="text-base font-semibold bg-transparent text-barrush-platinum data-[state=active]:bg-neon-pink data-[state=active]:text-white font-iphone transition-all duration-300"
            >
              Classic Cocktails
            </TabsTrigger>
            <TabsTrigger 
              value="modern" 
              className="text-base font-semibold bg-transparent text-barrush-platinum data-[state=active]:bg-neon-pink data-[state=active]:text-white font-iphone transition-all duration-300"
            >
              Modern Favorites
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="classic" className="animate-fade-in">
            <RecipeGrid recipes={mapRecipesWithImages(classicRecipes)} onDownload={handleDownload} />
          </TabsContent>
          
          <TabsContent value="modern" className="animate-fade-in">
            <RecipeGrid recipes={mapRecipesWithImages(modernRecipes)} onDownload={handleDownload} />
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-20">
          <div className="bg-glass-effect border border-barrush-steel/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-4 font-serif text-barrush-platinum">
              🍸 Share Your Craft
            </h3>
            <p className="text-barrush-platinum/80 text-lg leading-relaxed font-iphone">
              Tag <span className="font-bold text-neon-pink">@BarrushDelivery</span> 
              {" "}and showcase your cocktail mastery using our premium spirits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CocktailRecipesSection;
