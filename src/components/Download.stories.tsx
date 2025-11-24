import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ComponentType } from 'react';
import { createActor } from 'xstate';
import { AnalyticsProviderDecorator } from '../../.storybook/decorators/Analytics';
import { MapViewDecorator } from '../../.storybook/decorators/MapView';
import config from '../config';
import TilesContextProvider from '../contexts/TilesContextProvider';
import { WizardMachineContext } from '../contexts/WizardMachineProvider';
import { MaxTilesExceededError } from '../services/tiles';
import { machine } from '../services/wizardMachine';
import type { ProductTypeKey } from '../types';
import Download from './Download';

const mockAoi = {
  type: 'polygon',
  rings: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
  ],
  toJSON: () => ({
    rings: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
  }),
} as unknown as __esri.GeometryUnion;

const mockTilesData = {
  objectIdFieldName: 'OBJECTID',
  features: [
    {
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: 1,
        [config.INDEX_FIELDS.TILE]: 'Tile 1',
        [config.INDEX_FIELDS.PATH]: 'http://example.com/',
        [config.INDEX_FIELDS.EXT]: '.tif',
        [config.INDEX_FIELDS.SIZE]: 10,
        [config.INDEX_FIELDS.TILE_INDEX]: '123',
      },
    },
    {
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: 2,
        [config.INDEX_FIELDS.TILE]: 'Tile 2',
        [config.INDEX_FIELDS.PATH]: 'http://example.com/',
        [config.INDEX_FIELDS.EXT]: '.tif',
        [config.INDEX_FIELDS.SIZE]: 20,
        [config.INDEX_FIELDS.TILE_INDEX]: '123',
      },
    },
  ],
};

type StoryArgs = React.ComponentProps<typeof Download> & {
  productType?: string;
  tileIndex?: string;
  description?: string;
  metadata?: string;
  report?: string;
  error?: Error | string;
  data?: typeof mockTilesData;
  isLoading?: boolean;
};

const withContexts = (Story: ComponentType, context: StoryContext<StoryArgs>) => {
  const {
    productType = 'lidar',
    tileIndex = '123',
    description = 'Sample Lidar Dataset',
    metadata,
    report,
    error,
    data,
  } = context.args;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
    },
  });

  const queryKey = ['tiles', productType, tileIndex, mockAoi];

  if (data) {
    queryClient.setQueryData(queryKey, data);
  } else if (error) {
    // Pre-seed the cache with an error state
    const queryCache = queryClient.getQueryCache();
    const query = queryCache.build(queryClient, { queryKey });
    query.setState({
      status: 'error',
      error: error instanceof Error ? error : new Error(error),
      fetchStatus: 'idle',
      data: undefined,
      dataUpdatedAt: Date.now(),
    });
  }

  const actor = createActor(machine, {
    snapshot: machine.resolveState({
      value: 'step3',
      context: {
        productTypes: [productType as ProductTypeKey],
        aoi: mockAoi,
        download: {
          productType: productType as ProductTypeKey,
          tileIndex,
          description,
          metadata,
          report,
        },
      },
    }),
  });
  actor.start();
  const snapshot = actor.getSnapshot();

  return (
    <QueryClientProvider client={queryClient}>
      <WizardMachineContext.Provider value={{ snapshot, send: actor.send }}>
        <TilesContextProvider>
          <div className="w-96 rounded-b-lg bg-gray-100 px-2 py-2 dark:bg-black">
            <Story />
          </div>
        </TilesContextProvider>
      </WizardMachineContext.Provider>
    </QueryClientProvider>
  );
};

const meta: Meta<StoryArgs> = {
  component: Download,
  decorators: [MapViewDecorator, AnalyticsProviderDecorator, withContexts],
  args: {
    productType: 'lidar',
    tileIndex: '123',
    description: 'Sample Lidar Dataset',
    metadata: '',
    report: '',
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

export const Success: Story = {
  args: {
    data: mockTilesData,
  },
};

export const WithMetadataAndReport: Story = {
  args: {
    data: mockTilesData,
    metadata: 'http://example.com/metadata.xml',
    report: 'http://example.com/report.pdf',
  },
};

export const AutoDemWarning: Story = {
  args: {
    productType: 'autoDem',
    data: mockTilesData,
    description: 'Auto-Correlated DEM',
  },
};

export const ErrorState: Story = {
  args: {
    error: new Error('Failed to fetch tiles'),
  },
};

export const MaxTilesError: Story = {
  args: {
    getTilesService: async () => {
      throw new MaxTilesExceededError();
    },
  },
};

export const Loading: Story = {
  args: {
    getTilesService: () => new Promise(() => {}),
  },
};
