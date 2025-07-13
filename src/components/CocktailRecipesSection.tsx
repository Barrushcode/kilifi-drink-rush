
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { downloadRecipeAsText } from '@/utils/recipeDownloadUtils';
import OptimizedImage from '@/components/OptimizedImage';
import { supabase } from '@/integrations/supabase/client';

const CocktailRecipesSection: React.FC = () => {
  const [cocktailImages, setCocktailImages] = useState<Record<string, string>>({});

  // Get image URL from Supabase storage
  const getCocktailImageUrl = (imageName: string) => {
    const { data } = supabase.storage
      .from('cocktail')
      .getPublicUrl(imageName);
    return data.publicUrl;
  };

  useEffect(() => {
    // Load all cocktail images from storage
    const imageMapping: Record<string, string> = {
      'old-fashioned': getCocktailImageUrl('old-fashioned.jpg'),
      'martini': getCocktailImageUrl('martini.jpg'),
      'manhattan': getCocktailImageUrl('manhattan.jpg'),
      'negroni': getCocktailImageUrl('negroni.jpg'),
      'whiskey-sour': getCocktailImageUrl('whiskey-sour.jpg'),
      'daiquiri': getCocktailImageUrl('daiquiri.jpg'),
      'mojito': getCocktailImageUrl('mojito.jpg'),
      'cosmopolitan': getCocktailImageUrl('cosmopolitan.jpg'),
      'margarita': getCocktailImageUrl('margarita.jpg'),
      'espresso-martini': getCocktailImageUrl('espresso-martini.jpg'),
      'moscow-mule': getCocktailImageUrl('moscow-mule.jpg'),
      'pina-colada': getCocktailImageUrl('pina-colada.jpg'),
    };
    setCocktailImages(imageMapping);
  }, []);

  const classicRecipes = [{
    name: "Old Fashioned",
    image: cocktailImages['old-fashioned'] || "/lovable-uploads/d3fc1dba-2426-4f52-b8af-cb3f2972d874.png",
    ingredients: ["2oz Bourbon Whiskey", "2 dashes Angostura Bitters", "1 sugar cube", "Orange peel", "Ice"],
    description: "The timeless classic that never goes out of style. A perfect balance of whiskey, bitters, and sweetness.",
    difficulty: "Easy",
    time: "3 mins"
  }, {
    name: "Martini",
    image: cocktailImages['martini'] || "/lovable-uploads/eed458a0-c82d-483b-b67a-887e67da1b9c.png",
    ingredients: ["2.5oz Gin", "0.5oz Dry Vermouth", "Lemon twist or olive", "Ice"],
    description: "Sophistication in a glass - shaken or stirred to perfection.",
    difficulty: "Medium",
    time: "2 mins"
  }, {
    name: "Manhattan",
    image: cocktailImages['manhattan'] || "/lovable-uploads/3d2d9178-c92a-47f5-b7cb-43eb099a90ff.png",
    ingredients: ["2oz Rye Whiskey", "1oz Sweet Vermouth", "2 dashes Angostura Bitters", "Cherry garnish"],
    description: "New York's signature cocktail with perfect balance and elegance.",
    difficulty: "Easy",
    time: "3 mins"
  }, {
    name: "Negroni",
    image: cocktailImages['negroni'] || "/lovable-uploads/6ecc4d5a-c5bb-4f87-bc26-efe644461c76.png",
    ingredients: ["1oz Gin", "1oz Campari", "1oz Sweet Vermouth", "Orange peel"],
    description: "Italian aperitif with a perfect bitter-sweet harmony.",
    difficulty: "Easy",
    time: "2 mins"
  }, {
    name: "Whiskey Sour",
    image: cocktailImages['whiskey-sour'] || "/lovable-uploads/a3a04ef4-78fa-4911-8f2f-be21369dba75.png",
    ingredients: ["2oz Bourbon", "1oz Fresh lemon juice", "0.75oz Simple syrup", "Egg white (optional)", "Cherry garnish"],
    description: "Classic sour cocktail with perfect sweet-tart balance.",
    difficulty: "Medium",
    time: "4 mins"
  }, {
    name: "Daiquiri",
    image: cocktailImages['daiquiri'] || "/lovable-uploads/72bc2b2d-1f24-4b19-8f90-68e1f260d2b1.png",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "0.75oz Simple syrup", "Lime wheel"],
    description: "Ernest Hemingway's favorite - clean and refreshing.",
    difficulty: "Easy",
    time: "2 mins"
  }];

  const modernRecipes = [{
    name: "Mojito",
    image: cocktailImages['mojito'] || "/lovable-uploads/d5a394f1-75bd-4021-b1ee-89deaea33ab6.png",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "2 tsp Sugar", "6-8 Fresh mint leaves", "Soda water", "Ice"],
    description: "Cuban classic with refreshing mint and lime - perfect for summer.",
    difficulty: "Medium",
    time: "5 mins"
  }, {
    name: "Cosmopolitan",
    image: cocktailImages['cosmopolitan'] || "/lovable-uploads/96d89dca-3bcc-4670-b40b-a7bf842d8f48.png",
    ingredients: ["2oz Vodka", "1oz Cointreau", "0.5oz Fresh lime juice", "0.25oz Cranberry juice", "Lime wheel"],
    description: "Pink perfection made famous by Sex and the City.",
    difficulty: "Easy",
    time: "3 mins"
  }, {
    name: "Margarita",
    image: cocktailImages['margarita'] || "/lovable-uploads/ce4a2004-2057-4be6-9e23-2a002763e200.png",
    ingredients: ["2oz Tequila", "1oz Cointreau", "1oz Fresh lime juice", "Salt rim", "Lime wheel"],
    description: "Mexico's gift to the world - perfect for any occasion.",
    difficulty: "Easy",
    time: "3 mins"
  }, {
    name: "Espresso Martini",
    image: cocktailImages['espresso-martini'] || "/lovable-uploads/094b78f1-6048-40cd-84c7-60aab34b4eae.png",
    ingredients: ["2oz Vodka", "1oz Coffee liqueur", "1oz Fresh espresso", "3 Coffee beans"],
    description: "The perfect after-dinner cocktail with a coffee kick.",
    difficulty: "Medium",
    time: "4 mins"
  }, {
    name: "Moscow Mule",
    image: cocktailImages['moscow-mule'] || "/lovable-uploads/f91b31d7-2b11-4bef-b4bd-d54b10ae73de.png",
    ingredients: ["2oz Vodka", "0.5oz Fresh lime juice", "4oz Ginger beer", "Lime wheel", "Fresh mint"],
    description: "Served in copper mugs for the authentic experience.",
    difficulty: "Easy",
    time: "2 mins"
  }, {
    name: "Piña Colada",
    image: cocktailImages['pina-colada'] || "/lovable-uploads/384ba519-4954-4fe4-a346-d5b8de93f533.png",
    ingredients: ["2oz White Rum", "1oz Coconut cream", "1oz Heavy cream", "6oz Pineapple juice", "Pineapple wedge"],
    description: "Tropical paradise in a glass - escape to the islands.",
    difficulty: "Easy",
    time: "3 mins"
  }];

  const handleDownload = (recipe: any) => {
    downloadRecipeAsText(recipe);
  };

  const RecipeGrid = ({ recipes }: { recipes: typeof classicRecipes }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {recipes.map((recipe, index) => (
        <Card key={index} className="bg-glass-effect border-barrush-steel/30 border hover:border-neon-pink/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
          <div className="h-64 relative overflow-hidden bg-barrush-midnight">
            <OptimizedImage
              src={recipe.image}
              alt={`${recipe.name} cocktail`}
              className="w-full h-full"
              fallbackSrc="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              priority={index < 3}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <span className="bg-barrush-midnight/80 text-barrush-platinum text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {recipe.difficulty}
              </span>
              <span className="bg-barrush-midnight/80 text-barrush-platinum text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {recipe.time}
              </span>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3 font-serif text-barrush-platinum">
              {recipe.name}
            </h3>
            <p className="text-barrush-platinum/80 mb-4 text-sm leading-relaxed">
              {recipe.description}
            </p>
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-neon-pink font-iphone">Ingredients:</h4>
              <ul className="text-barrush-platinum/70 space-y-1 text-sm">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-1 h-1 bg-neon-pink rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button 
              onClick={() => handleDownload(recipe)}
              className="w-full bg-neon-pink hover:bg-neon-pink-light text-white font-semibold py-3 transition-all duration-300 font-iphone"
            >
              Download Recipe
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
            <RecipeGrid recipes={classicRecipes} />
          </TabsContent>
          
          <TabsContent value="modern" className="animate-fade-in">
            <RecipeGrid recipes={modernRecipes} />
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
