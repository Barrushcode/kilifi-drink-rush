import { useState, useEffect } from 'react';

interface MobileCapabilities {
  isNative: boolean;
  platform: 'ios' | 'android' | 'web';
  isOnline: boolean;
  canShare: boolean;
}

export const useMobileCapabilities = (): MobileCapabilities => {
  const [capabilities, setCapabilities] = useState<MobileCapabilities>({
    isNative: false,
    platform: 'web',
    isOnline: navigator.onLine,
    canShare: false
  });

  useEffect(() => {
    const checkCapabilities = async () => {
      // Check if running in Capacitor
      const isNative = !!(window as any).Capacitor;
      
      // Detect platform
      let platform: 'ios' | 'android' | 'web' = 'web';
      if (isNative) {
        const platformInfo = (window as any).Capacitor?.getPlatform?.();
        platform = platformInfo || 'web';
      } else {
        // Fallback platform detection
        const userAgent = navigator.userAgent;
        if (/iPad|iPhone|iPod/.test(userAgent)) {
          platform = 'ios';
        } else if (/Android/.test(userAgent)) {
          platform = 'android';
        }
      }

      // Check Web Share API support
      const canShare = 'share' in navigator;

      setCapabilities({
        isNative,
        platform,
        isOnline: navigator.onLine,
        canShare
      });
    };

    checkCapabilities();

    // Listen for online/offline events
    const handleOnline = () => setCapabilities(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setCapabilities(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return capabilities;
};

// Helper functions for mobile-specific features
export const shareContent = async (content: {
  title: string;
  text: string;
  url: string;
}) => {
  if ('share' in navigator) {
    try {
      await navigator.share(content);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }
  
  // Fallback to copying to clipboard
  if ((navigator as any).clipboard) {
    try {
      await (navigator as any).clipboard.writeText(content.url);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
  
  return false;
};

export const vibrate = (pattern: number | number[] = 200) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};