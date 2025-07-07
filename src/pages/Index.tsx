
import React from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CategoriesSlideshow from '@/components/CategoriesSlideshow';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <CategoriesSlideshow />
        <DeliveryZonesSection />
        <Footer />
      </div>
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
