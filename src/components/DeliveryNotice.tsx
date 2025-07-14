import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, X, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
const DeliveryNotice = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return <div className="fixed top-20 right-4 z-50 animate-slide-in-right max-w-md">
      <Alert className="bg-black/80 backdrop-blur-md border-white/20 shadow-lg">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-white/80 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <AlertDescription className="text-white font-medium">
              
              <div className="mb-2 text-sm bg-white/10 p-2 rounded-md border border-white/20">
                ⚠️ <strong>Important:</strong> Please check product availability before purchase by using the "Check Availability" button on each product
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wrench className="h-4 w-4" />
                <span>We're working on a 24/7 platform for round-the-clock service!</span>
              </div>
            </AlertDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 h-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>;
};
export default DeliveryNotice;