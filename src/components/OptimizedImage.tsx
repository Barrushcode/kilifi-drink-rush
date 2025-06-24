
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  bustCache?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "",
  priority = false,
  fallbackSrc = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
  bustCache = false,
  onLoad,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Optimize image URL for better performance
  const optimizeImageUrl = (url: string): string => {
    // If it's an Unsplash image, add optimization parameters
    if (url.includes('unsplash.com')) {
      const optimizedUrl = new URL(url);
      optimizedUrl.searchParams.set('w', '400');
      optimizedUrl.searchParams.set('q', '75');
      optimizedUrl.searchParams.set('auto', 'format');
      optimizedUrl.searchParams.set('fit', 'crop');
      return optimizedUrl.toString();
    }
    
    // Add cache busting if requested
    if (bustCache) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}t=${Date.now()}`;
    }
    
    return url;
  };

  useEffect(() => {
    const optimizedSrc = optimizeImageUrl(src);
    setImageSrc(optimizedSrc);
    setLoading(true);
    setError(false);
    setRetryCount(0);
  }, [src, bustCache]);

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', imageSrc);
    setLoading(false);
    setError(false);
    onLoad?.();
  };

  const handleImageError = () => {
    console.log(`❌ Image failed to load: ${imageSrc}, retry count: ${retryCount}`);
    setLoading(false);
    setError(true);
    
    if (imageSrc !== fallbackSrc && retryCount < 1) {
      console.log('🔄 Trying fallback image:', fallbackSrc);
      const optimizedFallback = optimizeImageUrl(fallbackSrc);
      setImageSrc(optimizedFallback);
      setLoading(true);
      setError(false);
      setRetryCount(prev => prev + 1);
    } else {
      onError?.();
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
        className={`w-full h-full object-contain transition-opacity duration-500 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          maxWidth: '100%',
          height: 'auto'
        }}
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
