
import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import OptimizedImage from './OptimizedImage';

interface LazyProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  bustCache?: boolean;
}

const LazyProductImage: React.FC<LazyProductImageProps> = ({
  src,
  alt,
  className = "",
  priority = false,
  bustCache = false
}) => {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Increased for better UX - start loading earlier
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsLoaded(true); // Still hide skeleton even on error
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <Skeleton 
          className="absolute inset-0 bg-gray-700 animate-pulse"
        />
      )}
      {isInView && (
        <OptimizedImage
          src={src}
          alt={alt}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          priority={priority}
          bustCache={bustCache}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default LazyProductImage;
