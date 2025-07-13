import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, X, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
const DeliveryNotice = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return <div className="fixed top-20 left-4 right-4 z-50 animate-fade-in">
      <Alert className="bg-background/80 backdrop-blur-md border-border/50 shadow-lg">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <AlertDescription className="text-foreground font-medium">
              
              <div className="mb-2 text-sm bg-muted/50 p-2 rounded-md border border-border/30">
                ⚠️ <strong>Important:</strong> Please check product availability before purchase by using the "Check Availability" button on each product
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wrench className="h-4 w-4" />
                <span>We're working on a 24/7 platform for round-the-clock service!</span>
              </div>
            </AlertDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-1 h-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>;
};
export default DeliveryNotice;