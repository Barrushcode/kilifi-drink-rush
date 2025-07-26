import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Barrush - Premium Alcohol Delivery | Kilifi County",
  description = "Fast, affordable alcohol delivery anywhere in Kilifi. Order now — delivery within minutes!",
  keywords = "alcohol delivery Kilifi, events Kilifi, beer delivery, wine delivery, spirits delivery, cocktail ingredients, Kilifi County alcohol, party supplies Kilifi, alcohol delivery Kenya, premium alcohol delivery",
  image = "/lovable-uploads/817c7ccd-c1cf-4844-8188-1b0d231cd0b9.png",
  url = "https://barrush.lovable.app",
  type = "website",
  structuredData
}) => {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Barrush",
    "description": "Premium alcohol delivery service in Kilifi County, Kenya",
    "url": url,
    "image": image,
    "telephone": "+254 794 449 196",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Kenya",
      "addressRegion": "Kilifi County",
      "addressLocality": "Kilifi"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-3.6317",
      "longitude": "39.8486"
    },
    "openingHours": "Mo-Su 09:00-22:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "-3.6317",
        "longitude": "39.8486"
      },
      "geoRadius": "50000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Alcohol Delivery Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Beer Delivery"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wine Delivery"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Spirits Delivery"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Event Catering Services"
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Barrush" />
      <meta property="og:locale" content="en_KE" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;