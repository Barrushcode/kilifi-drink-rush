
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
    <div className="min-h-screen bg-gradient-to-tl from-barrush-midnight via-blue-950/60 to-pink-950/60">
      <HeroSection />
      {/* Remove vertical margin between Hero and HowItWorks */}
      <section className="-mt-8 md:-mt-10">
        <HowItWorksSection />
      </section>
      <section className="-mt-8 md:-mt-12">
        <DeliveryZonesSection />
      </section>

      {/* Quick Navigation Section */}
      <section className="py-24 bg-gradient-to-b from-indigo-900/60 via-blue-950/90 to-pink-900/80 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif bg-gradient-to-br from-pink-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
              Explore Our Collection
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-pink-500 via-cyan-500 to-fuchsia-400 mx-auto mb-8"></div>
            <p className="text-xl text-barrush-platinum/90 max-w-3xl mx-auto leading-relaxed">
              Discover premium spirits and master classic cocktails
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-900/30 via-pink-800/10 to-barrush-midnight/50 border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center relative overflow-hidden" 
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 via-pink-400/10 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
              </div>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 font-serif text-pink-200">
                  Premium Products
                </h3>
                <p className="text-barrush-platinum/80 mb-6 leading-relaxed">
                  Browse our curated selection of the world's finest spirits and premium beverages
                </p>
                <Button asChild className="text-barrush-midnight font-bold px-6 py-3 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-400 text-white shadow-md">
                  <Link to="/products">View Products</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/20 via-blue-900/15 to-barrush-midnight/50 border-barrush-steel/30 border hover:border-barrush-copper/50 transition-all duration-500 hover:scale-105 backdrop-blur-md group overflow-hidden">
              <div 
                className="h-64 bg-cover bg-center relative overflow-hidden" 
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
              </div>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 font-serif text-fuchsia-200">
                  Cocktail Recipes
                </h3>
                <p className="text-barrush-platinum/80 mb-6 leading-relaxed">
                  Master the timeless classics with our professional mixology guides
                </p>
                <Button asChild variant="outline" className="border-none font-bold px-6 py-3 transition-all duration-300 bg-gradient-to-r from-blue-400 via-pink-300 to-fuchsia-500 text-sky-900 shadow-sm hover:from-blue-500 hover:to-pink-400">
                  <Link to="/recipes">View Recipes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
