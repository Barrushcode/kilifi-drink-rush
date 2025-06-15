
import React from 'react';
// Removed import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCatalog from '@/components/ProductCatalog';

// Desktop-optimized: background, layout, zero vertical gap; tight, wide content area for desktop.
const Products = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen">
        {/* AnnouncementBar is now shown globally. */}
        <ProductCatalog />
      </div>
    </div>
  );
};

export default Products;

