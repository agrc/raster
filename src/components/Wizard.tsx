import { Disclosure, DisclosureGroup, DisclosureHeader, DisclosurePanel } from '@ugrc/utah-design-system';
import type { StepActionTypes } from '../WizardMachine';
import AreaOfInterest from './AreaOfInterest';
import useWizardMachine from './hooks/useWizardMachine';
import SearchResults from './SearchResults';
import SelectProductTypes from './SelectProductTypes';

export default function Wizard() {
  const { snapshot, send } = useWizardMachine();

  return (
    <div className="px-1 py-1 md:py-0">
      <DisclosureGroup
        expandedKeys={[snapshot.value as string]}
        onExpandedChange={(newKeys) => {
          if (newKeys.size) {
            const firstKey = newKeys.values().next().value;
            send({ type: String(firstKey).toUpperCase() as StepActionTypes });
          }
        }}
      >
        <Disclosure id="step1">
          <DisclosureHeader>Step 1 - Select Products</DisclosureHeader>
          <DisclosurePanel>
            <SelectProductTypes />
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="step2" isDisabled={!snapshot.context.productTypes.length}>
          <DisclosureHeader>Step 2 - Define Area of Interest</DisclosureHeader>
          <DisclosurePanel>
            <AreaOfInterest />
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id="step3" isDisabled={!snapshot.context.productTypes.length || !snapshot.context.aoi}>
          <DisclosureHeader>Step 3 - Results</DisclosureHeader>
          <DisclosurePanel>
            <SearchResults />
          </DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>
    </div>
  );
}
