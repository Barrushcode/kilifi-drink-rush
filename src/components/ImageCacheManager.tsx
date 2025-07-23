import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, ImageIcon, Database } from 'lucide-react';
import { refreshImageCache } from '@/utils/supabaseImageUrl';
import { useToast } from '@/hooks/use-toast';

const ImageCacheManager: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefreshCache = async () => {
    setIsRefreshing(true);
    try {
      refreshImageCache();
      
      // Clear browser cache for images
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      toast({
        title: "Cache Refreshed",
        description: "Image cache has been cleared and will reload from Supabase storage.",
        duration: 3000,
      });
      
      // Reload the page to see fresh images
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Error refreshing cache:', error);
      toast({
        title: "Error",
        description: "Failed to refresh image cache",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="h-5 w-5" />
          Image Cache Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Refresh the image cache to ensure all product images from Supabase storage are loaded properly.
          </p>
          
          <Button 
            onClick={handleRefreshCache}
            disabled={isRefreshing}
            className="w-full flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Image Cache'}
          </Button>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="h-3 w-3" />
            This will reload all images from the Supabase pictures bucket
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCacheManager;