
import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCatalog from '@/components/ProductCatalog';
import SEOHead from '@/components/SEOHead';

// Desktop-optimized: background, layout, zero vertical gap; tight, wide content area for desktop.
const Products = () => {
  const productsStructuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Barrush Premium Alcohol Store",
    "description": "Premium alcohol delivery in Kilifi County - beer, wine, spirits, and cocktail ingredients",
    "url": "https://barrush.lovable.app/products",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Alcohol Catalog",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Beer Selection",
            "category": "Beer",
            "description": "Wide selection of local and imported beers delivered to your location in Kilifi"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Fine Wine Collection", 
            "category": "Wine",
            "description": "Curated wine selection for every occasion, delivered in Kilifi County"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Spirits",
            "category": "Spirits",
            "description": "High-quality whiskey, vodka, rum, gin and more delivered fast in Kilifi"
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <SEOHead
        title="Premium Alcohol Delivery Kilifi | Beer, Wine, Spirits | Fast Delivery Kenya"
        description="Order premium alcohol online in Kilifi County. Beer, wine, spirits, whiskey, vodka, gin delivered fast to your location. Best prices, wide selection, reliable delivery service."
        keywords="alcohol delivery Kilifi, beer delivery Kenya, wine delivery Kilifi County, spirits delivery, whiskey delivery, vodka delivery Kilifi, gin delivery, rum delivery, alcohol online Kilifi, fast alcohol delivery Kenya, premium alcohol Kilifi"
        url="https://barrush.lovable.app/products"
        structuredData={productsStructuredData}
      />
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen">
        {/* AnnouncementBar on product page only */}
        <AnnouncementBar />
        <ProductCatalog />
      </div>
    </div>
  );
};

export default Products;

