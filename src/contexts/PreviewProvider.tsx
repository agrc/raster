import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import { createContext, useState } from 'react';
import config from '../config';
import useMap from '../hooks/useMap';

export const PreviewContext = createContext<{
  previewId: string | null;
  addPreview: (id: string, serviceName: string) => void;
  removePreview: () => void;
} | null>(null);

const layerId = 'preview-layer';

export default function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const { mapView } = useMap();

  const addPreview = (id: string, serviceName: string) => {
    if (!mapView?.map) return;

    removePreview();

    const previewUrl = config.DISCOVER_URL.replace('<quadWord>', import.meta.env.VITE_DISCOVER).replace(
      '<serviceName>',
      serviceName,
    );
    const layer = new WebTileLayer({
      urlTemplate: previewUrl,
      id: layerId,
    });

    mapView.map.add(layer);

    setPreviewId(id);
  };

  const removePreview = () => {
    if (!mapView?.map) return;

    setPreviewId(null);
    const layer = mapView.map.findLayerById(layerId);
    if (layer) mapView.map.remove(layer);
  };

  return <PreviewContext.Provider value={{ previewId, addPreview, removePreview }}>{children}</PreviewContext.Provider>;
}
