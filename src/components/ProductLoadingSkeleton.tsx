
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProductLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 max-w-full mx-auto">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="bg-glass-effect border-barrush-steel/30 min-h-[400px] flex flex-col animate-pulse">
          <Skeleton className="h-64 w-full bg-gray-700 rounded-t-lg" />
          <CardContent className="p-4 lg:p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4 bg-gray-700 rounded" />
              <Skeleton className="h-4 w-1/2 bg-gray-700 rounded" />
              <Skeleton className="h-3 w-full bg-gray-700 rounded" />
              <Skeleton className="h-3 w-2/3 bg-gray-700 rounded" />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Skeleton className="h-6 w-1/3 bg-gray-700 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 bg-gray-700 rounded" />
                <Skeleton className="h-10 flex-1 bg-gray-700 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductLoadingSkeleton;
