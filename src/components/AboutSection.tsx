import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
const AboutSection: React.FC = () => {
  return <section id="about" className="py-24 bg-gradient-to-b from-barrush-midnight to-barrush-slate relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 font-serif text-fuchsia-50">
            About Barrush
          </h2>
          <div className="w-16 h-px bg-barrush-copper mx-auto mb-16"></div>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <Card className="bg-glass-effect border-barrush-steel/30 border backdrop-blur-md hover:border-barrush-copper/50 transition-all duration-300">
              <CardContent className="p-10">
                <div className="text-6xl mb-6">🥃</div>
                <h3 className="text-3xl font-bold mb-6 font-serif text-zinc-50">Urban Curated</h3>
                <p className="text-barrush-platinum/90 text-lg leading-relaxed">
                  Locally sourced in Kilifi County with a metropolitan edge. 
                  Every bottle represents the perfect blend of sophistication and accessibility.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-glass-effect border-barrush-steel/30 border backdrop-blur-md hover:border-barrush-copper/50 transition-all duration-300">
              <CardContent className="p-10">
                <div className="text-6xl mb-6">⚡</div>
                <h3 className="text-3xl font-bold mb-6 font-serif text-zinc-50">Modern Efficiency</h3>
                <p className="text-barrush-platinum/90 text-lg leading-relaxed">
                  Streamlined delivery meets premium service. Your selections 
                  arrive swiftly with the precision of modern urban logistics.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 p-12 bg-glass-effect rounded-xl border border-barrush-steel/30 backdrop-blur-md">
            <p className="text-2xl text-barrush-platinum leading-relaxed font-light italic">
              "Where urban sophistication meets premium delivery. 
              We don't just deliver drinks – we deliver experiences 
              that elevate your evening."
            </p>
            <div className="w-12 h-px bg-barrush-copper mx-auto mt-8"></div>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;