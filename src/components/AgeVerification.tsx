
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
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-barrush-midnight border-neon-blue border-2 max-w-md w-full
                    shadow-[0_0_40px_theme(colors.neon.blue/0.6)] animate-pulse">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neon-blue mb-4 font-serif tracking-wide
                          drop-shadow-[0_0_15px_theme(colors.neon.blue/0.8)] animate-pulse">
              Age Verification
            </h2>
            <div className="w-16 h-0.5 bg-neon-blue mx-auto mb-6 shadow-[0_0_10px_theme(colors.neon.blue/0.8)]"></div>
            <p className="text-neon-blue/80 text-xl mb-4 drop-shadow-[0_0_8px_theme(colors.neon.blue/0.4)]">
              You must be 18+ to access this site
            </p>
            <p className="text-neon-blue/70">
              Are you of legal drinking age?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleYes}
              className="bg-neon-blue hover:bg-neon-blue/90 text-black font-semibold flex-1
                        shadow-[0_0_25px_theme(colors.neon.blue/0.8)] hover:shadow-[0_0_35px_theme(colors.neon.blue)]
                        transition-all duration-300 animate-pulse border border-neon-blue/80"
            >
              ✓ Yes, I'm over 18
            </Button>
            <Button 
              onClick={handleNo}
              variant="outline"
              className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 flex-1
                        shadow-[0_0_15px_theme(colors.neon.pink/0.5)] hover:shadow-[0_0_25px_theme(colors.neon.pink/0.7)]
                        transition-all duration-300"
            >
              ✗ No, I'm under 18
            </Button>
          </div>
          
          <p className="text-xs text-neon-blue/60 mt-6">
            By clicking "Yes", you confirm you are 18+ years old
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeVerification;
