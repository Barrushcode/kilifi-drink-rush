
import React from 'react';
import OptimizedImage from './OptimizedImage';

interface ProductImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

const ProductImageLoader: React.FC<ProductImageLoaderProps> = ({
  src,
  alt,
  className = "",
  priority = false
}) => {
  // Add cache busting for product images to ensure fresh content
  const shouldBustCache = src.includes('drinksvine') || src.includes('Product image URL');
  
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      bustCache={shouldBustCache}
    />
  );
};

export default ProductImageLoader;
