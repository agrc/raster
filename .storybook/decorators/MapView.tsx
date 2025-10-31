import type { ComponentType } from 'react';
import { MapContext } from '../../src/contexts/MapProvider';

export const MapViewDecorator = (Story: ComponentType) => (
  <MapContext.Provider
    value={{ mapView: {} as unknown as __esri.MapView, setMapView: () => {}, setGraphic: () => {}, zoom: () => {} }}
  >
    <Story />
  </MapContext.Provider>
);
