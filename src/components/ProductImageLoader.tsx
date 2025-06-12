
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ProductImageLoader: React.FC<ProductImageLoaderProps> = ({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setLoading(true);
    setError(false);
  }, [src]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setLoading(true);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <Skeleton className="absolute inset-0 bg-barrush-steel/20" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-barrush-midnight/60 to-transparent group-hover:from-barrush-midnight/40 transition-all duration-300"></div>
    </div>
  );
};

export default ProductImageLoader;
