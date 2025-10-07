import { Checkbox } from '@ugrc/utah-design-system';
import config from '../config';
import type { ProductTypeKey } from '../types';
import useWizardMachine from './hooks/useWizardMachine';

export default function SelectProductTypes() {
  const { snapshot, send } = useWizardMachine();

  return (
    <div className="space-y-2">
      <p className="text-sm">Please select the type of product(s) you are looking for...</p>
      {Object.entries(config.PRODUCT_TYPES).map(([key, label]) => (
        <div key={key}>
          <Checkbox
            isSelected={snapshot.context.productTypes.includes(key as ProductTypeKey)}
            onChange={() => send({ type: 'TOGGLE_PRODUCT_TYPE', productType: key as ProductTypeKey })}
          >
            {/* TODO: replace with Tooltip (https://github.com/agrc/kitchen-sink/issues/539) */}
            <span title={config.PRODUCT_TYPE_DESCRIPTIONS[key as ProductTypeKey]}>{label}</span>
          </Checkbox>
        </div>
      ))}
      <p className="text-sm">...then proceed to Step 2 below</p>
    </div>
  );
}
