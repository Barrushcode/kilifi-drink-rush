
import React from 'react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full flex flex-col flex-1 min-h-screen">
        <HeroSection />
        {/* AboutSection already uses wide desktop layout */}
        <AboutSection />
        {/* HowItWorks + DeliveryZones in columns for desktop */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-12 lg:py-20">
          <div>
            <HowItWorksSection />
          </div>
          <div>
            <DeliveryZonesSection />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
