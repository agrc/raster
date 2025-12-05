import { FirebaseAnalyticsProvider, FirebaseAppProvider } from '@ugrc/utah-design-system';
import type { ComponentType } from 'react';

const firebaseConfig = {
  apiKey: 'test-key',
  authDomain: '',
  projectId: 'test-project',
  storageBucket: '',
  messagingSenderId: '',
  appId: 'test-app-id',
  measurementId: '',
};

export const AnalyticsProviderDecorator = (Story: ComponentType) => (
  <FirebaseAppProvider config={firebaseConfig}>
    <FirebaseAnalyticsProvider>
      <Story />
    </FirebaseAnalyticsProvider>
  </FirebaseAppProvider>
);
