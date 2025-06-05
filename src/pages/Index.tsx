
import React, { useState } from 'react';
import AgeVerification from '@/components/AgeVerification';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DeliveryZonesSection from '@/components/DeliveryZonesSection';
import MixologistSection from '@/components/MixologistSection';
import ProductCatalog from '@/components/ProductCatalog';
import ProductUploadSection from '@/components/ProductUploadSection';
import CheckoutSection from '@/components/CheckoutSection';
import SupportSection from '@/components/SupportSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [ageVerified, setAgeVerified] = useState(false);

  if (!ageVerified) {
    return <AgeVerification onVerified={() => setAgeVerified(true)} />;
  }

  return (
    <div className="min-h-screen bg-barrush-midnight">
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <DeliveryZonesSection />
      <MixologistSection />
      <ProductCatalog />
      <ProductUploadSection />
      <CheckoutSection />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;
