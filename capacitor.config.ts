import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b414652b2ce747e1b30db97fdc6f4d72',
  appName: 'kilifi-drink-rush',
  webDir: 'dist',
  server: {
    url: 'https://b414652b-2ce7-47e1-b30d-b97fdc6f4d72.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ec4899',
      showSpinner: false
    }
  }
};

export default config;