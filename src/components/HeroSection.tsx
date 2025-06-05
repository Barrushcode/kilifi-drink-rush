
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-barrush-gold mb-6 tracking-tight">
            BARRUSH
          </h1>
          <p className="text-2xl md:text-3xl text-barrush-cream mb-8 font-light">
            Get Your Drink Rush On
          </p>
          <p className="text-lg text-barrush-cream/80 mb-12 max-w-2xl mx-auto">
            Premium alcohol delivery in Kilifi County. Fast, stylish, and delivered with care.
          </p>
          
          <Button 
            onClick={scrollToProducts}
            size="lg"
            className="bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
          >
            Browse Our Drinks
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-barrush-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-barrush-gold rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
