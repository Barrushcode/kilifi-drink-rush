import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const handleOrderClick = () => {
    navigate('/products');
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Modern urban bar */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `linear-gradient(rgba(15, 20, 25, 0.7), rgba(15, 20, 25, 0.5)), url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
    }} />
      
      {/* Modern overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-barrush-midnight/20 via-transparent to-barrush-midnight/60 text-8xl font-bold text-[#f426df]" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <div className="animate-fade-in">
          <h1 className="text-7xl font-bold mb-8 tracking-tight font-serif md:text-[(#800020] text-[#f762cd]">
            BARRUSH
          </h1>
          <div className="w-20 h-px mx-auto mb-8 bg-cyan-500 rounded-xl"></div>
          <p className="text-3xl md:text-4xl text-barrush-platinum mb-6 font-light">We Bring the Bar to You </p>
          <p className="text-xl text-barrush-platinum/80 mb-16 max-w-3xl mx-auto leading-relaxed">Bar-level drinks, home-level effort. Plus, we know where the party’s at.             Tunadeliver bila stress.</p>
          
          <Button onClick={handleOrderClick} size="lg" className="font-bold px-16 py-6 text-xl transition-all duration-300 hover:scale-105 shadow-2xl bg-[(#800020] bg-[#800080] text-zinc-50">
            Let's Order
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        
      </div>
    </section>;
};
export default HeroSection;