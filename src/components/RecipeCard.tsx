import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/OptimizedImage';

interface Recipe {
  name: string;
  image: string;
  ingredients: string[];
  description: string;
  difficulty: string;
  time: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onDownload: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index, onDownload }) => {
  return (
    <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-neon-pink/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
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
          onClick={() => onDownload(recipe)}
          className="w-full bg-neon-pink hover:bg-neon-pink-light text-white font-semibold py-3 transition-all duration-300 font-iphone"
        >
          Download Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;