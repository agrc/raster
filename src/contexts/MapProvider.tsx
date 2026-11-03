import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import type { GeometryUnion } from '@arcgis/core/geometry/types';
import useGraphicManager from '@ugrc/utilities/hooks/useGraphicManager';
import { createContext, type ReactNode, useState } from 'react';
import config from '../config';

type GraphicOptions = Graphic | Graphic[] | null;
export const MapContext = createContext<{
  mapView: MapView | null;
  setMapView: (mapView: MapView | null) => void;
  setGraphic: (graphic: GraphicOptions) => void;
  zoom: (geometry: GeometryUnion) => void;
} | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [mapView, setMapView] = useState<MapView | null>(null);
  const { setGraphic } = useGraphicManager(mapView);

  const zoom = (geometry: GeometryUnion): void => {
    if (!mapView) {
      console.warn('attempting to zoom before the mapView is set');

      return;
    }

    const extent = geometry.extent;
    if (extent) {
      mapView.goTo(extent.clone().expand(config.DEFAULT_EXTENT_EXPAND));
    }
  };

  return (
    <MapContext.Provider
      value={{
        mapView,
        setMapView,
        setGraphic,
        zoom,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
