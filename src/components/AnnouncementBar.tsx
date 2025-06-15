
import React from 'react';
import { Truck } from 'lucide-react';

// AnnouncementBar: sits directly below header, blue-to-pink gradient, animated marquee, always visible.
const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full h-12 flex items-center bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-white overflow-hidden">
      <div className="relative w-full h-full flex items-center">
        <div
          className="flex items-center animate-marquee whitespace-nowrap min-w-full h-full"
          style={{
            animation: "marquee-banner 16s linear infinite",
          }}
        >
          <span className="flex items-center text-sm md:text-base font-medium mr-16">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000!
            </span>
          </span>
          <span className="flex items-center text-sm md:text-base font-medium mr-16">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000!
            </span>
          </span>
          <span className="flex items-center text-sm md:text-base font-medium mr-16">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000!
            </span>
          </span>
        </div>
        {/* If animation fails, fallback static message */}
        <noscript>
          <span className="flex items-center text-sm md:text-base font-medium">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000!
            </span>
          </span>
        </noscript>
      </div>
      <style>{`
        @keyframes marquee-banner {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33%);
          }
        }
        .animate-marquee {
          will-change: transform;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 28s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;
