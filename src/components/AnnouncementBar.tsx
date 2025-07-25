
import React from "react";
import { Truck, Clock } from "lucide-react";

// Subtle but noticeable announcement bar with alternating messages
const AnnouncementBar: React.FC = () => {
  return (
    <div
      className="w-full h-8 flex items-center overflow-hidden shadow-sm border-b border-white/20 mt-20 lg:mt-24"
      style={{
        background: "var(--gradient-neon)",
        color: "white",
        zIndex: 10,
        position: "relative",
        minHeight: "2rem",
      }}
    >
      <div className="relative w-full h-full flex items-center">
        <div
          className="flex items-center gap-16 animate-marquee whitespace-nowrap min-w-full h-full"
          style={{
            animation: "marquee-banner 20s linear infinite",
          }}
        >
          <span className="flex items-center text-white text-sm font-semibold mr-16">
            <Truck className="h-4 w-4 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> for orders above KES 5,000!
            </span>
          </span>
          <span className="flex items-center text-white text-sm font-semibold mr-16">
            <Clock className="h-4 w-4 flex-shrink-0 mr-2" />
            <span>
              ⚡ <strong>98% of deliveries</strong> completed in under 25mins last week and we are only getting faster
            </span>
          </span>
          <span className="flex items-center text-white text-sm font-semibold mr-16">
            <Truck className="h-4 w-4 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> for orders above KES 5,000!
            </span>
          </span>
          <span className="flex items-center text-white text-sm font-semibold mr-16">
            <Clock className="h-4 w-4 flex-shrink-0 mr-2" />
            <span>
              ⚡ <strong>98% of deliveries</strong> completed in under 25mins last week and we are only getting faster
            </span>
          </span>
        </div>
        <noscript>
          <span className="flex items-center text-white text-sm font-medium">
            <Truck className="h-4 w-4 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> for orders above KES 5,000!
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
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          will-change: transform;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 32s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBar;

