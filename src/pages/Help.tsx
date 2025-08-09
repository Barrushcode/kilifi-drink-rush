
import React from 'react';
import SupportSection from '@/components/SupportSection';
import SEOHead from '@/components/SEOHead';

const Help = () => {
  const helpStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What areas do you deliver to in Kilifi County?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We deliver premium alcohol throughout Kilifi County including Malindi, Watamu, Kilifi Town, and surrounding areas. Fast delivery within minutes."
        }
      },
      {
        "@type": "Question", 
        "name": "How fast is alcohol delivery in Kilifi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer rapid alcohol delivery within minutes to most locations in Kilifi County. Delivery times may vary based on location and order size."
        }
      },
      {
        "@type": "Question",
        "name": "What types of alcohol do you deliver?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We deliver premium beer, wine, spirits, whiskey, vodka, gin, cocktail ingredients and party supplies throughout Kilifi County."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <SEOHead
        title="Help & Support | Alcohol Delivery FAQ Kilifi County | Barrush"
        description="Get help with alcohol delivery in Kilifi County. FAQ about beer, wine, spirits delivery, payment methods, delivery areas in Malindi, Watamu, Kilifi Town. Customer support available."
        keywords="alcohol delivery help Kilifi, beer delivery FAQ Kenya, wine delivery support, spirits delivery questions, Kilifi County delivery areas, Malindi alcohol delivery, Watamu delivery service, customer support alcohol delivery"
        url="https://barrush.lovable.app/help"
        structuredData={helpStructuredData}
      />
      <div className="w-full max-w-5xl flex flex-col flex-1 min-h-screen pt-20">
        <SupportSection />
      </div>
    </div>
  );
};

export default Help;
