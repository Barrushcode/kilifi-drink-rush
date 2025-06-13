import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=85&fm=webp",
  priority = false,
  sizes = "(max-width: 768px) 200px, (max-width: 1024px) 300px, 400px"
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URLs
  const getOptimizedUrl = (url: string, width: number = 400) => {
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&h=${width}&q=85&fm=webp`;
    }
    return url;
  };

  // Create LQIP (Low Quality Image Placeholder)
  const getLqipUrl = (url: string) => {
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=20&h=20&q=20&fm=webp`;
    }
    return url;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [priority]);

  // Load image when in view
  useEffect(() => {
    if (!isInView) return;

    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 400 : 800;
    const optimizedSrc = getOptimizedUrl(src, width);
    
    setImageSrc(optimizedSrc);
  }, [isInView, src]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    console.log(`Image failed to load: ${imageSrc}`);
    setLoading(false);
    setError(true);
    
    if (imageSrc !== fallbackSrc) {
      const optimizedFallback = getOptimizedUrl(fallbackSrc);
      setImageSrc(optimizedFallback);
      setLoading(true);
      setError(false);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-barrush-steel/10 ${className}`} ref={imgRef}>
      {/* LQIP Background */}
      {loading && isInView && (
        <img
          src={getLqipUrl(src)}
          alt=""
          className="absolute inset-0 w-full h-full object-contain blur-sm scale-110"
          style={{ filter: 'blur(10px)' }}
        />
      )}
      
      {/* Loading Skeleton */}
      {loading && (
        <Skeleton className="absolute inset-0 bg-barrush-steel/20" />
      )}
      
      {/* Main Image - Changed to object-contain for full image visibility */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-contain transition-opacity duration-500 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          sizes={sizes}
          decoding="async"
        />
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-barrush-steel/20">
          <span className="text-barrush-platinum/60 text-xs font-iphone">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
