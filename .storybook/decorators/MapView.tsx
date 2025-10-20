import type { ComponentType } from 'react';
import { MapContext } from '../../src/components/contexts/MapProvider';

export const MapViewDecorator = (Story: ComponentType) => (
  <MapContext.Provider
    value={{ mapView: {} as unknown as __esri.MapView, setMapView: () => {}, placeGraphic: () => {}, zoom: () => {} }}
  >
    <Story />
  </MapContext.Provider>
);
