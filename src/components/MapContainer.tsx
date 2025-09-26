import EsriMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import '@arcgis/map-components/components/arcgis-locate';
import { LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import { utahMercatorExtent } from '@ugrc/utilities/hooks';
import { useEffect, useRef, useState } from 'react';
import { useMap } from './hooks/useMap';

export const MapContainer = ({ onClick }: { onClick?: __esri.ViewClickEventHandler }) => {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapComponent = useRef<EsriMap | null>(null);
  const mapView = useRef<MapView>(null);
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
  const { setMapView } = useMap();

  // setup the Map
  useEffect(() => {
    if (!mapNode.current || !setMapView) {
      return;
    }

    mapComponent.current = new EsriMap();

    mapView.current = new MapView({
      container: mapNode.current,
      extent: utahMercatorExtent,
      map: mapComponent.current,
      ui: {
        components: ['zoom'],
      },
    });

    mapView.current.constraints.snapToZoom = false;

    setMapView(mapView.current);

    const selectorOptions: LayerSelectorProps = {
      options: {
        view: mapView.current,
        quadWord: import.meta.env.VITE_DISCOVER,
        basemaps: ['Lite', 'Hybrid', 'Terrain', 'Topo', 'Color IR'],
      },
    };

    setSelectorOptions(selectorOptions);

    return () => {
      mapView.current?.destroy();
      mapComponent.current?.destroy();
    };
  }, [setMapView]);

  // add click event handlers
  useEffect(() => {
    let handler: IHandle | null = null;
    if (onClick && mapView.current) {
      handler = mapView.current.on('click', onClick);
    }

    return () => {
      handler?.remove();
    };
  }, [onClick, mapView]);

  return (
    <div ref={mapNode} className="size-full">
      {selectorOptions && <LayerSelector {...selectorOptions}></LayerSelector>}
    </div>
  );
};
