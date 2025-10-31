import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tree } from 'react-aria-components';
import { MapViewDecorator } from '../../.storybook/decorators/MapView';
import { PreviewDecorator } from '../../.storybook/decorators/Preview';
import { WizardMachineDecorator } from '../../.storybook/decorators/WizardMachine';
import config from '../config';
import Category from './Category';
import type { ProductFeature } from './Product';

const meta = {
  component: Category,
  decorators: [MapViewDecorator, PreviewDecorator, WizardMachineDecorator],
  render: (args) => (
    <div className="w-80 rounded-b-lg bg-gray-100 px-2 py-2 dark:bg-black">
      <Tree aria-label="Category" selectionMode="none" defaultExpandedKeys={[args.category]}>
        <Category {...args} />
      </Tree>
    </div>
  ),
} satisfies Meta<typeof Category>;

export default meta;

type Story = StoryObj<typeof Category>;

export const LidarDEMsExpanded: Story = {
  args: {
    category: '5 Meter',
    productType: 'lidar',
    products: [
      {
        geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
        attributes: {
          [config.EXTENT_FIELDS.OBJECTID]: 4,
          [config.EXTENT_FIELDS.Product]: 'no match (3)',
          [config.EXTENT_FIELDS.Category]: '5 Meter',
          [config.EXTENT_FIELDS.Description]: 'should be third',
          [config.EXTENT_FIELDS.Estimated_Date]: 2024,
          [config.EXTENT_FIELDS.HTML_Page]: 'https://gis.utah.gov/products/sgid/elevation/lidar/',
          [config.EXTENT_FIELDS.In_House]: 'Yes',
          [config.EXTENT_FIELDS.SHOW]: 'Y',
          [config.EXTENT_FIELDS.ServiceName]: 'lidar_dsm_first_return',
          [config.EXTENT_FIELDS.Year_Collected]: '2024',
        },
      },
      {
        geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
        attributes: {
          [config.EXTENT_FIELDS.OBJECTID]: 1,
          [config.EXTENT_FIELDS.Product]: 'First Return DSM (2)',
          [config.EXTENT_FIELDS.Category]: '5 Meter',
          [config.EXTENT_FIELDS.Description]: 'should be second',
          [config.EXTENT_FIELDS.Estimated_Date]: 2024,
          [config.EXTENT_FIELDS.HTML_Page]: 'https://gis.utah.gov/products/sgid/elevation/lidar/',
          [config.EXTENT_FIELDS.In_House]: 'Yes',
          [config.EXTENT_FIELDS.SHOW]: 'Y',
          [config.EXTENT_FIELDS.ServiceName]: 'lidar_dsm_first_return',
          [config.EXTENT_FIELDS.Year_Collected]: '2024',
        },
      },
      {
        geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
        attributes: {
          [config.EXTENT_FIELDS.OBJECTID]: 2,
          [config.EXTENT_FIELDS.Product]: 'Bare Earth DEM (1)',
          [config.EXTENT_FIELDS.Category]: '5 Meter',
          [config.EXTENT_FIELDS.Description]: 'should be first',
          [config.EXTENT_FIELDS.Estimated_Date]: 2024,
          [config.EXTENT_FIELDS.HTML_Page]: 'https://gis.utah.gov/products/sgid/elevation/lidar/',
          [config.EXTENT_FIELDS.In_House]: 'Yes',
          [config.EXTENT_FIELDS.SHOW]: 'Y',
          [config.EXTENT_FIELDS.ServiceName]: 'lidar_dem_bare_earth',
          [config.EXTENT_FIELDS.Year_Collected]: '2024',
        },
      },
    ],
  },
};

export const AerialPhotography: Story = {
  args: {
    category: 'RGB',
    productType: 'aerialPhotography',
    products: [
      {
        geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
        attributes: {
          [config.EXTENT_FIELDS.OBJECTID]: 3,
          [config.EXTENT_FIELDS.Product]: 'single infrared band 4 (3)',
          [config.EXTENT_FIELDS.Category]: 'HRO 2023 (6 inch)',
          [config.EXTENT_FIELDS.Description]: 'should be third',
          [config.EXTENT_FIELDS.Estimated_Date]: 2023,
          [config.EXTENT_FIELDS.HTML_Page]: 'https://gis.utah.gov/products/sgid/aerial-photography/hro-2023-6-inch/',
          [config.EXTENT_FIELDS.In_House]: 'Yes',
          [config.EXTENT_FIELDS.SHOW]: 'Y',
          [config.EXTENT_FIELDS.ServiceName]: 'hro_2023_6inch',
        },
      },
      {
        geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
        attributes: {
          [config.EXTENT_FIELDS.OBJECTID]: 6,
          [config.EXTENT_FIELDS.Product]: 'CIR (county mosaic) (2)',
          [config.EXTENT_FIELDS.Category]: 'HRO 2023 (6 inch)',
          [config.EXTENT_FIELDS.Description]: 'should be second',
          [config.EXTENT_FIELDS.Estimated_Date]: 2023,
          [config.EXTENT_FIELDS.HTML_Page]: 'https://gis.utah.gov/products/sgid/aerial-photography/hro-2023-6-inch/',
          [config.EXTENT_FIELDS.In_House]: 'Yes',
          [config.EXTENT_FIELDS.SHOW]: 'Y',
          [config.EXTENT_FIELDS.ServiceName]: 'hro_2023_6inch',
        },
      },
      {
        geometry: { type: 'polygon' } as unknown as ProductFeature['geometry'],
        attributes: {
          [config.EXTENT_FIELDS.OBJECTID]: 7,
          [config.EXTENT_FIELDS.Product]: 'RGB (county mosaic) (1)',
          [config.EXTENT_FIELDS.Category]: 'HRO 2023 (6 inch)',
          [config.EXTENT_FIELDS.Description]: 'should be first',
          [config.EXTENT_FIELDS.Estimated_Date]: 2022,
          [config.EXTENT_FIELDS.HTML_Page]: 'https://gis.utah.gov/products/sgid/aerial-photography/naip/',
          [config.EXTENT_FIELDS.In_House]: 'No',
          [config.EXTENT_FIELDS.SHOW]: 'Y',
          [config.EXTENT_FIELDS.ServiceName]: 'naip_2022_60cm',
        },
      },
    ],
  },
};
