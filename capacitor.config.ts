import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trimelcas',
  appName: 'trimelcas',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
