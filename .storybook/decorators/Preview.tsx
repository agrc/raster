import type { ComponentType } from 'react';
import { PreviewContext } from '../../src/contexts/PreviewProvider';

export const PreviewDecorator = (Story: ComponentType) => (
  <PreviewContext.Provider
    value={{ selectedPreviewId: 'NAIP 2024 | 4-Band (county mosaic)', removePreview: () => {}, addPreview: () => {} }}
  >
    <Story />
  </PreviewContext.Provider>
);
