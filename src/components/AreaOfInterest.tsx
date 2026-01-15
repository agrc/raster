import Collection from '@arcgis/core/core/Collection';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SketchTooltipOptions from '@arcgis/core/views/interactive/sketch/SketchTooltipOptions';
import type { EventHandler } from '@arcgis/lumina';
import '@arcgis/map-components/components/arcgis-search';
import '@arcgis/map-components/components/arcgis-sketch';
import { useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { useEffect, useRef } from 'react';
import config from '../config';
import useMap from '../hooks/useMap';
import useWizardMachine from '../hooks/useWizardMachine';

const sources = new Collection<__esri.LocatorSearchSource>([
  {
    name: 'Street Address',
    placeholder: 'e.g. 123 South Main St',
    url: 'https://masquerade.ugrc.utah.gov/arcgis/rest/services/UtahLocator/GeocodeServer',
  },
]);
const tooltipOptions = new SketchTooltipOptions({ enabled: true });

export default function AreaOfInterest() {
  const { mapView } = useMap();
  const drawingLayerRef = useRef<__esri.GraphicsLayer>(new GraphicsLayer());
  const { send } = useWizardMachine();
  const searchRef = useRef<HTMLArcgisSearchElement>(null);
  const sketchRef = useRef<HTMLArcgisSketchElement>(null);
  const logEvent = useFirebaseAnalytics();

  // add graphics layer to the map
  useEffect(() => {
    if (!mapView?.map) return;

    mapView.map.add(drawingLayerRef.current);
  }, [mapView]);

  if (!mapView) {
    return null;
  }

  const onSketchCreate: EventHandler<HTMLArcgisSketchElement['arcgisCreate']> = (event) => {
    const { state, graphic } = event.detail;

    if (state === 'complete') {
      searchRef.current?.clear();

      drawingLayerRef.current.removeAll();
      drawingLayerRef.current.add(graphic);

      send({ type: 'SET_AOI', aoi: graphic.geometry });

      // Track AOI definition by drawing
      if (graphic.geometry) {
        logEvent('aoi_draw', { method: graphic.geometry.type });
      }

      // reset sketch tool so that it's not active in step 3
      sketchRef.current?.cancel();
    }
  };

  const onSearchSelect: EventHandler<HTMLArcgisSearchElement['arcgisSelectResult']> = (event) => {
    const { result } = event.detail;

    if (result?.feature) {
      // cancel any active sketching and reset toolbar
      sketchRef.current?.cancel();

      result.feature.symbol = config.DRAWING_SYMBOLS.POINT;

      drawingLayerRef.current.removeAll();
      drawingLayerRef.current.add(result.feature);

      send({ type: 'SET_AOI', aoi: result.feature.geometry });

      // Track AOI definition by search
      logEvent('aoi_search', { method: 'address' });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <span className="w-fit cursor-default text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Search for an address
        </span>
        <arcgis-search
          includeDefaultSourcesDisabled
          locationDisabled
          onarcgisSelectResult={onSearchSelect}
          popupDisabled
          ref={searchRef}
          referenceElement={config.MAP_ELEMENT_ID}
          resultGraphicDisabled
          sources={sources}
        />
      </div>
      <div>
        <span className="w-fit cursor-default text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Or draw on the map using the tools below
        </span>
        <div className="flex items-center justify-start">
          <arcgis-sketch
            className="border border-gray-400"
            creationMode="continuous"
            defaultGraphicsLayerDisabled
            hideSelectionToolsLassoSelection
            hideSelectionToolsRectangleSelection
            hideSettingsMenu
            hideSnappingControls
            hideUndoRedoMenu
            layer={drawingLayerRef.current}
            onarcgisCreate={onSketchCreate}
            onarcgisPropertyChange={(event) => {
              // clear everything if a new sketch tool is selected
              if (event.target.state === 'active') {
                searchRef.current?.clear();
                drawingLayerRef.current.removeAll();
              }
            }}
            polylineSymbol={config.DRAWING_SYMBOLS.LINE}
            pointSymbol={config.DRAWING_SYMBOLS.POINT}
            ref={sketchRef}
            referenceElement={config.MAP_ELEMENT_ID}
            scale="s"
            toolbarKind="docked"
            tooltipOptions={tooltipOptions}
          />
        </div>
      </div>
    </div>
  );
}
