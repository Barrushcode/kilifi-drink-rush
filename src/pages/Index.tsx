
import React from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CategoriesSlideshow from '@/components/CategoriesSlideshow';
import TrustSignalsSection from '@/components/TrustSignalsSection';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import DeliveryNotice from '@/components/DeliveryNotice';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <SEOHead
        title="Barrush - Premium Alcohol Delivery & Events in Kilifi County | Kenya"
        description="Fast, affordable alcohol delivery anywhere in Kilifi County. Premium spirits, beer, wine & cocktail ingredients. Event catering services. Order now — delivery within minutes!"
        keywords="alcohol delivery Kilifi County, events Kilifi, beer delivery Kenya, wine delivery Kilifi, spirits delivery, cocktail ingredients, party supplies Kilifi, alcohol delivery Kenya, premium alcohol delivery, Kilifi events, alcohol catering services, fast delivery Kilifi"
        url="https://barrush.lovable.app"
      />
      <DeliveryNotice />
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <CategoriesSlideshow />
        <TrustSignalsSection />
        <DeliveryZonesSection />
        <Footer />
      </div>
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
