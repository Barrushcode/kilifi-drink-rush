
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  bustCache?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "",
  priority = false,
  fallbackSrc = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  bustCache = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  console.log('🖼️ OptimizedImage rendering:', { src, alt, loading, error });

  useEffect(() => {
    // Add cache busting parameter if requested
    const cacheBustedSrc = bustCache ? `${src}?t=${Date.now()}` : src;
    setImageSrc(cacheBustedSrc);
    setLoading(true);
    setError(false);
    setRetryCount(0);
  }, [src, bustCache]);

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', imageSrc);
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    console.log(`❌ Image failed to load: ${imageSrc}, retry count: ${retryCount}`);
    setLoading(false);
    setError(true);
    
    if (imageSrc !== fallbackSrc && retryCount < 1) {
      console.log('🔄 Trying fallback image:', fallbackSrc);
      const cacheBustedFallback = bustCache ? `${fallbackSrc}?t=${Date.now()}` : fallbackSrc;
      setImageSrc(cacheBustedFallback);
      setLoading(true);
      setError(false);
      setRetryCount(prev => prev + 1);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <Skeleton 
          className="absolute inset-0"
          style={{ backgroundColor: '#374151' }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
      />
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(15, 20, 25, 0.6) 0%, transparent 100%)'
        }}
      />
      {error && !loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(55, 65, 81, 0.2)' }}
        >
          <span 
            className="text-sm"
            style={{ color: 'rgba(229, 231, 235, 0.6)' }}
          >
            Image unavailable
          </span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
