
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MixologistSection: React.FC = () => {
  const recipes = [
    {
      name: "Kilifi Sunset",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3",
      ingredients: ["2oz Vodka", "1oz Triple Sec", "Cranberry juice", "Lime wedge"],
      description: "A coastal-inspired cocktail with tropical vibes"
    },
    {
      name: "Barrush Old Fashioned", 
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3",
      ingredients: ["2oz Whiskey", "Sugar cube", "Angostura bitters", "Orange peel"],
      description: "Our signature twist on the classic old fashioned"
    },
    {
      name: "Coastal Breeze",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3",
      ingredients: ["2oz White Rum", "Coconut cream", "Pineapple juice", "Mint"],
      description: "Refreshing tropical cocktail perfect for warm evenings"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-barrush-burgundy/20 to-barrush-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-6">
            Be Your Own Mixologist
          </h2>
          <p className="text-xl text-barrush-cream max-w-2xl mx-auto">
            Master the art of cocktail making with our signature recipes
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {recipes.map((recipe, index) => (
            <Card 
              key={index}
              className="bg-barrush-charcoal/80 border-barrush-gold border hover:border-barrush-gold/80 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.image})` }}
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-barrush-gold mb-3">
                  {recipe.name}
                </h3>
                <p className="text-barrush-cream/80 mb-4">
                  {recipe.description}
                </p>
                <div className="mb-4">
                  <h4 className="text-barrush-gold font-semibold mb-2">Ingredients:</h4>
                  <ul className="text-sm text-barrush-cream space-y-1">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx}>• {ingredient}</li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-barrush-gold text-barrush-gold hover:bg-barrush-gold hover:text-barrush-charcoal"
                >
                  Download Recipe
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-barrush-gold/10 border border-barrush-gold rounded-lg p-6 max-w-md mx-auto">
            <h4 className="text-lg font-bold text-barrush-gold mb-2">
              📸 Show Off Your Skills!
            </h4>
            <p className="text-barrush-cream">
              Tag <span className="text-barrush-gold font-bold">@BarrushDelivery</span> in your mixology creations 
              and get featured on our page!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MixologistSection;
