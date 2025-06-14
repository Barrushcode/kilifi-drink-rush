
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProductLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto w-full">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-glass-effect border-barrush-steel/30 min-h-[250px] flex flex-col">
          <Skeleton className="h-20 md:h-32 w-full" />
          <CardContent className="p-4 md:p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductLoadingSkeleton;
