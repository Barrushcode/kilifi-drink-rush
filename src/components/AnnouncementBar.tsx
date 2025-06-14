
import React from 'react';
import { Truck } from 'lucide-react';

const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white py-3 px-6 m-0">
      <div className="container mx-auto m-0">
        <div className="flex items-center justify-center space-x-2 text-sm md:text-base font-medium">
          <Truck className="h-5 w-5" />
          <span>
            🎉 <strong>FREE DELIVERY</strong> on orders above KES 5,000! 
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
