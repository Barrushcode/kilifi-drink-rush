
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
      <Card className="bg-barrush-midnight border-barrush-copper border-2 max-w-md w-full
                    shadow-[0_0_40px_rgba(201,169,110,0.3)]">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-barrush-copper mb-4 font-serif tracking-wide
                          drop-shadow-[0_0_8px_rgba(201,169,110,0.5)]">
              Age Verification
            </h2>
            <div className="w-16 h-0.5 bg-barrush-copper mx-auto mb-6"></div>
            <p className="text-barrush-platinum text-xl mb-4">
              You must be 18+ to access this site
            </p>
            <p className="text-barrush-platinum/80">
              Are you of legal drinking age?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleYes}
              className="bg-barrush-copper hover:bg-barrush-copper/90 text-barrush-midnight font-semibold flex-1
                        shadow-[0_0_15px_rgba(201,169,110,0.5)] hover:shadow-[0_0_20px_rgba(201,169,110,0.7)]
                        transition-all duration-300 animate-pulse"
            >
              ✓ Yes, I'm over 18
            </Button>
            <Button 
              onClick={handleNo}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 flex-1
                        shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]
                        transition-all duration-300"
            >
              ✗ No, I'm under 18
            </Button>
          </div>
          
          <p className="text-xs text-barrush-platinum/60 mt-6">
            By clicking "Yes", you confirm you are 18+ years old
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeVerification;
