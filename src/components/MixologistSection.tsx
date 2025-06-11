
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MixologistSection: React.FC = () => {
  const classicRecipes = [{
    name: "Old Fashioned",
    image: "/lovable-uploads/d3fc1dba-2426-4f52-b8af-cb3f2972d874.png",
    ingredients: ["2oz Bourbon Whiskey", "2 dashes Angostura Bitters", "1 sugar cube", "Orange peel", "Ice"],
    description: "The timeless classic that never goes out of style"
  }, {
    name: "Martini",
    image: "/lovable-uploads/eed458a0-c82d-483b-b67a-887e67da1b9c.png",
    ingredients: ["2.5oz Gin", "0.5oz Dry Vermouth", "Lemon twist or olive", "Ice"],
    description: "Sophistication in a glass - shaken or stirred"
  }, {
    name: "Manhattan",
    image: "/lovable-uploads/3d2d9178-c92a-47f5-b7cb-43eb099a90ff.png",
    ingredients: ["2oz Rye Whiskey", "1oz Sweet Vermouth", "2 dashes Angostura Bitters", "Cherry garnish"],
    description: "New York's signature cocktail with perfect balance"
  }, {
    name: "Negroni",
    image: "/lovable-uploads/6ecc4d5a-c5bb-4f87-bc26-efe644461c76.png",
    ingredients: ["1oz Gin", "1oz Campari", "1oz Sweet Vermouth", "Orange peel"],
    description: "Italian aperitif with a perfect bitter-sweet harmony"
  }, {
    name: "Whiskey Sour",
    image: "/lovable-uploads/a3a04ef4-78fa-4911-8f2f-be21369dba75.png",
    ingredients: ["2oz Bourbon", "1oz Fresh lemon juice", "0.75oz Simple syrup", "Egg white (optional)", "Cherry garnish"],
    description: "Classic sour cocktail with perfect sweet-tart balance"
  }, {
    name: "Daiquiri",
    image: "/lovable-uploads/72bc2b2d-1f24-4b19-8f90-68e1f260d2b1.png",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "0.75oz Simple syrup", "Lime wheel"],
    description: "Ernest Hemingway's favorite - clean and refreshing"
  }];

  const modernRecipes = [{
    name: "Mojito",
    image: "/lovable-uploads/d5a394f1-75bd-4021-b1ee-89deaea33ab6.png",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "2 tsp Sugar", "6-8 Fresh mint leaves", "Soda water", "Ice"],
    description: "Cuban classic with refreshing mint and lime"
  }, {
    name: "Cosmopolitan",
    image: "/lovable-uploads/96d89dca-3bcc-4670-b40b-a7bf842d8f48.png",
    ingredients: ["2oz Vodka", "1oz Cointreau", "0.5oz Fresh lime juice", "0.25oz Cranberry juice", "Lime wheel"],
    description: "Pink perfection made famous by Sex and the City"
  }, {
    name: "Margarita",
    image: "/lovable-uploads/ce4a2004-2057-4be6-9e23-2a002763e200.png",
    ingredients: ["2oz Tequila", "1oz Cointreau", "1oz Fresh lime juice", "Salt rim", "Lime wheel"],
    description: "Mexico's gift to the world - perfect for any occasion"
  }, {
    name: "Espresso Martini",
    image: "/lovable-uploads/094b78f1-6048-40cd-84c7-60aab34b4eae.png",
    ingredients: ["2oz Vodka", "1oz Coffee liqueur", "1oz Fresh espresso", "3 Coffee beans"],
    description: "The perfect after-dinner cocktail with a coffee kick"
  }, {
    name: "Moscow Mule",
    image: "/lovable-uploads/f91b31d7-2b11-4bef-b4bd-d54b10ae73de.png",
    ingredients: ["2oz Vodka", "0.5oz Fresh lime juice", "4oz Ginger beer", "Lime wheel", "Fresh mint"],
    description: "Served in copper mugs for the authentic experience"
  }, {
    name: "Piña Colada",
    image: "/lovable-uploads/384ba519-4954-4fe4-a346-d5b8de93f533.png",
    ingredients: ["2oz White Rum", "1oz Coconut cream", "1oz Heavy cream", "6oz Pineapple juice", "Pineapple wedge"],
    description: "Tropical paradise in a glass - escape to the islands"
  }];

  const RecipeGrid = ({ recipes }: { recipes: typeof classicRecipes }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
      {recipes.map((recipe, index) => (
        <Card key={index} className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
          <div className="h-72 relative overflow-hidden" style={{
            backgroundImage: `url(${recipe.image})`, 
            backgroundSize: 'contain', 
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#1a1a1a'
          }}>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
          </div>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4 font-serif text-green-200">
              {recipe.name}
            </h3>
            <p className="text-barrush-platinum/90 mb-6 leading-relaxed">
              {recipe.description}
            </p>
            <div className="mb-6">
              <h4 className="font-bold mb-3 text-lg text-teal-500">Ingredients:</h4>
              <ul className="text-barrush-platinum/80 space-y-2">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-barrush-copper rounded-full mr-3"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" className="w-full border-barrush-copper font-bold py-3 transition-all duration-300 bg-cyan-500 hover:bg-cyan-400 text-sky-950">
              Download Recipe
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-cyan-400">
            Master Classic Cocktails
          </h2>
          <div className="w-16 h-px bg-barrush-copper mx-auto mb-8"></div>
          <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto leading-relaxed">
            Perfect the timeless classics with our professional mixology guides
          </p>
        </div>
        
        <Tabs defaultValue="classic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 bg-glass-effect border border-barrush-steel/30">
            <TabsTrigger value="classic" className="text-lg font-semibold text-barrush-platinum data-[state=active]:bg-barrush-copper data-[state=active]:text-white">
              Classic Cocktails
            </TabsTrigger>
            <TabsTrigger value="modern" className="text-lg font-semibold text-barrush-platinum data-[state=active]:bg-barrush-copper data-[state=active]:text-white">
              Modern Favorites
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="classic">
            <RecipeGrid recipes={classicRecipes} />
          </TabsContent>
          
          <TabsContent value="modern">
            <RecipeGrid recipes={modernRecipes} />
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-16">
          <div className="bg-glass-effect border border-barrush-steel/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <h4 className="text-2xl font-bold mb-4 font-serif text-sky-100">
              🍸 Share Your Craft
            </h4>
            <p className="text-barrush-platinum/90 text-lg leading-relaxed">
              Tag <span className="font-bold text-red-200">@BarrushDelivery</span> 
              and showcase your classic cocktail mastery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MixologistSection;
