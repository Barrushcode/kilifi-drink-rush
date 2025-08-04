
import React from 'react';
import { useCocktails, CocktailData } from '@/hooks/useCocktails';
import CocktailCard from './CocktailCard';
import { Loader } from 'lucide-react';

const CocktailRecipesSection: React.FC = () => {
  const { cocktails, loading, error } = useCocktails();

  const handleDownload = (cocktail: CocktailData) => {
    const content = `${cocktail.Name}

Ingredients:
${cocktail['Recipe (Ingredients)']}

Instructions:
${cocktail.Instructions}

---
Created with BarrushDelivery Cocktail Recipes
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cocktail.Name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipe.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative min-h-screen">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif text-barrush-platinum">
            Master Cocktail Recipes
          </h1>
          <div className="w-24 h-0.5 bg-neon-pink mx-auto mb-6"></div>
          <p className="text-lg text-barrush-platinum/80 max-w-3xl mx-auto leading-relaxed font-iphone">
            Perfect the timeless classics and modern favorites with our professional mixology guides. 
            Download each recipe for your personal collection.
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="h-8 w-8 animate-spin text-neon-pink" />
            <span className="ml-2 text-barrush-platinum font-iphone">Loading cocktails...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 font-iphone">Error loading cocktails: {error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto animate-fade-in">
            {cocktails.map((cocktail, index) => (
              <CocktailCard 
                key={index}
                cocktail={cocktail}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
        
        <div className="text-center mt-20 space-y-8">
          <div className="bg-glass-effect border border-barrush-steel/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-6 font-serif text-barrush-platinum">
              🥃 Want a Professional Touch?
            </h3>
            <p className="text-barrush-platinum/80 text-lg leading-relaxed font-iphone mb-6">
              Let our expert mixologists craft the perfect cocktail experience for your event.
            </p>
            <a 
              href="mailto:info@barrush.co.ke?subject=Private Mixologist Inquiry&body=Hi, I'm interested in hiring a private mixologist for my event. Please send me more details."
              className="inline-flex items-center justify-center bg-neon-pink hover:bg-neon-pink-light text-white font-semibold py-3 px-8 rounded-md transition-all duration-300 font-iphone"
            >
              Hire a Private Mixologist
            </a>
          </div>
          
          <div className="bg-glass-effect border border-barrush-steel/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-4 font-serif text-barrush-platinum">
              🍸 Share Your Craft
            </h3>
            <p className="text-barrush-platinum/80 text-lg leading-relaxed font-iphone">
              Tag <span className="font-bold text-neon-pink">@BarrushDelivery</span> 
              {" "}and showcase your cocktail mastery using our premium spirits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CocktailRecipesSection;
