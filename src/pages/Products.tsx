
import React from 'react';
import ProductCatalog from '@/components/ProductCatalog';
import AnnouncementBar from '@/components/AnnouncementBar';

const Products = () => {
  return (
    <div className="min-h-screen bg-barrush-midnight">
      <AnnouncementBar />
      <ProductCatalog />
    </div>
  );
};

export default Products;
