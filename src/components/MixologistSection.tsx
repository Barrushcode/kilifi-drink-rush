
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MixologistSection: React.FC = () => {
  const recipes = [
    {
      name: "Kilifi Sunset",
      image: "https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ingredients: ["2oz Premium Vodka", "1oz Cointreau", "Fresh cranberry juice", "Lime zest"],
      description: "A coastal-inspired cocktail with sophisticated tropical notes"
    },
    {
      name: "Barrush Old Fashioned", 
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ingredients: ["2oz Single Malt Whiskey", "Demerara sugar", "Angostura bitters", "Orange peel"],
      description: "Our signature interpretation of the timeless classic"
    },
    {
      name: "Coastal Breeze",
      image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ingredients: ["2oz Aged White Rum", "Fresh coconut cream", "Pressed pineapple", "Mint leaves"],
      description: "Tropical elegance perfect for Kilifi's golden evenings"
    },
    {
      name: "Malindi Martini",
      image: "https://images.unsplash.com/photo-1556855810-d8a9c0a30a9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ingredients: ["2.5oz Premium Gin", "0.5oz Dry Vermouth", "Olive garnish", "Lemon twist"],
      description: "Crystal clear sophistication with a coastal twist"
    },
    {
      name: "Watamu Whiskey Sour",
      image: "https://images.unsplash.com/photo-1609368342768-de62c1fb1935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ingredients: ["2oz Bourbon", "1oz Fresh lemon juice", "0.75oz Simple syrup", "Egg white", "Cherry garnish"],
      description: "Smooth, frothy perfection with a sweet-tart balance"
    },
    {
      name: "Diani Daiquiri",
      image: "https://images.unsplash.com/photo-1587223962930-cb7297d9d8ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      ingredients: ["2oz White Rum", "1oz Fresh lime juice", "0.75oz Simple syrup", "Lime wheel"],
      description: "Clean, refreshing classic perfect for beach-side sipping"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-black via-barrush-burgundy/20 to-black relative">
      <div className="absolute inset-0 opacity-10 bg-wood-texture"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-barrush-gold mb-6 font-serif">
            Master Mixology
          </h2>
          <div className="w-24 h-0.5 bg-barrush-gold mx-auto mb-8"></div>
          <p className="text-xl text-barrush-cream/90 max-w-3xl mx-auto leading-relaxed">
            Elevate your home bar with our signature cocktail recipes, crafted by professional mixologists
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {recipes.map((recipe, index) => (
            <Card 
              key={index}
              className="bg-gradient-to-b from-black/60 to-barrush-burgundy/40 border-barrush-gold/30 border-2 hover:border-barrush-gold transition-all duration-500 hover:scale-105 backdrop-blur-sm group overflow-hidden"
            >
              <div 
                className="h-64 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${recipe.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-barrush-gold mb-4 font-serif">
                  {recipe.name}
                </h3>
                <p className="text-barrush-cream/90 mb-6 leading-relaxed">
                  {recipe.description}
                </p>
                <div className="mb-6">
                  <h4 className="text-barrush-gold font-bold mb-3 text-lg">Ingredients:</h4>
                  <ul className="text-barrush-cream/80 space-y-2">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-barrush-gold rounded-full mr-3"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-barrush-gold text-barrush-gold hover:bg-barrush-gold hover:text-black font-bold py-3 transition-all duration-300"
                >
                  Download Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-barrush-gold/10 via-barrush-burgundy/20 to-barrush-gold/10 border border-barrush-gold/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
            <h4 className="text-2xl font-bold text-barrush-gold mb-4 font-serif">
              🍸 Showcase Your Craft
            </h4>
            <p className="text-barrush-cream/90 text-lg leading-relaxed">
              Share your mixology masterpieces with <span className="text-barrush-gold font-bold">@BarrushDelivery</span> 
              and join our community of sophisticated cocktail enthusiasts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MixologistSection;
