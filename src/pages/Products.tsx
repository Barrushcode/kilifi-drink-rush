
import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCatalog from '@/components/ProductCatalog';

// Move AnnouncementBar flush to the very top, and remove min-h-screen if not needed.
const Products = () => {
  return (
    <div className="bg-barrush-midnight">
      <AnnouncementBar />
      <ProductCatalog />
    </div>
  );
};

export default Products;
