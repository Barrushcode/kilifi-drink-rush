
import React from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <DeliveryZonesSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
