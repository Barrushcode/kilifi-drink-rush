
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AgeVerificationProps {
  onVerified: () => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerified }) => {
  const [show, setShow] = useState(true); // Default to true to show immediately

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem('barrush-age-verified');
    if (hasVerified === 'true') {
      setShow(false);
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
      <Card className="bg-barrush-midnight border-cyan-400 border-2 max-w-md w-full
                    shadow-[0_0_40px_rgba(34,211,238,0.6)] animate-pulse">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-serif tracking-wide
                          drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse">
              Age Verification
            </h2>
            <div className="w-16 h-0.5 bg-cyan-400 mx-auto mb-6 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            <p className="text-cyan-300 text-xl mb-4 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              You must be 18+ to access this site
            </p>
            <p className="text-cyan-200/80">
              Are you of legal drinking age?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleYes}
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold flex-1
                        shadow-[0_0_25px_rgba(34,211,238,0.8)] hover:shadow-[0_0_35px_rgba(34,211,238,1)]
                        transition-all duration-300 animate-pulse border border-cyan-300"
            >
              ✓ Yes, I'm over 18
            </Button>
            <Button 
              onClick={handleNo}
              variant="outline"
              className="border-red-400 text-red-400 hover:bg-red-400/20 flex-1
                        shadow-[0_0_15px_rgba(248,113,113,0.5)] hover:shadow-[0_0_25px_rgba(248,113,113,0.7)]
                        transition-all duration-300"
            >
              ✗ No, I'm under 18
            </Button>
          </div>
          
          <p className="text-xs text-cyan-200/60 mt-6">
            By clicking "Yes", you confirm you are 18+ years old
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeVerification;
