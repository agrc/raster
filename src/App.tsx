import { Drawer, Footer, Header, SocialMedia, UgrcLogo, useFirebaseApp } from '@ugrc/utah-design-system';
import { useEffect } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { ErrorBoundary } from 'react-error-boundary';
import { useOverlayTriggerState } from 'react-stately';
import { MapProvider } from './components/contexts/MapProvider';
import WizardMachineProvider from './components/contexts/WizardMachineProvider';
import { MapContainer } from './components/MapContainer';
import Wizard from './components/Wizard';
import config from './config';

const version = import.meta.env.PACKAGE_VERSION;

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

const links = [
  {
    key: 'UGRC Homepage',
    action: { url: 'https://gis.utah.gov' },
  },
  {
    key: 'Discover Product Page',
    action: { url: 'https://gis.utah.gov/products/discover/' },
  },
  {
    key: `Version ${version} changelog`,
    action: { url: `https://github.com/agrc/raster/releases/v${version}` },
  },
];

export default function App() {
  const app = useFirebaseApp();
  const sideBarState = useOverlayTriggerState({ defaultOpen: window.innerWidth >= config.MIN_DESKTOP_WIDTH });
  const sideBarTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    sideBarState,
  );

  // initialize firebase performance metrics
  useEffect(() => {
    async function initPerformance() {
      const { getPerformance } = await import('firebase/performance');

      return getPerformance(app);
    }

    if (!import.meta.env.DEV) {
      initPerformance();
    }
  }, [app]);

  return (
    <>
      <main className="flex h-screen flex-col md:gap-2">
        <Header links={links}>
          <div className="flex h-full grow items-center gap-3">
            <UgrcLogo />
            <h2 className="font-heading text-2xl font-black text-zinc-600 md:text-4xl lg:text-5xl dark:text-zinc-100">
              UGRC Raster Data Discovery
            </h2>
          </div>
        </Header>
        <section className="relative flex min-h-0 flex-1 overflow-x-hidden md:mr-2">
          <MapProvider>
            <Drawer main state={sideBarState} {...sideBarTriggerProps}>
              <WizardMachineProvider>
                <Wizard />
              </WizardMachineProvider>
            </Drawer>
            <div className="relative flex flex-1 flex-col rounded border border-b-0 border-zinc-200 dark:border-0 dark:border-zinc-700">
              <div className="relative flex-1 overflow-hidden dark:rounded">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <MapContainer />
                </ErrorBoundary>
              </div>
              <SocialMedia />
            </div>
          </MapProvider>
        </section>
      </main>
      <Footer />
    </>
  );
}
