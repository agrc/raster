import esriConfig from '@arcgis/core/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import initializeTheme from '@ugrc/esri-theme-toggle';
import { FirebaseAnalyticsProvider, FirebaseAppProvider } from '@ugrc/utah-design-system';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

esriConfig.assetsPath = './assets';
initializeTheme();

let firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

if (import.meta.env.VITE_FIREBASE_CONFIG) {
  firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
}

console.log(`Raster app version: ${import.meta.env.PACKAGE_VERSION}`);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider config={firebaseConfig}>
      <FirebaseAnalyticsProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </FirebaseAnalyticsProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
);
