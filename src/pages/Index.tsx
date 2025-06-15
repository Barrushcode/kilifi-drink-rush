
import React from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      {/* Remove max-w to allow full width on desktop; add horizontal padding for breathing space */}
      <div className="w-full flex flex-col flex-1 min-h-screen px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32">
        {/* Hero goes edge-to-edge */}
        <HeroSection />
        {/* About and HowItWorks in a 2-column grid on large screens, stacked on mobile */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 my-12">
          <AboutSection />
          <HowItWorksSection />
        </div>
        {/* DeliveryZones spans full width */}
        <div className="w-full my-12">
          <DeliveryZonesSection />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
