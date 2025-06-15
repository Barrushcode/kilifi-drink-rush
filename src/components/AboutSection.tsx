
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Desktop-friendly, multi-column About section
const aboutPoints = [
  {
    title: "Premium Selection",
    desc: "Handpicked spirits, wines, and beers curated for urban tastes.",
  },
  {
    title: "Expert Delivery",
    desc: "Fast, reliable service across Kilifi County from our local team.",
  },
  {
    title: "Mixologist Approved",
    desc: "Signature cocktails and pairings by Kenya's top mixologists.",
  },
  {
    title: "Flexible Payment",
    desc: "Pay with M-PESA, card, or cash. 100% secure and convenient.",
  },
];

const AboutSection: React.FC = () => (
  <section
    id="about"
    className="relative px-6 py-8 sm:py-12 lg:py-24 w-full bg-gradient-to-b from-transparent via-black/10 to-barrush-midnight"
  >
    <div className="mx-auto max-w-7xl">
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-rose-600 text-center">
        Why Barrush?
      </h2>
      <p className="text-lg md:text-xl lg:text-2xl text-barrush-platinum/90 max-w-3xl mx-auto mb-8 text-center leading-relaxed font-iphone">
        Urban sophistication meets local hospitality. Here's what sets us apart.
      </p>
      {/* Responsive grid for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-12">
        {aboutPoints.map((point, i) => (
          <Card
            key={i}
            className="bg-barrush-steel/40 border-barrush-steel/40 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full"
          >
            <CardContent className="p-6 lg:p-8 flex flex-col items-center text-center h-full">
              <h3 className="text-xl lg:text-2xl font-bold font-iphone mb-2 text-rose-400">{point.title}</h3>
              <p className="text-barrush-platinum/80 text-base lg:text-lg mb-1 leading-relaxed font-iphone">{point.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
