import { Drawer } from '@ugrc/utah-design-system/components/Drawer';
import { SocialMedia } from '@ugrc/utah-design-system/components/SocialMedia';
import { useFirebaseApp } from '@ugrc/utah-design-system/contexts/FirebaseAppProvider';
import { useEffect } from 'react';
import { useOverlayTrigger } from 'react-aria';
import { ErrorBoundary } from 'react-error-boundary';
import { useOverlayTriggerState } from 'react-stately';
import { MapContainer } from './components/MapContainer';
import UtahChrome from './components/UtahChrome';
import Wizard from './components/Wizard';
import config from './config';
import { MapProvider } from './contexts/MapProvider';
import PreviewProvider from './contexts/PreviewProvider';
import TilesContextProvider from './contexts/TilesContextProvider';
import WizardMachineProvider from './contexts/WizardMachineProvider';
import { useUrlParams } from './hooks/useUrlParams';

const ErrorFallback = ({ error }: { error: unknown }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error instanceof Error ? error.message : String(error)}</pre>
    </div>
  );
};

export default function App() {
  const app = useFirebaseApp();
  const sideBarState = useOverlayTriggerState({ defaultOpen: window.innerWidth >= config.MIN_DESKTOP_WIDTH });
  const sideBarTriggerProps = useOverlayTrigger(
    {
      type: 'dialog',
    },
    sideBarState,
  );
  const { title } = useUrlParams();

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
      <div className="flex h-screen flex-col">
        <div id="utah-header-target" />
        <UtahChrome title={title ?? 'UGRC Raster Data Discovery'} />
        <main id="main-content" tabIndex={-1} className="mt-2 flex min-h-0 flex-1 flex-col md:gap-2">
          <section className="relative flex min-h-0 flex-1 overflow-x-hidden md:mr-2">
            <MapProvider>
              <TilesContextProvider>
                <PreviewProvider>
                  <Drawer main state={sideBarState} {...sideBarTriggerProps} size="large">
                    <WizardMachineProvider>
                      <h1 className="sr-only">Raster Data Discovery Wizard</h1>
                      <h2 className="sr-only">Follow the four steps to discover and download raster data</h2>
                      <Wizard />
                      <div className="qualtrics-survey m-2 rounded-lg bg-gray-100 px-2 pt-1 pb-2 text-sm"></div>
                    </WizardMachineProvider>
                  </Drawer>
                  <div className="relative flex min-h-0 flex-1 flex-col rounded border border-b-0 border-zinc-200 dark:border-0 dark:border-zinc-700">
                    <div className="relative min-h-0 flex-1 overflow-hidden dark:rounded">
                      <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <MapContainer />
                      </ErrorBoundary>
                    </div>
                    <SocialMedia />
                  </div>
                </PreviewProvider>
              </TilesContextProvider>
            </MapProvider>
          </section>
        </main>
      </div>
      <div id="utah-footer-target" />
    </>
  );
}
