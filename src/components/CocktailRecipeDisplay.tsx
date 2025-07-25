import React from 'react';
import { useCocktails } from '@/hooks/useCocktails';
import { Card, CardContent } from '@/components/ui/card';

const CocktailRecipeDisplay: React.FC = () => {
  const { cocktails, loading, error } = useCocktails();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-barrush-platinum">Loading cocktail recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-400">Error loading recipes: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-serif text-barrush-platinum text-center mb-8">
        Cocktail Recipes
      </h1>
      
      {cocktails.map((cocktail, index) => (
        <Card key={index} className="bg-glass-effect border border-barrush-steel/30 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Title */}
              <h2 className="text-2xl font-serif text-neon-pink font-bold">
                Title: {cocktail.Name}
              </h2>
              
              {/* Description - Using instructions as description since no separate description field */}
              <div>
                <span className="text-barrush-platinum font-semibold">Description: </span>
                <span className="text-barrush-platinum/80">{cocktail.Instructions}</span>
              </div>
              
              {/* Ingredients */}
              <div>
                <span className="text-barrush-platinum font-semibold">Ingredients: </span>
                <span className="text-barrush-platinum/80">{cocktail['Recipe (Ingredients)']}</span>
              </div>
              
              {/* Method - Using instructions as method */}
              <div>
                <span className="text-barrush-platinum font-semibold">Method: </span>
                <span className="text-barrush-platinum/80">{cocktail.Instructions}</span>
              </div>
              
              {/* Image */}
              <div className="mt-6">
                <span className="text-barrush-platinum font-semibold">Image: </span>
                <div className="mt-2">
                  <img 
                    src={`https://raw.githubusercontent.com/Barrushcode/barrush-cocktails/main/${cocktail.Name}.jpg`}
                    alt={cocktail.Name}
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg object-cover"
                    style={{ 
                      maxHeight: '400px',
                      width: 'auto',
                      height: 'auto'
                    }}
                    onError={(e) => {
                      // Fallback to a placeholder if GitHub image doesn't exist
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60';
                    }}
                  />
                  <p className="text-xs text-barrush-platinum/60 mt-2 text-center">
                    ![{cocktail.Name}](https://raw.githubusercontent.com/Barrushcode/barrush-cocktails/main/{cocktail.Name}.jpg)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CocktailRecipeDisplay;