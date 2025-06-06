
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Modern urban bar */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-barrush-midnight/50 via-transparent to-barrush-midnight/70" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-barrush-platinum mb-8 tracking-tight font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="text-barrush-copper">BAR</span>RUSH
          </h1>
          <div className="w-24 h-0.5 bg-barrush-copper mx-auto mb-8 drop-shadow-md"></div>
          <p className="text-2xl md:text-3xl text-barrush-platinum mb-6 font-light drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
            Get Your Drink Rush On
          </p>
          <p className="text-lg md:text-xl text-barrush-platinum/90 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Premium spirits and curated cocktails delivered with urban sophistication across Kilifi County.
          </p>
          
          {/* Glowing neon CTA button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button 
              onClick={scrollToProducts}
              size="lg"
              className="bg-barrush-copper hover:bg-barrush-copper/90 text-barrush-midnight font-bold px-10 py-6 text-lg 
                        shadow-[0_0_15px_rgba(201,169,110,0.5)] hover:shadow-[0_0_25px_rgba(201,169,110,0.8)] 
                        transition-all duration-300 hover:scale-105 animate-pulse"
            >
              EXPLORE COLLECTION
            </Button>
            
            <Button 
              onClick={() => navigate('/login')}
              variant="outline" 
              className="border-barrush-copper text-barrush-copper hover:bg-barrush-copper/10
                        shadow-[0_0_10px_rgba(201,169,110,0.3)] hover:shadow-[0_0_20px_rgba(201,169,110,0.6)]
                        transition-all duration-300"
            >
              ADMIN LOGIN
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-barrush-copper rounded-full flex justify-center opacity-70
                      shadow-[0_0_10px_rgba(201,169,110,0.5)]">
          <div className="w-1 h-3 bg-barrush-copper rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
