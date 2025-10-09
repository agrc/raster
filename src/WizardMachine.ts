import { assign, setup } from 'xstate';
import type { ProductTypeKey } from './types';

export type ContextType = {
  productTypes: ProductTypeKey[];
};
export type StepActionTypes = 'STEP1' | 'STEP2' | 'STEP3';

const initialContext: ContextType = {
  productTypes: [],
};

export function toggleProductType(
  currentProductTypes: ProductTypeKey[],
  productType: ProductTypeKey,
): ProductTypeKey[] {
  if (currentProductTypes.includes(productType)) {
    return currentProductTypes.filter((t) => t !== productType);
  } else {
    return [...currentProductTypes, productType];
  }
}

export const machine = setup({
  types: {
    context: {} as ContextType,
    events: {} as
      | { type: 'STEP1' }
      | { type: 'STEP2' }
      | { type: 'STEP3' }
      | { type: 'TOGGLE_PRODUCT_TYPE'; productType: ProductTypeKey },
  },
  guards: {
    hasProductTypes: ({ context }) => context.productTypes.length > 0,
  },
}).createMachine({
  id: 'wizard',
  context: initialContext,
  initial: 'step1',
  states: {
    step1: {
      on: {
        STEP2: {
          guard: 'hasProductTypes',
          target: 'step2',
        },
        STEP3: {
          guard: 'hasProductTypes',
          target: 'step3',
        },
        TOGGLE_PRODUCT_TYPE: {
          actions: assign({
            productTypes: ({ context, event }) => toggleProductType(context.productTypes, event.productType),
          }),
        },
      },
    },
    step2: {
      on: {
        STEP3: {
          target: 'step3',
        },
        STEP1: {
          target: 'step1',
        },
      },
    },
    step3: {
      on: {
        STEP1: {
          target: 'step1',
        },
        STEP2: {
          target: 'step2',
        },
      },
    },
  },
});
