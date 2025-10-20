import { useContext } from 'react';
import { PreviewContext } from '../contexts/PreviewProvider';

export default function usePreview() {
  const context = useContext(PreviewContext);

  if (context === null) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }

  return context;
}
