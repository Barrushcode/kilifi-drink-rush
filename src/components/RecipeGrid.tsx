import React from 'react';
import RecipeCard from './RecipeCard';
import { Recipe } from '@/data/cocktailRecipes';

interface RecipeWithImage extends Omit<Recipe, 'imageKey' | 'fallbackImage'> {
  image: string;
}

interface RecipeGridProps {
  recipes: RecipeWithImage[];
  onDownload: (recipe: RecipeWithImage) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, onDownload }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {recipes.map((recipe, index) => (
        <RecipeCard 
          key={index}
          recipe={recipe}
          index={index}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;