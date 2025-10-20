import { and, assign, setup } from 'xstate';
import type { ProductTypeKey } from '../types';

export type ContextType = {
  productTypes: ProductTypeKey[];
  aoi: __esri.GeometryUnion | nullish;
};
export type StepActionTypes = 'STEP1' | 'STEP2' | 'STEP3';

// production defaults to step 1
const initialContext: ContextType = {
  productTypes: [],
  aoi: null,
};
const initialStep = 'step1';

// uncomment to default to step 2
// const initialContext: ContextType = {
//   productTypes: ['aerialPhotography', 'lidar'],
//   aoi: null,
// };
// const initialStep = 'step2';

// uncomment to default to step 3
// import { fromJSON } from '@arcgis/core/geometry/support/jsonUtils';
// const initialContext: ContextType = {
//   productTypes: ['aerialPhotography', 'lidar', 'contours', 'autoDem'],
//   aoi: fromJSON({
//     type: 'point',
//     spatialReference: {
//       wkid: 102100,
//     },
//     x: -12456493.518214382,
//     y: 4943442.769128876,
//   }),
// };
// const initialStep = 'step3';

/**
 * Toggles the presence of a value in a list: adds the value if not present, or removes it if already present.
 *
 * @template T - The type of elements in the list.
 * @param {T[]} currentList - The current array of values.
 * @param {T} value - The value to toggle in the list.
 * @returns {T[]} A new array with the value added or removed.
 */
export function toggleValueInList<T>(currentList: T[], value: T) {
  if (currentList.includes(value)) {
    return currentList.filter((v) => v !== value);
  } else {
    return [...currentList, value];
  }
}

export const machine = setup({
  types: {
    context: {} as ContextType,
    events: {} as
      | { type: 'STEP1' }
      | { type: 'STEP2' }
      | { type: 'STEP3' }
      | { type: 'TOGGLE_PRODUCT_TYPE'; productType: ProductTypeKey }
      | { type: 'SET_AOI'; aoi: __esri.GeometryUnion | nullish },
  },
  guards: {
    hasProductTypes: ({ context }) => context.productTypes.length > 0,
    hasAoi: ({ context }) => context.aoi !== null,
    hasProductTypesAndAoi: and(['hasProductTypes', 'hasAoi']),
  },
}).createMachine({
  id: 'wizard',
  context: initialContext,
  initial: initialStep,
  states: {
    step1: {
      on: {
        STEP2: {
          guard: 'hasProductTypes',
          target: 'step2',
        },
        STEP3: {
          guard: 'hasProductTypesAndAoi',
          target: 'step3',
        },
        TOGGLE_PRODUCT_TYPE: {
          actions: assign({
            productTypes: ({ context, event }) => toggleValueInList(context.productTypes, event.productType),
          }),
        },
      },
    },
    step2: {
      on: {
        SET_AOI: {
          actions: assign({
            aoi: ({ event }) => event.aoi,
          }),
          target: 'step3',
        },
        STEP3: {
          guard: 'hasAoi',
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
