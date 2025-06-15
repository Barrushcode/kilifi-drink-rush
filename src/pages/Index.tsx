
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AgeVerification from '@/components/AgeVerification';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [ageVerified, setAgeVerified] = useState(false);

  if (!ageVerified) {
    return <AgeVerification onVerified={() => setAgeVerified(true)} />;
  }

  return (
    <div className="min-h-screen bg-barrush-midnight flex flex-col items-center w-full">
      {/* Enhanced desktop layout with proper centering */}
      <div className="w-full max-w-7xl flex-1 flex flex-col">
        <HeroSection />

        <HowItWorksSection />
        <DeliveryZonesSection />
        
        {/* Explore Our Collection Section - Enhanced for desktop */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative w-full">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif text-rose-600">
                Explore Our Collection
              </h2>
              <div className="w-24 h-px bg-barrush-copper mx-auto my-8"></div>
              <p className="text-lg lg:text-xl text-barrush-platinum/90 leading-relaxed max-w-3xl mx-auto">
                Discover premium spirits and master classic cocktails
              </p>
            </div>
            
            {/* Enhanced cards grid for desktop */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
                <div 
                  className="h-64 md:h-80 lg:h-96 bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
                </div>
                <CardContent className="p-6 lg:p-8 text-center">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-serif text-red-200">
                    Premium Products
                  </h3>
                  <p className="text-barrush-platinum/80 mb-6 leading-relaxed text-base lg:text-lg">
                    Browse our curated selection of the world's finest spirits and premium beverages
                  </p>
                  <Button asChild className="text-barrush-midnight font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500">
                    <Link to="/products">View Products</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
                <div 
                  className="h-64 md:h-80 lg:h-96 bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
                </div>
                <CardContent className="p-6 lg:p-8 text-center">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 font-serif text-green-200">
                    Cocktail Recipes
                  </h3>
                  <p className="text-barrush-platinum/80 mb-6 leading-relaxed text-base lg:text-lg">
                    Master the timeless classics with our professional mixology guides
                  </p>
                  <Button asChild variant="outline" className="border-barrush-copper font-bold px-8 py-4 text-lg transition-all duration-300 bg-cyan-500 hover:bg-cyan-400 text-sky-950">
                    <Link to="/recipes">View Recipes</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
