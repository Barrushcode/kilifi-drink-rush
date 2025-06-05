
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-black to-barrush-charcoal relative">
      {/* Elegant background texture */}
      <div className="absolute inset-0 opacity-5 bg-wood-texture"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-barrush-gold mb-4 font-serif tracking-wide">
            About Barrush
          </h2>
          <div className="w-24 h-0.5 bg-barrush-gold mx-auto mb-16"></div>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <Card className="bg-gradient-to-br from-barrush-burgundy/30 to-barrush-charcoal/50 border-barrush-gold/30 border-2 backdrop-blur-sm hover:border-barrush-gold/60 transition-all duration-300">
              <CardContent className="p-10">
                <div className="text-7xl mb-6">🥃</div>
                <h3 className="text-3xl font-bold text-barrush-gold mb-6 font-serif">Locally Curated</h3>
                <p className="text-barrush-cream/90 text-lg leading-relaxed">
                  Born in Kilifi County, we understand the sophisticated palate of our community. 
                  Every bottle is hand-selected for its quality and character.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-barrush-burgundy/30 to-barrush-charcoal/50 border-barrush-gold/30 border-2 backdrop-blur-sm hover:border-barrush-gold/60 transition-all duration-300">
              <CardContent className="p-10">
                <div className="text-7xl mb-6">⚡</div>
                <h3 className="text-3xl font-bold text-barrush-gold mb-6 font-serif">Luxury & Speed</h3>
                <p className="text-barrush-cream/90 text-lg leading-relaxed">
                  White-glove service meets modern efficiency. Your premium selections 
                  arrive swiftly and in pristine condition, every time.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 p-12 bg-gradient-to-r from-barrush-gold/10 via-barrush-burgundy/20 to-barrush-gold/10 rounded-2xl border border-barrush-gold/40 backdrop-blur-sm">
            <p className="text-2xl text-barrush-cream leading-relaxed font-light italic">
              "More than delivery – we curate moments of distinction. 
              Whether it's an intimate evening or grand celebration, 
              we bring the world's finest spirits to your sanctuary."
            </p>
            <div className="w-16 h-0.5 bg-barrush-gold mx-auto mt-8"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
