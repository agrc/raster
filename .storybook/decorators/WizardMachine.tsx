import type { ComponentType } from 'react';
import { createActor } from 'xstate';
import { WizardMachineContext } from '../../src/contexts/WizardMachineProvider';
import { machine } from '../../src/services/wizardMachine';

export const WizardMachineDecorator = (Story: ComponentType) => {
  const actor = createActor(machine, {
    snapshot: machine.resolveState({
      value: 'step3',
      context: {
        productTypes: ['lidar'],
        aoi: {} as __esri.GeometryUnion,
        download: null,
      },
    }),
  });
  actor.start();

  const snapshot = actor.getSnapshot();

  return (
    <WizardMachineContext.Provider value={{ snapshot, send: actor.send }}>
      <Story />
    </WizardMachineContext.Provider>
  );
};
