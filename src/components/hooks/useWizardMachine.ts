import { useContext } from 'react';
import { WizardMachineContext } from '../contexts/WizardMachineProvider';

export default function useWizardMachine() {
  const context = useContext(WizardMachineContext);

  if (context === null) {
    throw new Error('useWizardMachine must be used within a WizardMachineProvider');
  }

  return context;
}
