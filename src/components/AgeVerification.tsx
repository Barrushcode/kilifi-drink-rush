
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AgeVerificationProps {
  onVerified: () => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerified }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasVerified = localStorage.getItem('barrush-age-verified');
    if (!hasVerified) {
      setShow(true);
    } else {
      onVerified();
    }
  }, [onVerified]);

  const handleYes = () => {
    localStorage.setItem('barrush-age-verified', 'true');
    setShow(false);
    onVerified();
  };

  const handleNo = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-barrush-charcoal border-barrush-gold border-2 max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-barrush-gold mb-4">
              Age Verification Required
            </h2>
            <p className="text-barrush-cream text-lg mb-2">
              You must be 18+ to access this site.
            </p>
            <p className="text-barrush-cream/80">
              Are you of legal drinking age?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleYes}
              className="bg-barrush-gold hover:bg-barrush-gold/90 text-barrush-charcoal font-semibold flex-1"
            >
              ✅ Yes, I'm over 18
            </Button>
            <Button 
              onClick={handleNo}
              variant="outline"
              className="border-barrush-burgundy text-barrush-burgundy hover:bg-barrush-burgundy hover:text-white flex-1"
            >
              ❌ No
            </Button>
          </div>
          
          <p className="text-xs text-barrush-cream/60 mt-4">
            By clicking "Yes", you confirm you are 18+ years old
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeVerification;
