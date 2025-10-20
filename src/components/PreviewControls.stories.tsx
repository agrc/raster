import type { Meta, StoryObj } from '@storybook/react-vite';
import { PreviewContext } from '../contexts/PreviewProvider';
import PreviewControls from './PreviewControls';

const meta: Meta<typeof PreviewControls> = {
  component: PreviewControls,
  decorators: [
    (Story) => (
      <PreviewContext.Provider
        value={{ previewId: 'NAIP 2024 | 4-Band (county mosaic)', removePreview: () => {}, addPreview: () => {} }}
      >
        <Story />
      </PreviewContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PreviewControls>;

export const Default: Story = {};
