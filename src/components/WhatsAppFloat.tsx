import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat: React.FC = () => {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/254117808024', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className="h-16 w-16 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default WhatsAppFloat;