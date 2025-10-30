import Graphic from '@arcgis/core/Graphic';
import MapView from '@arcgis/core/views/MapView';
import { useGraphicManager } from '@ugrc/utilities/hooks';
import { createContext, type ReactNode, useCallback, useState } from 'react';
import config from '../config';

type GraphicOptions = Graphic | Graphic[] | null;
export const MapContext = createContext<{
  mapView: MapView | null;
  setMapView: (mapView: MapView | null) => void;
  placeGraphic: (graphic: GraphicOptions) => void;
  zoom: (geometry: __esri.GoToTarget2D) => void;
} | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [mapView, setMapView] = useState<MapView | null>(null);
  const { setGraphic } = useGraphicManager(mapView);

  const zoom = useCallback(
    (geometry: __esri.GoToTarget2D): void => {
      if (!mapView) {
        console.warn('attempting to zoom before the mapView is set');

        return;
      }

      mapView.goTo(geometry.extent.expand(config.DEFAULT_EXTENT_EXPAND));
    },
    [mapView],
  );

  const placeGraphic = useCallback(
    (graphic: GraphicOptions): void => {
      setGraphic(graphic);
    },
    [setGraphic],
  );

  return (
    <MapContext.Provider
      value={{
        mapView,
        setMapView,
        placeGraphic,
        zoom,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
