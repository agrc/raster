import { and, assign, setup } from 'xstate';
import type { ProductTypeKey } from '../types';

export type ContextType = {
  productTypes: ProductTypeKey[];
  aoi: __esri.GeometryUnion | nullish;
  download: {
    productType: ProductTypeKey;
    tileIndex: string;
    description: string;
    metadata?: string;
    report?: string;
  } | null;
  categoryFilter?: string | string[] | null;
};
export type StepActionTypes = 'STEP1' | 'STEP2' | 'STEP3';

type InitialStateConfig = {
  context: ContextType;
  step: 'step1' | 'step2' | 'step3' | 'step4';
  productTypesToQuery?: ProductTypeKey[] | null;
};

/**
 * Determines initial state based on URL parameters or defaults
 */
export function getInitialState(urlParams?: {
  cat?: string | null;
  catGroup?: string[] | null;
  products?: number[] | null;
}): InitialStateConfig {
  const allProductTypeKeys: ProductTypeKey[] = [
    'aerialPhotography',
    'lidar',
    'usgsDem',
    'autoDem',
    'contours',
    'drg',
  ];

  // If category filter is present, we need to query to determine which product types have results
  const categoryFilter = urlParams?.cat || urlParams?.catGroup || null;

  if (categoryFilter) {
    return {
      context: {
        productTypes: [], // Will be populated after querying
        aoi: null,
        download: null,
        categoryFilter,
      },
      step: 'step2',
      productTypesToQuery: allProductTypeKeys, // Signal that we need to query
    };
  }

  // If products parameter is present, pre-select those product types
  if (urlParams?.products && urlParams.products.length > 0) {
    const selectedProductTypes = urlParams.products
      .filter((index) => index >= 0 && index < allProductTypeKeys.length)
      .map((index) => allProductTypeKeys[index]!);

    return {
      context: {
        productTypes: selectedProductTypes,
        aoi: null,
        download: null,
        categoryFilter: null,
      },
      step: 'step1',
    };
  }

  // Default to step 1
  return {
    context: {
      productTypes: [],
      aoi: null,
      download: null,
      categoryFilter: null,
    },
    step: 'step1',
  };
}

// uncomment to default to step 2
// const initialContext: ContextType = {
//   productTypes: ['aerialPhotography', 'lidar'],
//   aoi: null,
//   download: null,
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
//   download: null,
// };
// const initialStep = 'step3';

// uncomment to default to step 4
// import { fromJSON } from '@arcgis/core/geometry/support/jsonUtils';
// const initialContext: ContextType = {
//   productTypes: ['aerialPhotography', 'lidar', 'contours', 'autoDem'],
//   aoi: fromJSON({
//     spatialReference: {
//       latestWkid: 3857,
//       wkid: 102100,
//     },
//     rings: [
//       [
//         [-12443368.450306015, 4982949.48390072],
//         [-12443489.945116451, 4980631.22481595],
//         [-12443853.098425189, 4978338.365062839],
//         [-12444453.931448586, 4976096.025692656],
//         [-12445285.861334305, 4973928.774244778],
//         [-12446339.773284426, 4971860.355579595],
//         [-12447604.120419076, 4969913.431724848],
//         [-12449065.050286468, 4968109.333585709],
//         [-12450706.556633255, 4966467.827238922],
//         [-12452510.654772393, 4965006.8973715305],
//         [-12454457.578627141, 4963742.550236881],
//         [-12456525.997292323, 4962688.638286761],
//         [-12458693.248740202, 4961856.708401042],
//         [-12460935.588110385, 4961255.875377645],
//         [-12463228.447863495, 4960892.722068906],
//         [-12465546.706948265, 4960771.22725847],
//         [-12467864.966033036, 4960892.722068906],
//         [-12470157.825786145, 4961255.875377645],
//         [-12472400.165156329, 4961856.708401042],
//         [-12474567.416604208, 4962688.638286761],
//         [-12476635.83526939, 4963742.550236881],
//         [-12478582.759124137, 4965006.8973715305],
//         [-12480386.857263276, 4966467.827238922],
//         [-12482028.363610063, 4968109.333585709],
//         [-12483489.293477455, 4969913.431724848],
//         [-12484753.640612105, 4971860.355579595],
//         [-12485807.552562226, 4973928.774244778],
//         [-12486639.482447945, 4976096.025692656],
//         [-12487240.315471342, 4978338.365062839],
//         [-12487603.46878008, 4980631.22481595],
//         [-12487724.963590516, 4982949.48390072],
//         [-12487603.46878008, 4985267.742985491],
//         [-12487240.315471342, 4987560.6027386],
//         [-12486639.482447945, 4989802.942108785],
//         [-12485807.552562226, 4991970.193556663],
//         [-12484753.640612105, 4994038.612221845],
//         [-12483489.293477455, 4995985.536076592],
//         [-12482028.363610063, 4997789.634215731],
//         [-12480386.857263276, 4999431.1405625185],
//         [-12478582.759124137, 5000892.07042991],
//         [-12476635.83526939, 5002156.41756456],
//         [-12474567.416604208, 5003210.3295146795],
//         [-12472400.165156329, 5004042.2594003985],
//         [-12470157.825786145, 5004643.092423796],
//         [-12467864.966033036, 5005006.245732535],
//         [-12465546.706948265, 5005127.740542971],
//         [-12463228.447863495, 5005006.245732535],
//         [-12460935.588110385, 5004643.092423796],
//         [-12458693.248740202, 5004042.2594003985],
//         [-12456525.997292323, 5003210.3295146795],
//         [-12454457.578627141, 5002156.41756456],
//         [-12452510.654772393, 5000892.07042991],
//         [-12450706.556633255, 4999431.1405625185],
//         [-12449065.050286468, 4997789.634215731],
//         [-12447604.120419076, 4995985.536076592],
//         [-12446339.773284426, 4994038.612221845],
//         [-12445285.861334305, 4991970.193556663],
//         [-12444453.931448586, 4989802.942108785],
//         [-12443853.098425189, 4987560.602738601],
//         [-12443489.945116451, 4985267.742985491],
//         [-12443368.450306015, 4982949.48390072],
//       ],
//     ],
//   }),
//   download: ['aerialPhotography', 'NAIP2018_RGB_QQuads'],
// };
// const initialStep = 'step4';

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
      | { type: 'STEP4' }
      | {
          type: 'DOWNLOAD';
          productType: ProductTypeKey;
          tileIndex: string;
          description: string;
          metadata?: string;
          report?: string;
        }
      | { type: 'TOGGLE_PRODUCT_TYPE'; productType: ProductTypeKey }
      | { type: 'SET_AOI'; aoi: __esri.GeometryUnion | nullish },
    input: {} as InitialStateConfig | undefined,
  },
  guards: {
    hasProductTypes: ({ context }) => context.productTypes.length > 0,
    hasAoi: ({ context }) => context.aoi !== null,
    hasProductTypesAndAoi: and(['hasProductTypes', 'hasAoi']),
    hasDownload: ({ context }) => context.download !== null,
  },
}).createMachine({
  id: 'wizardMachine',
  context: ({ input }) => input?.context ?? getInitialState().context,
  initial: 'step1',
  states: {
    step1: {
      on: {
        STEP2: {
          target: 'step2',
          guard: 'hasProductTypes',
        },
        STEP3: {
          target: 'step3',
          guard: 'hasProductTypesAndAoi',
        },
        STEP4: {
          target: 'step4',
          guard: 'hasDownload',
        },
        TOGGLE_PRODUCT_TYPE: {
          actions: assign({
            productTypes: ({ context, event }) => toggleValueInList(context.productTypes, event.productType),
            aoi: null,
            download: null,
          }),
        },
      },
    },
    step2: {
      on: {
        SET_AOI: {
          actions: assign({
            aoi: ({ event }) => event.aoi,
            download: null,
          }),
          target: 'step3',
        },
        STEP1: {
          target: 'step1',
        },
        STEP3: {
          guard: 'hasAoi',
          target: 'step3',
        },
        STEP4: {
          guard: 'hasDownload',
          target: 'step4',
        },
      },
    },
    step3: {
      entry: assign({
        download: null, // reset download when returning to results
      }),
      on: {
        STEP1: {
          target: 'step1',
        },
        STEP2: {
          target: 'step2',
          guard: 'hasProductTypes',
        },
        STEP4: {
          target: 'step4',
          guard: 'hasDownload',
        },
        DOWNLOAD: {
          target: 'step4',
          actions: assign({
            download: ({ event }) => ({
              productType: event.productType,
              tileIndex: event.tileIndex,
              description: event.description,
              metadata: event.metadata,
              report: event.report,
            }),
          }),
        },
      },
    },
    step4: {
      on: {
        STEP1: {
          target: 'step1',
        },
        STEP2: {
          target: 'step2',
          guard: 'hasProductTypes',
        },
        STEP3: {
          target: 'step3',
          guard: 'hasProductTypesAndAoi',
        },
      },
    },
  },
});
