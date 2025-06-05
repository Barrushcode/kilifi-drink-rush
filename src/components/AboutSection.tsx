
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-barrush-charcoal">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-barrush-gold mb-8">
            About Barrush
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-barrush-burgundy/20 border-barrush-burgundy border">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">🍸</div>
                <h3 className="text-2xl font-bold text-barrush-gold mb-4">Locally Owned</h3>
                <p className="text-barrush-cream">
                  Born and raised in Kilifi County, we understand our community's taste 
                  and deliver exactly what you crave.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-barrush-burgundy/20 border-barrush-burgundy border">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-barrush-gold mb-4">Speed & Style</h3>
                <p className="text-barrush-cream">
                  We combine lightning-fast delivery with premium service. 
                  Your drinks arrive quickly and in perfect condition.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 p-8 bg-wood-texture rounded-lg border-2 border-barrush-gold">
            <p className="text-xl text-barrush-cream leading-relaxed">
              "Barrush isn't just about delivery – we're about creating moments. 
              Whether it's a quiet evening at home or a celebration with friends, 
              we bring the bar experience directly to your door."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
