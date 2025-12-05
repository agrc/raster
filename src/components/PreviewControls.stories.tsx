import type { Meta, StoryObj } from '@storybook/react-vite';
import { PreviewDecorator } from '../../.storybook/decorators/Preview';
import PreviewControls from './PreviewControls';

const meta: Meta<typeof PreviewControls> = {
  component: PreviewControls,
  decorators: [PreviewDecorator],
};

export default meta;

type Story = StoryObj<typeof PreviewControls>;

export const Default: Story = {};
