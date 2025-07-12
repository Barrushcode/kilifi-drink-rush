import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, X, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeliveryNotice = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-fade-in">
      <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <AlertDescription className="text-amber-800 font-medium">
              <div className="mb-2">
                🕔 <strong>Delivery Hours:</strong> We deliver until 5:00 PM daily
              </div>
              <div className="mb-2 text-sm bg-amber-100 p-2 rounded-md border border-amber-200">
                ⚠️ <strong>Important:</strong> Please check product availability before purchase by using the "Check Availability" button on each product
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wrench className="h-4 w-4" />
                <span>We're working on a 24/7 platform for round-the-clock service!</span>
              </div>
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default DeliveryNotice;