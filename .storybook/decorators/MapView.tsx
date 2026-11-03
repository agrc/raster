import type MapView from '@arcgis/core/views/MapView';
import type { ComponentType } from 'react';
import { MapContext } from '../../src/contexts/MapProvider';

export const MapViewDecorator = (Story: ComponentType) => (
  <MapContext.Provider
    value={{ mapView: {} as unknown as MapView, setMapView: () => {}, setGraphic: () => {}, zoom: () => {} }}
  >
    <Story />
  </MapContext.Provider>
);
