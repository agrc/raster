import type { EventHandler } from '@arcgis/lumina';
import '@arcgis/map-components/components/arcgis-home';
import '@arcgis/map-components/components/arcgis-locate';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import { LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import { utahMercatorExtent } from '@ugrc/utilities/hooks';
import { useEffect, useRef, useState } from 'react';
import config from '../config';
import useMap from './hooks/useMap';

export const MapContainer = ({ onClick }: { onClick?: EventHandler<HTMLArcgisMapElement['arcgisViewClick']> }) => {
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
  const { setMapView } = useMap();
  const mapRef = useRef<HTMLArcgisMapElement>(null);

  // setup the Map
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    map.constraints.snapToZoom = false;

    setMapView(map.view);

    const selectorOptions: LayerSelectorProps = {
      options: {
        view: map.view,
        quadWord: import.meta.env.VITE_DISCOVER,
        basemaps: ['Terrain', 'Hybrid', 'Imagery', 'Lite', 'Topo'],
      },
    };

    setSelectorOptions(selectorOptions);
  }, [setMapView]);

  return (
    <arcgis-map
      id={config.MAP_ELEMENT_ID}
      ref={mapRef}
      className="size-full"
      onarcgisViewClick={onClick}
      extent={utahMercatorExtent.expand(config.DEFAULT_EXTENT_EXPAND)}
    >
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-home position="top-left"></arcgis-home>
      {selectorOptions && <LayerSelector {...selectorOptions}></LayerSelector>}
    </arcgis-map>
  );
};
