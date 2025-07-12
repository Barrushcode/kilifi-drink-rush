import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useMobileCapabilities, vibrate } from '@/hooks/useMobileCapabilities';

const WhatsAppFloat: React.FC = () => {
  const { platform, isNative } = useMobileCapabilities();

  const handleWhatsAppClick = () => {
    // Provide haptic feedback on mobile
    if (isNative || platform !== 'web') {
      vibrate(50);
    }
    
    window.open('https://wa.me/254117808024', '_blank');
  };

  return (
    <div className={`fixed z-50 animate-bounce ${
      isNative ? 'bottom-8 right-6' : 'bottom-6 right-6'
    }`}>
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className={`rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-feedback ${
          isNative ? 'h-14 w-14' : 'h-16 w-16'
        }`}
        style={{
          marginBottom: isNative && platform === 'ios' ? 'env(safe-area-inset-bottom)' : '0'
        }}
      >
        <MessageCircle className={isNative ? 'h-6 w-6' : 'h-8 w-8'} />
      </Button>
    </div>
  );
};

export default WhatsAppFloat;