import { useActor } from '@xstate/react';
import { createContext, useMemo } from 'react';
import { useUrlParams } from '../hooks/useUrlParams';
import { getInitialState, machine } from '../services/wizardMachine';

export const WizardMachineContext = createContext<{
  snapshot: ReturnType<typeof useActor<typeof machine>>[0];
  send: ReturnType<typeof useActor<typeof machine>>[1];
} | null>(null);

export default function WizardMachineProvider({ children }: { children: React.ReactNode }) {
  const urlParams = useUrlParams();

  // Get initial state based on URL parameters
  const initialState = useMemo(
    () =>
      getInitialState({
        cat: urlParams.cat,
        catGroup: urlParams.catGroup,
        products: urlParams.products,
      }),
    [urlParams.cat, urlParams.catGroup, urlParams.products],
  );

  const [snapshot, send] = useActor(machine, {
    input: initialState,
  });

  return <WizardMachineContext.Provider value={{ snapshot, send }}>{children}</WizardMachineContext.Provider>;
}
