import { Disclosure, DisclosureGroup, DisclosureHeader, DisclosurePanel } from '@ugrc/utah-design-system';
import useWizardMachine from './hooks/useWizardMachine';
import SelectProductTypes from './SelectProductTypes';

export default function Wizard() {
  const { snapshot, send } = useWizardMachine();

  return (
    <div className="px-1 py-1 md:py-0">
      <DisclosureGroup defaultExpandedKeys={[1]}>
        <Disclosure id={1}>
          <DisclosureHeader>Step 1 - Select Products</DisclosureHeader>
          <DisclosurePanel>
            <SelectProductTypes />
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id={2} isDisabled={!snapshot.context.productTypes.length} onClick={() => send({ type: 'STEP2' })}>
          <DisclosureHeader>Step 2</DisclosureHeader>
          <DisclosurePanel>
            <p>This is step 2 of the wizard.</p>
          </DisclosurePanel>
        </Disclosure>
        <Disclosure id={3} isDisabled={!snapshot.context.productTypes.length} onClick={() => send({ type: 'STEP3' })}>
          <DisclosureHeader>Step 3</DisclosureHeader>
          <DisclosurePanel>
            <p>This is step 3 of the wizard.</p>
          </DisclosurePanel>
        </Disclosure>
      </DisclosureGroup>
    </div>
  );
}
