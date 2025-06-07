
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProductLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-glass-effect border-barrush-steel/30">
          <Skeleton className="h-64 w-full" />
          <CardContent className="p-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductLoadingSkeleton;
