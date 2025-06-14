
import React from 'react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

interface GroupedProductCardImageProps {
  src: string;
  alt: string;
}

const GroupedProductCardImage: React.FC<GroupedProductCardImageProps> = ({ src, alt }) => {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className="w-full h-56 object-cover rounded-t-2xl"
        style={{ filter: "brightness(1)" }}
        loading="lazy"
        onError={e => {
          if ((e.currentTarget as HTMLImageElement).src !== FALLBACK_IMAGE) {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }
        }}
      />
    </div>
  );
};

export default GroupedProductCardImage;
