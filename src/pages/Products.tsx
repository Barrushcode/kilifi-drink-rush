
import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCatalog from '@/components/ProductCatalog';

// Move AnnouncementBar flush to the very top, and remove min-h-screen if not needed.
const Products = () => {
  return (
    <div className="bg-barrush-midnight">
      <AnnouncementBar />
      {/* Removed min-h-screen, no extra vertical space */}
      <ProductCatalog />
    </div>
  );
};

export default Products;
