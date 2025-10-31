import { Button, Checkbox, Link, Tooltip, useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { HelpCircle } from 'lucide-react';
import { TooltipTrigger } from 'react-aria-components';
import config from '../config';
import { useUrlParams } from '../hooks/useUrlParams';
import useWizardMachine from '../hooks/useWizardMachine';
import type { ProductTypeKey } from '../types';

export default function SelectProductTypes() {
  const { snapshot, send } = useWizardMachine();
  const logEvent = useFirebaseAnalytics();
  const { hasFilters, categories } = useUrlParams();

  return (
    <div className="space-y-2 text-sm">
      <p>Please select the type of product(s) you are looking for...</p>
      {Object.entries(config.PRODUCT_TYPES).map(([key, label]) => (
        <div key={key}>
          <Checkbox
            isSelected={snapshot.context.productTypes.includes(key as ProductTypeKey)}
            onChange={() => {
              const productType = key as ProductTypeKey;
              const isCurrentlySelected = snapshot.context.productTypes.includes(productType);

              send({ type: 'TOGGLE_PRODUCT_TYPE', productType });

              // Track only when checkbox is checked
              if (!isCurrentlySelected) {
                logEvent('product_type_selected', { productType });
              }
            }}
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
      <p>...then proceed to Step 2 below</p>
      {hasFilters && <Link href="/">Want to search for more than {categories.join(', ')}?</Link>}
    </div>
  );
}
