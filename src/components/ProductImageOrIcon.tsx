
import React, { useState } from 'react';
import { Wine, Beer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductImageOrIconProps {
  src?: string;
  alt: string;
  category: string;
  className?: string;
}

// Helper: returns the proper Lucide icon for the category
const getCategoryIcon = (category: string) => {
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes('beer')) {
    return <Beer size={56} color="#eab308" className="opacity-80" />;
  }
  return <Wine size={56} color="#db2777" className="opacity-80" />;
};

const ProductImageOrIcon: React.FC<ProductImageOrIconProps> = ({
  src,
  alt,
  category,
  className = "",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Show icon fallback if: empty src OR error loading image
  const showIcon = !src || errored;

  return (
    <div 
      className={`relative flex items-center justify-center w-full h-full aspect-square bg-gray-900 overflow-hidden ${className}`}
      aria-label={alt}
    >
      {/* Loader */}
      {!showIcon && !loaded && (
        <Skeleton className="absolute inset-0 bg-barrush-steel/20" />
      )}
      {/* Render category icon as fallback */}
      {showIcon ? (
        <div className="flex items-center justify-center w-full h-full">
          {getCategoryIcon(category)}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`object-contain w-full h-full transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default ProductImageOrIcon;
