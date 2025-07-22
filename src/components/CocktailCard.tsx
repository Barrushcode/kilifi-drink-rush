
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Download, Clock, BarChart3, ShoppingCart } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { CocktailData } from '@/hooks/useCocktails';
import IngredientBundleModal from './IngredientBundleModal';
import { supabase } from '@/integrations/supabase/client';

interface CocktailCardProps {
  cocktail: CocktailData;
  onDownload: (cocktail: CocktailData) => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onDownload }) => {
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  
  // Get image URL from Supabase storage bucket
  const getImageUrl = (filename: string) => {
    if (!filename) {
      return '';
    }
    const { data } = supabase.storage.from('cocktails').getPublicUrl(filename);
    return data.publicUrl;
  };

  const imageUrl = cocktail.image_filename ? getImageUrl(cocktail.image_filename) : '';
  const fallbackImage = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60";
  
  // Use fallback if no valid image URL
  const finalImageUrl = imageUrl || fallbackImage;
  
  return (
    <Card className="group bg-glass-effect border border-barrush-steel/30 hover:border-neon-pink/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden backdrop-blur-md">
      <AspectRatio ratio={4/5} className="relative overflow-hidden">
        {/* Blurred background */}
        <div className="absolute inset-0">
          <OptimizedImage
            src={finalImageUrl}
            alt=""
            className="w-full h-full object-cover scale-110 blur-xl opacity-60"
            fallbackSrc={fallbackImage}
            priority={false}
          />
        </div>
        
        {/* Main image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
          <OptimizedImage
            src={finalImageUrl}
            alt={cocktail.Name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg shadow-lg"
            fallbackSrc={fallbackImage}
            priority={true}
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
      </AspectRatio>
      
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
