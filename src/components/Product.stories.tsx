import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree } from 'react-aria-components';
import { MapViewDecorator } from '../../.storybook/decorators/MapView';
import { PreviewDecorator } from '../../.storybook/decorators/Preview';
import config from '../config';
import Product, { type ProductFeature } from './Product';

const meta = {
  component: Product,
  decorators: [MapViewDecorator, PreviewDecorator],
  render: (args) => (
    <div className="w-80 rounded-b-lg bg-gray-100 px-2 py-2 dark:bg-black">
      <Tree aria-label="Product" selectionMode="none" defaultExpandedKeys={['HRO 2012 (12.5cm)-0']}>
        <Product {...args} />
      </Tree>
    </div>
  ),
} satisfies Meta<typeof Product>;

export default meta;

type Story = StoryObj<typeof Product>;

export const Default: Story = {
  args: {
    feature: {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.Product]: 'HRO 2012 (12.5cm)',
        [config.EXTENT_FIELDS.OBJECTID]: 0,
        [config.EXTENT_FIELDS.Category]: '',
        [config.EXTENT_FIELDS.Estimated_Date]: 0,
        [config.EXTENT_FIELDS.HTML_Page]: '',
        [config.EXTENT_FIELDS.In_House]: null,
        [config.EXTENT_FIELDS.SHOW]: null,
        [config.EXTENT_FIELDS.ServiceName]: '',
      },
    },
  },
};

export const WithPreview: Story = {
  args: {
    feature: {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.Product]: 'HRO 2012 (12.5cm)',
        [config.EXTENT_FIELDS.OBJECTID]: 0,
        [config.EXTENT_FIELDS.Category]: '',
        [config.EXTENT_FIELDS.Estimated_Date]: 0,
        [config.EXTENT_FIELDS.HTML_Page]: '',
        [config.EXTENT_FIELDS.In_House]: null,
        [config.EXTENT_FIELDS.SHOW]: null,
        [config.EXTENT_FIELDS.ServiceName]: 'topo_basemap',
      },
    },
  },
};

export const Wrapping: Story = {
  args: {
    feature: {
      geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
      attributes: {
        [config.EXTENT_FIELDS.Product]: 'A Really Long Product HRO 2012 (12.5cm)',
        [config.EXTENT_FIELDS.OBJECTID]: 0,
        [config.EXTENT_FIELDS.Category]: '',
        [config.EXTENT_FIELDS.Estimated_Date]: 0,
        [config.EXTENT_FIELDS.HTML_Page]: '',
        [config.EXTENT_FIELDS.In_House]: null,
        [config.EXTENT_FIELDS.SHOW]: null,
        [config.EXTENT_FIELDS.ServiceName]: 'topo_basemap',
      },
    },
  },
};
