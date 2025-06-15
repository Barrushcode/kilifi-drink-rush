
import React from "react";
import { Truck } from "lucide-react";

// Always sits below header, has a strong blue-to-pink gradient and visible content.
const AnnouncementBar: React.FC = () => {
  return (
    <div
      className="w-full h-12 flex items-center overflow-hidden shadow border-2 border-pink-600"
      style={{
        background: "linear-gradient(90deg, #3b82f6 0%, #a78bfa 45%, #ec4899 100%)",
        color: "white",
        zIndex: 30,
        position: "relative",
        minHeight: "3rem",
      }}
    >
      <div className="relative w-full h-full flex items-center">
        <div
          className="flex items-center gap-8 animate-marquee whitespace-nowrap min-w-full h-full"
          style={{
            animation: "marquee-banner 16s linear infinite",
          }}
        >
          <span className="flex items-center text-white text-base font-semibold mr-16 drop-shadow">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000!
            </span>
          </span>
          <span className="flex items-center text-white text-base font-semibold mr-16 drop-shadow">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000!
            </span>
          </span>
          <span className="flex items-center text-white text-base font-semibold mr-16 drop-shadow">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000!
            </span>
          </span>
        </div>
        <noscript>
          <span className="flex items-center text-white text-base font-medium">
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
