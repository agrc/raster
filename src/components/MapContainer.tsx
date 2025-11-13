import { watch } from '@arcgis/core/core/reactiveUtils';
import type { EventHandler } from '@arcgis/lumina';
import '@arcgis/map-components/components/arcgis-home';
import '@arcgis/map-components/components/arcgis-locate';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-zoom';
import { useQuery } from '@tanstack/react-query';
import { BusyBar, LayerSelector, type LayerSelectorProps } from '@ugrc/utah-design-system';
import { useViewLoading, utahMercatorExtent } from '@ugrc/utilities/hooks';
import { useEffect, useRef, useState } from 'react';
import config from '../config';
import useMap from '../hooks/useMap';
import { getGraphicsAndExtent, parseUrlParams } from '../services/urlParams';
import PreviewControls from './PreviewControls';
import TilesControls from './TilesControls';

export const MapContainer = ({ onClick }: { onClick?: EventHandler<HTMLArcgisMapElement['arcgisViewClick']> }) => {
  const [selectorOptions, setSelectorOptions] = useState<LayerSelectorProps | null>(null);
  const { setMapView, setGraphic } = useMap();
  const mapRef = useRef<HTMLArcgisMapElement>(null);
  const viewIsLoading = useViewLoading(mapRef.current?.view);

  const { data: urlData } = useQuery({
    queryKey: ['urlExtents'],
    queryFn: () => getGraphicsAndExtent(parseUrlParams()),
    staleTime: Infinity,
  });

  // place any graphics from the categories passed in via URL
  useEffect(() => {
    if (urlData?.graphics) {
      setGraphic(urlData.graphics);
    }
  }, [urlData?.graphics, setGraphic]);

  // setup the Map
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    map.constraints.snapToZoom = false;

    // I had issues with the base maps not being loaded if the graphics layer in AreaOfInterest.tsx was added before the view was ready
    watch(
      () => map.view?.ready,
      () => setMapView(map.view),
      { once: true },
    );

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
      extent={
        urlData?.extent?.expand(config.DEFAULT_EXTENT_EXPAND) ?? utahMercatorExtent.expand(config.DEFAULT_EXTENT_EXPAND)
      }
      // @ts-expect-error Esri types are too strict
      popup={{
        dockOptions: {
          buttonEnabled: false,
        },
        highlightEnabled: false,
      }}
    >
      <BusyBar busy={viewIsLoading} />
      <PreviewControls />
      <TilesControls />
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-home slot="top-left"></arcgis-home>
      {selectorOptions && <LayerSelector {...selectorOptions}></LayerSelector>}
    </arcgis-map>
  );
};
