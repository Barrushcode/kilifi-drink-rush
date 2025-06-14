
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
    <div className="min-h-screen bg-barrush-midnight">
      <HeroSection />
      <HowItWorksSection />
      <DeliveryZonesSection />
      
      {/* Quick Navigation Section */}
      <section className="py-24 bg-gradient-to-b from-barrush-slate to-barrush-midnight relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 font-serif text-neon-pink">
              Explore Our Collection
            </h2>
            <div className="w-16 h-px bg-neon-blue mx-auto mb-8"></div>
            <p className="text-xl text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
              Discover premium spirits and master classic cocktails
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <Card className="bg-barrush-slate/50 border-2 border-neon-blue/60 hover:border-neon-blue transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/20 group overflow-hidden hover:-translate-y-1">
              <div 
                className="h-64 bg-cover bg-center relative overflow-hidden" 
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
              </div>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 font-serif text-neon-blue">
                  Premium Products
                </h3>
                <p className="text-gray-300/80 mb-6 leading-relaxed">
                  Browse our curated selection of the world's finest spirits and premium beverages
                </p>
                <Button asChild className="text-white font-bold px-6 py-3 transition-all duration-300 hover:scale-105 bg-neon-pink hover:bg-neon-pink/90">
                  <Link to="/products">View Products</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-barrush-slate/50 border-2 border-neon-pink/60 hover:border-neon-pink transition-all duration-300 hover:shadow-lg hover:shadow-neon-pink/20 group overflow-hidden hover:-translate-y-1">
              <div 
                className="h-64 bg-cover bg-center relative overflow-hidden" 
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
              </div>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 font-serif text-neon-pink">
                  Cocktail Recipes
                </h3>
                <p className="text-gray-300/80 mb-6 leading-relaxed">
                  Master the timeless classics with our professional mixology guides
                </p>
                <Button asChild variant="outline" className="border-neon-pink font-bold px-6 py-3 transition-all duration-300 text-neon-pink hover:bg-neon-pink hover:text-barrush-midnight">
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
