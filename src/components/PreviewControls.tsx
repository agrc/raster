import { Button } from '@ugrc/utah-design-system';
import { X } from 'lucide-react';
import usePreview from '../hooks/usePreview';

export default function PreviewControls() {
  const { selectedPreviewId, removePreview } = usePreview();

  if (!selectedPreviewId) {
    return null;
  }

  return (
    <div className="flex rounded-md bg-accent-300/75 px-2 py-1 text-zinc-800">
      {selectedPreviewId}
      <Button className="ml-1" variant="icon" onPress={removePreview} aria-label="Clear preview layer">
        <X size={16} className="text-zinc-800" />
      </Button>
    </div>
  );
}
