
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MixologistSection: React.FC = () => {
  const recipes = [{
    name: "Old Fashioned",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz Bourbon Whiskey", "2 dashes Angostura Bitters", "1 sugar cube", "Orange peel", "Ice"],
    description: "The timeless classic that never goes out of style"
  }, {
    name: "Martini",
    image: "https://images.unsplash.com/photo-1556855810-d8a9c0a30a9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2.5oz Gin", "0.5oz Dry Vermouth", "Lemon twist or olive", "Ice"],
    description: "Sophistication in a glass - shaken or stirred"
  }, {
    name: "Manhattan",
    image: "https://images.unsplash.com/photo-1609368342768-de62c1fb1935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz Rye Whiskey", "1oz Sweet Vermouth", "2 dashes Angostura Bitters", "Cherry garnish"],
    description: "New York's signature cocktail with perfect balance"
  }, {
    name: "Negroni",
    image: "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["1oz Gin", "1oz Campari", "1oz Sweet Vermouth", "Orange peel"],
    description: "Italian aperitif with a perfect bitter-sweet harmony"
  }, {
    name: "Whiskey Sour",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz Bourbon", "1oz Fresh lemon juice", "0.75oz Simple syrup", "Egg white (optional)", "Cherry garnish"],
    description: "Classic sour cocktail with perfect sweet-tart balance"
  }, {
    name: "Daiquiri",
    image: "https://images.unsplash.com/photo-1587223962930-cb7297d9d8ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "0.75oz Simple syrup", "Lime wheel"],
    description: "Ernest Hemingway's favorite - clean and refreshing"
  }, {
    name: "Mojito",
    image: "https://images.unsplash.com/photo-1571104508999-893933ded431?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz White Rum", "1oz Fresh lime juice", "2 tsp Sugar", "6-8 Fresh mint leaves", "Soda water", "Ice"],
    description: "Cuban classic with refreshing mint and lime"
  }, {
    name: "Cosmopolitan",
    image: "https://images.unsplash.com/photo-1541546213646-1de78faa9271?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz Vodka", "1oz Cointreau", "0.5oz Fresh lime juice", "0.25oz Cranberry juice", "Lime wheel"],
    description: "Pink perfection made famous by Sex and the City"
  }, {
    name: "Margarita",
    image: "https://images.unsplash.com/photo-1561515072-1f9bb8d1e3f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz Tequila", "1oz Cointreau", "1oz Fresh lime juice", "Salt rim", "Lime wheel"],
    description: "Mexico's gift to the world - perfect for any occasion"
  }, {
    name: "Espresso Martini",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz Vodka", "1oz Coffee liqueur", "1oz Fresh espresso", "3 Coffee beans"],
    description: "The perfect after-dinner cocktail with a coffee kick"
  }, {
    name: "Moscow Mule",
    image: "https://images.unsplash.com/photo-1551024183-6d6dbaea96ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz Vodka", "0.5oz Fresh lime juice", "4oz Ginger beer", "Lime wheel", "Fresh mint"],
    description: "Served in copper mugs for the authentic experience"
  }, {
    name: "Piña Colada",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ingredients: ["2oz White Rum", "1oz Coconut cream", "1oz Heavy cream", "6oz Pineapple juice", "Pineapple wedge"],
    description: "Tropical paradise in a glass - escape to the islands"
  }];

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {recipes.map((recipe, index) => (
            <Card key={index} className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
              <div className="h-48 bg-cover bg-center relative overflow-hidden" style={{backgroundImage: `url(${recipe.image})`}}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
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
