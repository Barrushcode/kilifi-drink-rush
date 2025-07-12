import React, { useEffect, useState } from 'react';

interface MobileSplashScreenProps {
  onHide: () => void;
}

const MobileSplashScreen: React.FC<MobileSplashScreenProps> = ({ onHide }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onHide();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
      <div className="text-center">
        <div className="mb-8 animate-bounce">
          <img 
            src="/lovable-uploads/4c04bd38-2934-4f85-8897-76401cef6d00.png" 
            alt="Barrush Logo" 
            className="w-24 h-24 mx-auto rounded-2xl shadow-lg"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">
          Barrush
        </h1>
        <p className="text-white/80 text-lg animate-fade-in">
          Premium Alcohol Delivery
        </p>
        <div className="mt-8">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default MobileSplashScreen;