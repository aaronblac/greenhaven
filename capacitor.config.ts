import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blackverse.greenhaven',
  appName: 'GreenHaven',
  webDir: 'dist',
  server: {
    iosScheme: 'capacitor', // Ensures correct loading on iOS
    cleartext: true, // Allows HTTP connections during development if needed
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // Ensures the splash screen hides automatically
      launchShowDuration: 1000 // Display splash for 1 second
    }
  }
};

export default config;
