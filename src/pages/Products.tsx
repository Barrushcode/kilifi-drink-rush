
import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCatalog from '@/components/ProductCatalog';

// Desktop-optimized: background, layout, zero vertical gap; tight, wide content area for desktop.
const Products = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      {/* Bump max-w to 1600px for desktop */}
      <div className="w-full max-w-[1600px] flex flex-col flex-1 min-h-screen px-0 xl:px-10 2xl:px-16">
        {/* AnnouncementBar on product page only */}
        <AnnouncementBar />
        {/* ProductCatalog grid already has good desktop grid, but adjust paddings */}
        <ProductCatalog />
      </div>
    </div>
  );
};
export default Products;
