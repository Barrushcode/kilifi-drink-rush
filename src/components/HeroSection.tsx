
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate('/products');
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-500/40 via-sky-600/60 to-barrush-midnight/90">
      {/* Layered Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-sky-400/10 to-barrush-midnight/80 z-0" />
      {/* Modern overlay border effect */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background:
          "radial-gradient(circle at 55% 38%, rgba(244,38,205,0.12) 0%, rgba(38,168,244,0.10) 30%, rgba(15,20,25,0.00) 78%)"
      }} />
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight font-serif bg-gradient-to-br from-pink-400 via-fuchsia-500 to-blue-400 bg-clip-text text-transparent drop-shadow-xl">
            BARRUSH
          </h1>
          <div className="w-20 h-px mx-auto mb-8 bg-gradient-to-r from-blue-400 via-fuchsia-400 to-cyan-500 rounded-xl"></div>
          <p className="text-3xl md:text-4xl mb-6 font-light text-barrush-platinum/90 drop-shadow-lg">
            Get Your Drink Rush On
          </p>
          <p className="text-xl md:text-2xl text-barrush-platinum/80 mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed font-iphone">
            Premium spirits and curated cocktails delivered with urban sophistication across Kilifi County.
          </p>
          <Button
            onClick={handleOrderClick}
            size="lg"
            className="font-bold px-16 py-5 text-xl transition-all duration-300 hover:scale-105 shadow-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-400 text-white border-none ring-2 ring-blue-300/30"
          >
            Let's Order
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
