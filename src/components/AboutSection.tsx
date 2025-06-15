
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * About section - now styled for a more spacious, immersive desktop look.
 */
const AboutSection: React.FC = () => {
  return (
    <Card className="w-full h-full shadow-lg bg-barrush-slate border-none">
      <CardContent className="px-8 py-8 lg:py-16 xl:px-16 flex flex-col justify-center h-full">
        <h2 className="text-2xl md:text-3xl xl:text-5xl font-serif font-bold text-barrush-gold mb-6 tracking-tight">
          About Barrush
        </h2>
        <p className="text-base md:text-lg xl:text-2xl text-barrush-platinum/90 leading-relaxed mb-4">
          Barrush delivers top-shelf spirits, wine, beer, and curated cocktails to your doorstep in less than 45 minutes. We handpick brands, guarantee freshness, and offer urban hospitality—straight to you.
        </p>
        <ul className="list-disc list-inside xl:text-xl text-barrush-platinum/80 space-y-1 pl-4">
          <li>Locally stocked—always in your neighborhood</li>
          <li>Immediate fulfillment in Kilifi County</li>
          <li>Perfect for parties, gifting, and late-night plans</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
