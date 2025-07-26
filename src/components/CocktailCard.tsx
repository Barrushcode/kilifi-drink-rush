
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Clock, BarChart3, ShoppingCart } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { CocktailData } from '@/hooks/useCocktails';
import IngredientBundleModal from './IngredientBundleModal';
import { getCocktailImageUrl } from '@/services/cocktailImageService';

interface CocktailCardProps {
  cocktail: CocktailData;
  onDownload: (cocktail: CocktailData) => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onDownload }) => {
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  
  const fallbackImage = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60";
  
  // Hardcode specific images for certain cocktails
  const getImageUrl = () => {
    const cocktailName = cocktail.Name.toLowerCase();
    
    if (cocktailName.includes('cosmopolitan')) {
      return '/lovable-uploads/c46561db-632b-428e-be18-0b79dc0b0421.png';
    }
    if (cocktailName.includes('daiquiri')) {
      return '/lovable-uploads/100eef3f-025a-437b-9151-435dc9911ef4.png';
    }
    if (cocktailName.includes('espresso martini')) {
      return '/lovable-uploads/16ac3d3b-35c1-4805-93b3-2d8c23df8863.png';
    }
    if (cocktailName.includes('manhattan')) {
      return '/lovable-uploads/846f9b11-3340-4d9c-b1a8-f42913d81b5c.png';
    }
    if (cocktailName.includes('margarita')) {
      return '/lovable-uploads/b5d11b2f-60a1-4326-86e7-5d7a8a879ad3.png';
    }
    if (cocktailName.includes('martini') && !cocktailName.includes('espresso')) {
      return '/lovable-uploads/e8ebbd7b-2cbc-41a3-8155-e71d6c308b02.png';
    }
    if (cocktailName.includes('mojito')) {
      return '/lovable-uploads/9d10b57b-d722-42c5-83dc-80b7a464646e.png';
    }
    if (cocktailName.includes('moscow mule')) {
      return '/lovable-uploads/fb908e00-3d38-45c8-acb1-7680549255b9.png';
    }
    if (cocktailName.includes('negroni')) {
      return '/lovable-uploads/777949e3-1d3d-4d1d-845e-69ce6b25f4f9.png';
    }
    if (cocktailName.includes('pina colada')) {
      return '/lovable-uploads/81e639d5-0953-48e0-97f7-2258736d48ed.png';
    }
    if (cocktailName.includes('whiskey sour')) {
      return '/lovable-uploads/9f16588d-96b6-4e6d-8339-cdaa2cbfbbcf.png';
    }
    
    return (cocktail.Image && cocktail.Image.trim() !== '') ? cocktail.Image : fallbackImage;
  };
  
  const imageUrl = getImageUrl();
  
  // Debug logging to check image URLs
  console.log(`[COCKTAIL IMAGE] ${cocktail.Name} -> ${imageUrl}`);
  
  return (
    <Card className="group bg-glass-effect border border-barrush-steel/30 hover:border-neon-pink/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden backdrop-blur-md">
      <div className="relative overflow-hidden h-64">
        {/* Blurred background */}
        <div className="absolute inset-0">
          <OptimizedImage
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover scale-110 blur-xl opacity-60"
            fallbackSrc={fallbackImage}
            priority={false}
            bustCache={true}
          />
        </div>
        
        {/* Main image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
          <OptimizedImage
            src={imageUrl}
            alt={cocktail.Name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg shadow-lg"
            fallbackSrc={fallbackImage}
            priority={true}
            bustCache={true}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-20" />
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-2 z-30">
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
        
        <div className="space-y-2 mt-4">
          <Button 
            onClick={() => setBundleModalOpen(true)}
            className="w-full bg-neon-pink hover:bg-neon-pink/80 text-white transition-all duration-300 font-iphone"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Ingredients as Bundle
          </Button>
          
          <Button 
            onClick={() => onDownload(cocktail)}
            variant="outline" 
            className="w-full bg-transparent border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white transition-all duration-300 font-iphone"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Recipe
          </Button>
        </div>

        <IngredientBundleModal
          isOpen={bundleModalOpen}
          onClose={() => setBundleModalOpen(false)}
          cocktailName={cocktail.Name}
          ingredientsText={cocktail['Recipe (Ingredients)']}
        />
      </CardContent>
    </Card>
  );
};

export default CocktailCard;
