import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const MixologistSection: React.FC = () => {
  const classicRecipes = [
    {
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
    }
  ];
  const modernRecipes = [
    {
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
    }
  ];

  // Card grid with improved shadow/hover, gap, and responsiveness
  const RecipeGrid = ({
    recipes,
  }: {
    recipes: typeof classicRecipes;
  }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
      {recipes.map((recipe, index) => (
        <Card
          key={index}
          className="bg-[rgba(24,24,30,0.9)] border-none
                    shadow-xl shadow-black/30
                    hover:shadow-2xl hover:scale-[1.035]
                    transition-all duration-500
                    group overflow-hidden rounded-2xl
                    backdrop-blur-sm"
          style={{
            border: '1.3px solid rgba(185,136,58,0.16)',
            boxShadow: '0 6px 36px -6px #16181a'
          }}
        >
          {/* Card Image with new overlay gradient */}
          <div
            className="h-72 relative overflow-hidden rounded-t-2xl"
            style={{
              backgroundImage: `url(${recipe.image}), linear-gradient(180deg,rgba(31,33,38,.55)_0%,rgba(31,33,38,.22)_50%,rgba(14,15,20,.88)_100%)`,
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#18181e'
            }}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300 z-0"></div>
            {/* subtle top-to-bottom fade */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/70" />
          </div>
          <CardContent className="p-8 md:p-7 lg:p-8 xl:p-10 rounded-b-2xl transition-all duration-300">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 mt-1 font-serif text-barrush-gold tracking-tight
              [text-shadow:_0_2px_2px_rgba(0,0,0,0.16)]">
              {recipe.name}
            </h3>
            <p className="text-platinum/90 mb-4 md:mb-6 leading-relaxed font-iphone text-base md:text-lg">
              {recipe.description}
            </p>
            <div className="mb-5">
              <h4 className="font-bold mb-2 mt-1 text-md md:text-lg text-barrush-gold uppercase tracking-wide font-serif">Ingredients:</h4>
              <ul className="text-platinum/80 space-y-2 font-iphone">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-gradient-to-tr from-barrush-gold via-yellow-400 to-amber-400 rounded-full mr-3 shadow-sm shadow-yellow-100/60"></span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="outline"
              className="w-full border-barrush-gold border-2 bg-gradient-to-br from-yellow-100/35 via-yellow-50/15 to-transparent
                text-barrush-gold font-bold py-3 rounded-lg tracking-wide
                hover:bg-yellow-200/10 hover:scale-105 hover:shadow-lg
                transition-all duration-200 text-lg"
              style={{ boxShadow: '0 2px 12px 0 rgba(185,136,58,0.14)' }}
            >
              Download Recipe
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#18181e] via-[#131118] to-[#07080B] relative animate-fade-in">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 font-serif text-barrush-gold drop-shadow-[0_2px_10px_rgba(162,124,58,0.16)]">
            Master Classic Cocktails
          </h2>
          <div className="w-24 h-1.5 mx-auto bg-gradient-to-r from-barrush-gold via-yellow-400 to-barrush-gold my-7 rounded-xl"></div>
          <p className="text-xl md:text-2xl xl:text-3xl text-platinum/95 max-w-3xl mx-auto leading-relaxed font-iphone animate-fade-in">
            Perfect the timeless classics with our <span className="text-barrush-gold font-semibold">professional mixology guides</span>
          </p>
        </div>
        {/* Premium tabs design */}
        <Tabs defaultValue="classic" className="w-full animate-scale-in">
          <TabsList className="grid w-full grid-cols-2 mb-12 rounded-xl border-none overflow-hidden bg-gradient-to-r from-[#191920]/70 via-[#221e24]/30 to-[#191920]/80 shadow-[0_2px_8px_rgba(24,24,30,0.09)]">
            <TabsTrigger value="classic" className="text-lg md:text-xl font-bold py-0 bg-gradient-to-br from-[#1B1616]/70 via-[#33281e]/40 to-[#1b1d25]/85 text-barrush-gold data-[state=active]:bg-barrush-gold/10 data-[state=active]:text-yellow-300 transition-all">
              Classic Cocktails
            </TabsTrigger>
            <TabsTrigger value="modern" className="text-lg md:text-xl font-bold text-barrush-gold/70 data-[state=active]:text-yellow-200 py-0 bg-gradient-to-bl from-[#16181f]/60 via-[#282539]/40 to-[#242a34]/90 data-[state=active]:bg-fuchsia-900/20 transition-all">
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
          <div className="bg-gradient-to-br from-[#141520]/70 via-[#23212e]/90 to-[#15151a]/95 border border-barrush-gold/20 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm shadow-lg animate-fade-in">
            <h4 className="text-2xl md:text-3xl font-bold mb-2 font-serif text-yellow-200 [text-shadow:_0_1px_1px_rgba(0,0,0,0.12)]">
              🍸 Share Your Craft
            </h4>
            <p className="text-platinum/90 text-lg leading-relaxed font-iphone">
              Tag <span className="font-bold text-barrush-gold">@BarrushDelivery</span>
              {" "}and showcase your classic cocktail mastery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MixologistSection;
