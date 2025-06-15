
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
      {/* Remove max-w-[1440px]: stretch all content on desktop */}
      <div className="w-full flex-1 flex flex-col">
        <HeroSection />

        <HowItWorksSection />
        <DeliveryZonesSection />
        
        {/* Quick Navigation Section: Explore Our Collection */}
        <section className="py-24 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative w-full">
          {/* Remove centralization; text should line up flush with padding */}
          <div className="w-full px-0 md:px-0 lg:px-0 relative z-10">
            <div className="w-full mb-20 px-4 md:px-10 lg:px-28">
              {/* Heading and content always left-aligned */}
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-serif text-rose-600 w-full text-left">
                Explore Our Collection
              </h2>
              <div className="w-24 h-px bg-barrush-copper my-8 lg:mx-0"></div>
              <p className="text-lg md:text-xl text-barrush-platinum/90 leading-relaxed w-full max-w-none text-left">
                Discover premium spirits and master classic cocktails
              </p>
            </div>
            {/* Cards grid: left-aligned, full width with padding */}
            <div className="grid md:grid-cols-2 gap-10 w-full px-4 md:px-10 lg:px-28">
              <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden w-full">
                <div 
                  className="h-64 md:h-80 bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
                </div>
                <CardContent className="p-8 text-left">
                  <h3 className="text-2xl font-bold mb-4 font-serif text-red-200">
                    Premium Products
                  </h3>
                  <p className="text-barrush-platinum/80 mb-6 leading-relaxed">
                    Browse our curated selection of the world's finest spirits and premium beverages
                  </p>
                  <Button asChild className="text-barrush-midnight font-bold px-6 py-3 transition-all duration-300 hover:scale-105 bg-rose-600 hover:bg-rose-500">
                    <Link to="/products">View Products</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-glass-effect border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden w-full">
                <div 
                  className="h-64 md:h-80 bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
                </div>
                <CardContent className="p-8 text-left">
                  <h3 className="text-2xl font-bold mb-4 font-serif text-green-200">
                    Cocktail Recipes
                  </h3>
                  <p className="text-barrush-platinum/80 mb-6 leading-relaxed">
                    Master the timeless classics with our professional mixology guides
                  </p>
                  <Button asChild variant="outline" className="border-barrush-copper font-bold px-6 py-3 transition-all duration-300 bg-cyan-500 hover:bg-cyan-400 text-sky-950">
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

