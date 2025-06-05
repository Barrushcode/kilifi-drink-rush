
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - High-end bar atmosphere */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Elegant overlay pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-barrush-gold mb-8 tracking-wider font-serif">
            BARRUSH
          </h1>
          <div className="w-32 h-0.5 bg-barrush-gold mx-auto mb-8"></div>
          <p className="text-3xl md:text-4xl text-barrush-cream mb-6 font-light tracking-wide">
            Get Your Drink Rush On
          </p>
          <p className="text-xl text-barrush-cream/90 mb-16 max-w-3xl mx-auto leading-relaxed">
            Premium spirits, curated wines, and craft cocktails delivered with sophistication to Kilifi County's finest addresses.
          </p>
          
          <Button 
            onClick={scrollToProducts}
            size="lg"
            className="bg-barrush-gold hover:bg-barrush-gold/90 text-black font-bold px-12 py-8 text-xl transition-all duration-500 hover:scale-110 shadow-2xl border border-barrush-gold/50 hover:shadow-barrush-gold/30"
          >
            EXPLORE COLLECTION
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-barrush-gold rounded-full flex justify-center opacity-80">
          <div className="w-1.5 h-4 bg-barrush-gold rounded-full mt-3"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
