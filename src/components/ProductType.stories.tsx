import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ComponentType } from 'react';
import { MapViewDecorator } from '../../.storybook/decorators/MapView';
import { PreviewDecorator } from '../../.storybook/decorators/Preview';
import config from '../config';
import type { ProductFeature } from './Product';
import ProductType from './ProductType';

const mockAoi = {
  toJSON: () => ({}),
} as unknown as __esri.GeometryUnion;

const QueryClientDecorator = (Story: ComponentType) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <Story />
    </QueryClientProvider>
  );
};

const meta = {
  component: ProductType,
  decorators: [QueryClientDecorator, MapViewDecorator, PreviewDecorator],
  args: {
    productType: 'lidar',
    aoi: mockAoi,
  },
  argTypes: {
    searchFn: { control: false },
    aoi: { control: false },
    productType: { control: 'select' },
  },
} satisfies Meta<typeof ProductType>;

export default meta;

type Story = StoryObj<typeof ProductType>;

const groupedResults: Record<string, ProductFeature[]> = {
  'Category One': [
    {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.OBJECTID]: 1,
        [config.EXTENT_FIELDS.Product]: 'Lidar Spring 2024',
        [config.EXTENT_FIELDS.Category]: 'Category One',
        [config.EXTENT_FIELDS.Description]:
          '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
        [config.EXTENT_FIELDS.Estimated_Date]: 2024,
        [config.EXTENT_FIELDS.HTML_Page]: 'https://example.com/lidar',
        [config.EXTENT_FIELDS.In_House]: 'Yes',
        [config.EXTENT_FIELDS.SHOW]: 'Y',
        [config.EXTENT_FIELDS.ServiceName]: 'lidar_spring_2024',
      },
    },
    {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.OBJECTID]: 2,
        [config.EXTENT_FIELDS.Product]: 'Lidar Spring 2023',
        [config.EXTENT_FIELDS.Category]: 'Category One {Hide Me}',
        [config.EXTENT_FIELDS.Description]:
          '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
        [config.EXTENT_FIELDS.Estimated_Date]: 2023,
        [config.EXTENT_FIELDS.HTML_Page]: 'https://example.com/lidar',
        [config.EXTENT_FIELDS.In_House]: 'Yes',
        [config.EXTENT_FIELDS.SHOW]: 'Y',
        [config.EXTENT_FIELDS.ServiceName]: 'lidar_spring_2023',
      },
    },
  ],
  'Category Two': [
    {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.OBJECTID]: 3,
        [config.EXTENT_FIELDS.Product]: 'Lidar Summer 2025',
        [config.EXTENT_FIELDS.Category]: 'Category Two',
        [config.EXTENT_FIELDS.Description]:
          '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
        [config.EXTENT_FIELDS.Estimated_Date]: 2025,
        [config.EXTENT_FIELDS.HTML_Page]: 'https://example.com/lidar-summer',
        [config.EXTENT_FIELDS.In_House]: 'No',
        [config.EXTENT_FIELDS.SHOW]: 'Y',
        [config.EXTENT_FIELDS.ServiceName]: 'lidar_summer_2025',
      },
    },
  ],
};

function ProductTypeStoryWrapper(args: React.ComponentProps<typeof ProductType>) {
  return (
    <div className="w-80 rounded-b-lg bg-gray-100 px-2 py-2 dark:bg-black">
      <ProductType {...args} />
    </div>
  );
}

export const Loading: Story = {
  args: {
    searchFn: () => new Promise(() => {}),
  },
  render: (args) => <ProductTypeStoryWrapper {...args} />,
};

export const ErrorState: Story = {
  args: {
    searchFn: () => Promise.reject(new Error('Failed to load results')),
  },
  render: (args) => <ProductTypeStoryWrapper {...args} />,
};

export const Results: Story = {
  args: {
    searchFn: () => Promise.resolve(groupedResults),
  },
  render: (args) => <ProductTypeStoryWrapper {...args} />,
};

const autoExpandResults: Record<string, ProductFeature[]> = {
  'Category One': [
    {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.OBJECTID]: 1,
        [config.EXTENT_FIELDS.Product]: 'Lidar Spring 2024',
        [config.EXTENT_FIELDS.Category]: 'Category One',
        [config.EXTENT_FIELDS.Description]:
          '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
        [config.EXTENT_FIELDS.Estimated_Date]: 2024,
        [config.EXTENT_FIELDS.HTML_Page]: 'https://example.com/lidar',
        [config.EXTENT_FIELDS.In_House]: 'Yes',
        [config.EXTENT_FIELDS.SHOW]: 'Y',
        [config.EXTENT_FIELDS.ServiceName]: 'lidar_spring_2024',
      },
    },
  ],
};

export const AutoExpand: Story = {
  args: {
    searchFn: () => Promise.resolve(autoExpandResults),
    isOnly: true,
  },
  render: (args) => <ProductTypeStoryWrapper {...args} />,
};

export const NoResults: Story = {
  args: {
    searchFn: () => Promise.resolve({}),
  },
  render: (args) => <ProductTypeStoryWrapper {...args} />,
};

const groupedLidarResults: Record<string, ProductFeature[]> = {
  'Category One {2025 LIDAR}': [
    {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.OBJECTID]: 1,
        [config.EXTENT_FIELDS.Product]: 'Lidar Spring 2024',
        [config.EXTENT_FIELDS.Category]: 'Category One {2025 LIDAR}',
        [config.EXTENT_FIELDS.Description]:
          '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
        [config.EXTENT_FIELDS.Estimated_Date]: 2024,
        [config.EXTENT_FIELDS.HTML_Page]: 'https://example.com/lidar',
        [config.EXTENT_FIELDS.In_House]: 'Yes',
        [config.EXTENT_FIELDS.SHOW]: 'Y',
        [config.EXTENT_FIELDS.ServiceName]: 'lidar_spring_2024',
        [config.EXTENT_FIELDS.Year_Collected]: '2024',
      },
    },
    {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.OBJECTID]: 2,
        [config.EXTENT_FIELDS.Product]: 'Lidar Spring 2023',
        [config.EXTENT_FIELDS.Category]: 'Category One {2025 LIDAR}',
        [config.EXTENT_FIELDS.Description]:
          '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
        [config.EXTENT_FIELDS.Estimated_Date]: 2023,
        [config.EXTENT_FIELDS.HTML_Page]: 'https://example.com/lidar',
        [config.EXTENT_FIELDS.In_House]: 'Yes',
        [config.EXTENT_FIELDS.SHOW]: 'Y',
        [config.EXTENT_FIELDS.ServiceName]: 'lidar_spring_2023',
      },
    },
  ],
  'Category Two {2022 LIDAR}': [
    {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.OBJECTID]: 3,
        [config.EXTENT_FIELDS.Product]: 'Lidar Summer 2022',
        [config.EXTENT_FIELDS.Category]: 'Category Two {2022 LIDAR}',
        [config.EXTENT_FIELDS.Description]:
          '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
        [config.EXTENT_FIELDS.Estimated_Date]: 2022,
        [config.EXTENT_FIELDS.HTML_Page]: 'https://example.com/lidar-summer',
        [config.EXTENT_FIELDS.In_House]: 'No',
        [config.EXTENT_FIELDS.SHOW]: 'Y',
        [config.EXTENT_FIELDS.ServiceName]: 'lidar_summer_2022',
        [config.EXTENT_FIELDS.Year_Collected]: '2022',
      },
    },
  ],
};

export const LidarWithYearCollected: Story = {
  args: {
    productType: 'lidar',
    searchFn: () => Promise.resolve(groupedLidarResults),
  },
  render: (args) => <ProductTypeStoryWrapper {...args} />,
};
