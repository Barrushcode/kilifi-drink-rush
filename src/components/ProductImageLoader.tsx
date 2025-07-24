
import React from 'react';
import LazyProductImage from './LazyProductImage';

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
  // Determine if cache busting is needed for external images
  const shouldBustCache = src.includes('drinksvine') || src.includes('Product image URL');
  
  return (
    <LazyProductImage
      src={src}
      alt={alt}
      className={`${className} rounded-lg w-full h-auto`}
      priority={priority}
      bustCache={shouldBustCache}
    />
  );
};

export default ProductImageLoader;
