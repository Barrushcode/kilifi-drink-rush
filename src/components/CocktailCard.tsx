import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Clock, BarChart3 } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { CocktailData, getCocktailImageUrl } from '@/hooks/useCocktails';

interface CocktailCardProps {
  cocktail: CocktailData;
  onDownload: (cocktail: CocktailData) => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onDownload }) => {
  const imageUrl = getCocktailImageUrl(cocktail.image_filename);
  
  return (
    <Card className="group bg-glass-effect border border-barrush-steel/30 hover:border-neon-pink/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden backdrop-blur-md">
      <div className="relative h-64 overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={cocktail.Name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="bg-neon-pink/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-white text-xs font-semibold flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Classic
            </span>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-serif text-barrush-platinum group-hover:text-neon-pink transition-colors duration-300">
          {cocktail.Name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-neon-pink mb-2">Ingredients:</h4>
            <p className="text-sm text-barrush-platinum/80 leading-relaxed font-iphone">
              {cocktail['Recipe (Ingredients)']}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-neon-pink mb-2">Instructions:</h4>
            <p className="text-sm text-barrush-platinum/80 leading-relaxed font-iphone">
              {cocktail.Instructions}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => onDownload(cocktail)}
          variant="outline" 
          className="w-full mt-4 bg-transparent border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white transition-all duration-300 font-iphone"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Recipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default CocktailCard;