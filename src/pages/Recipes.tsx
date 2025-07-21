import React from 'react';
import CocktailRecipesSection from '@/components/CocktailRecipesSection';
import CocktailImageUpload from '@/components/CocktailImageUpload';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Recipes = () => {
  const testImageUrl = "https://tyfsxboxshbkdetweuke.supabase.co/storage/v1/object/public/cocktails/Mojito.jpg";
  
  return <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen pt-20">
        
        {/* Test Image Component */}
        <div className="w-full px-4 mb-8">
          <Card className="bg-glass-effect border border-barrush-steel/30 overflow-hidden backdrop-blur-md">
            <AspectRatio ratio={4/5} className="relative overflow-hidden">
              <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-4">
                <img
                  src={testImageUrl}
                  alt="Test Mojito Image"
                  style={{ width: '100%', height: '100%' }}
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </AspectRatio>
            <CardContent className="p-4">
              <p className="text-barrush-platinum text-center">Test Mobile Image Rendering</p>
            </CardContent>
          </Card>
        </div>
        
        <CocktailRecipesSection />
      </div>
    </div>;
};
export default Recipes;