import React, { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';

const FreeDeliveryBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner after 2 seconds on products page
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-lg shadow-elegant p-4 max-w-sm text-white border border-white/20">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            <Truck className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">
              🚚 Free delivery on orders above KES 5,000! Order now and save on delivery fees.
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeDeliveryBanner;