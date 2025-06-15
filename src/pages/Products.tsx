
import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProductCatalog from '@/components/ProductCatalog';

// Desktop-optimized: background, layout, zero vertical gap; tight, wide content area for desktop.
const Products = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full flex flex-col flex-1 min-h-screen">
        {/* AnnouncementBar on product page only */}
        <AnnouncementBar />
        <main className="w-full max-w-[1600px] flex flex-col flex-1 mx-auto px-2 sm:px-6 lg:px-10 xl:px-20">
          <ProductCatalog />
        </main>
      </div>
    </div>
  );
};

export default Products;
