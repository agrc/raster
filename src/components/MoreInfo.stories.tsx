import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dialog, Modal } from '@ugrc/utah-design-system';
import { useState, type ComponentType } from 'react';
import type { ProductTypeKey } from '../types';
import MoreInfo from './MoreInfo';

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
      <Modal isOpen={true} isDismissable>
        <Dialog>
          <Story />
        </Dialog>
      </Modal>
    </QueryClientProvider>
  );
};

const meta = {
  component: MoreInfo,
  decorators: [QueryClientDecorator],
  args: {
    title: '1 Meter 4-Band Color Digital Orthophotography from 2009 NAIP',
    productType: 'aerialPhotography' as ProductTypeKey,
    objectId: 1,
  },
  argTypes: {
    getMoreInfoFn: { control: false },
    productType: { control: 'select' },
  },
} satisfies Meta<typeof MoreInfo>;

export default meta;

type Story = StoryObj<typeof MoreInfo>;

export const Loading: Story = {
  args: {
    getMoreInfoFn: () => new Promise(() => {}),
  },
};

export const ErrorState: Story = {
  args: {
    getMoreInfoFn: () => Promise.reject(new Error('Failed to load more info')),
  },
};

export const Success: Story = {
  args: {
    // Provide keys expected by aerialPhotography mapping; values are examples
    getMoreInfoFn: async () => ({
      Resolution: '0.5 m',
      Year_Collected: '2024',
      File_Format: 'GeoTIFF',
      Average_File_Size: '1.2 GB',
      Horizontal_Accuracy: '±2 m',
      FlightDate_Location: 'May 2024, Northern Utah A Lot More Text So That it wraps even more text',
      Contact: 'UGRC Raster Team test@utah.gov',
      In_House: 'Yes',
      FTP_Path: '/raster/aerial/2024/northern',
      HTML_Page: 'https://example.com/aerial-2024',
    }),
  },
};
