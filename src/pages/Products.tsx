
import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCatalog from '@/components/ProductCatalog';

// Tightly stack bar and catalog, remove all vertical space, bg only on mobile-friendly colors.
const Products = () => {
  return (
    <div className="bg-barrush-midnight min-h-screen">
      <AnnouncementBar />
      <ProductCatalog />
    </div>
  );
};

export default Products;
