
import React from 'react';
import { Truck } from 'lucide-react';

const AnnouncementBar: React.FC = () => {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500 text-white py-3 px-4 sm:px-6">
      <div className="absolute inset-0 flex items-center">
        <div
          className="animate-marquee whitespace-nowrap flex items-center justify-center w-full"
          style={{
            animation: 'marquee 15s linear infinite'
          }}
        >
          <span className="flex items-center space-x-2 text-sm md:text-base font-medium w-full">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000! 
            </span>
          </span>
          {/* Duplicate for smooth marquee */}
          <span className="flex items-center space-x-2 text-sm md:text-base font-medium w-full ml-16">
            <Truck className="h-5 w-5 flex-shrink-0 mr-2" />
            <span>
              🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000! 
            </span>
          </span>
        </div>
      </div>
      {/* Spacer to maintain bar height */}
      <div className="opacity-0">.</div>
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }
          @media (max-width: 640px) {
            .animate-marquee {
              animation-duration: 24s !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnnouncementBar;

