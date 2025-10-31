import { useActor } from '@xstate/react';
import { createContext } from 'react';
import ListLoader from '../components/ListLoader';
import { machine } from '../services/wizardMachine';

export const WizardMachineContext = createContext<{
  snapshot: ReturnType<typeof useActor<typeof machine>>[0];
  send: ReturnType<typeof useActor<typeof machine>>[1];
} | null>(null);

export default function WizardMachineProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, send] = useActor(machine);

  if (snapshot.matches('initialize')) {
    return (
      <div className="p-2">
        <ListLoader />
      </div>
    );
  }

  return <WizardMachineContext.Provider value={{ snapshot, send }}>{children}</WizardMachineContext.Provider>;
}
