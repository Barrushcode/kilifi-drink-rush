
import React from 'react';
import CheckoutSection from '@/components/CheckoutSection';
import SEOHead from '@/components/SEOHead';

const Cart = () => {
  const cartStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shopping Cart - Barrush Alcohol Delivery",
    "description": "Review and checkout your alcohol delivery order for Kilifi County. Secure payment, fast delivery of beer, wine, spirits to your location.",
    "url": "https://barrush.lovable.app/cart",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Barrush",
      "url": "https://barrush.lovable.app"
    },
    "potentialAction": {
      "@type": "Order",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://barrush.lovable.app/cart"
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <SEOHead
        title="Shopping Cart | Checkout Alcohol Delivery Kilifi | Secure Payment | Barrush"
        description="Complete your alcohol delivery order for Kilifi County. Secure checkout, multiple payment options, fast delivery of premium beer, wine, spirits. Order now for quick delivery."
        keywords="alcohol delivery checkout Kilifi, beer wine spirits cart, secure payment alcohol delivery, Kilifi County alcohol order, premium alcohol checkout Kenya, fast delivery payment"
        url="https://barrush.lovable.app/cart"
        structuredData={cartStructuredData}
      />
      <div className="w-full max-w-5xl flex flex-col flex-1 min-h-screen pt-20">
        <CheckoutSection />
      </div>
    </div>
  );
};

export default Cart;
