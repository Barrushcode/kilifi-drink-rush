
import React from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-[1600px] flex flex-col flex-1 min-h-screen bg-transparent">
        {/* Main hero/header row - full width for desktop */}
        <HeroSection />
        {/* Desktop grid for main homepage sections */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12 px-0 xl:px-12 2xl:px-24">
          <div className="col-span-2 flex flex-col gap-8">
            <AboutSection />
            <HowItWorksSection />
          </div>
          <div className="flex flex-col gap-8">
            <DeliveryZonesSection />
            <Footer />
          </div>
        </div>
        {/* Mobile: Stack all sections */}
        <div className="xl:hidden flex flex-col w-full">
          <AboutSection />
          <HowItWorksSection />
          <DeliveryZonesSection />
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default Index;
