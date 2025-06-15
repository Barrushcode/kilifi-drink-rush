
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-r from-barrush-midnight to-barrush-slate py-12 px-4 lg:px-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="col-span-2">
          <h2 className="text-4xl lg:text-5xl font-bold text-barrush-platinum mb-4 font-serif">
            About Barrush
          </h2>
          <p className="text-lg lg:text-2xl text-barrush-platinum/90 mb-2 max-w-3xl">
            Barrush is Kilifi's premium urban drinks delivery, transforming how you enjoy cocktails, spirits, and curated beverages—delivered straight to your door with style, speed, and a touch of decadence.
          </p>
          <p className="text-base lg:text-lg text-barrush-platinum/70 max-w-2xl">
            Whether for a special celebration or just a relaxing evening in, we bring the bar experience right to you. Our team is passionate about making good times accessible—responsibly and reliably—across Kilifi County.
          </p>
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <Card className="bg-gradient-to-tr from-pink-600/80 to-indigo-900/80 backdrop-blur-xs border-none shadow-xl w-full max-w-xs">
            <CardContent className="flex flex-col items-center gap-2 py-8 px-6">
              <img
                src="/lovable-uploads/817c7ccd-c1cf-4844-8188-1b0d231cd0b9.png"
                alt="Barrush logo"
                className="w-20 h-20 object-contain mb-4 drop-shadow-lg"
              />
              <span className="text-2xl font-bold text-white font-serif">Est. Kilifi 2024</span>
              <span className="text-base text-barrush-platinum/80 text-center leading-tight">
                Your drink rush, your way.<br />See why Kilifi chooses Barrush for premium delivery.
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
