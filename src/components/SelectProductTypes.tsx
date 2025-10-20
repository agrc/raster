import { Button, Checkbox, Tooltip } from '@ugrc/utah-design-system';
import { HelpCircle } from 'lucide-react';
import { TooltipTrigger } from 'react-aria-components';
import config from '../config';
import useWizardMachine from '../hooks/useWizardMachine';
import type { ProductTypeKey } from '../types';

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
            <div className="inline-flex items-center gap-0.5">
              {label}
              <TooltipTrigger delay={250}>
                <Button className="hover:bg-transparent" variant="icon" aria-label="More information">
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Tooltip>{config.PRODUCT_TYPE_DESCRIPTIONS[key as ProductTypeKey]}</Tooltip>
              </TooltipTrigger>
            </div>
          </Checkbox>
        </div>
      ))}
      <p className="text-sm">...then proceed to Step 2 below</p>
    </div>
  );
}
