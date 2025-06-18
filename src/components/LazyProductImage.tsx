
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
        rootMargin: '50px' // Start loading 50px before the image comes into view
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

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isLoaded && (
        <Skeleton 
          className="absolute inset-0 bg-gray-700"
        />
      )}
      {isInView && (
        <OptimizedImage
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          priority={priority}
          bustCache={bustCache}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};

export default LazyProductImage;
