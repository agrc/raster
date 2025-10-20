import { Button } from '@ugrc/utah-design-system';
import { X } from 'lucide-react';
import usePreview from '../hooks/usePreview';

export default function PreviewControls() {
  const { previewId, removePreview } = usePreview();

  if (!previewId) {
    return null;
  }

  return (
    <div className="absolute top-0 z-10 flex w-full items-center justify-center">
      <div className="mx-10 mt-4 flex rounded-md bg-accent-300/75 px-2 py-1 text-zinc-800">
        {previewId}
        <Button className="ml-1" variant="icon" onClick={removePreview} aria-label="Clear preview layer">
          <X size={16} className="text-zinc-800" />
        </Button>
      </div>
    </div>
  );
}
