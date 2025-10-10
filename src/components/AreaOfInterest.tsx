import Collection from '@arcgis/core/core/Collection';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SketchTooltipOptions from '@arcgis/core/views/interactive/sketch/SketchTooltipOptions';
import type { EventHandler } from '@arcgis/lumina';
import '@arcgis/map-components/components/arcgis-search';
import '@arcgis/map-components/components/arcgis-sketch';
import { Label } from '@ugrc/utah-design-system';
import { useEffect, useRef } from 'react';
import config from '../config';
import './AreaOfInterest.css';
import useMap from './hooks/useMap';
import useWizardMachine from './hooks/useWizardMachine';

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

      send({ type: 'SET_AOI', aoi: graphic });
    }
  };

  const onSearchSelect: EventHandler<HTMLArcgisSearchElement['arcgisSelectResult']> = (event) => {
    const { result } = event.detail;

    if (result?.feature) {
      // cancel any active sketching and reset toolbar
      sketchRef.current?.cancel();

      result.feature.symbol = config.SYMBOLS.POINT;

      drawingLayerRef.current.removeAll();
      drawingLayerRef.current.add(result.feature);

      send({ type: 'SET_AOI', aoi: result.feature });
    }
  };

  return (
    <>
      <Label>
        Search for an address
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
      </Label>
      <Label className="mt-4 block">
        Or draw on the map using the tools below
        <div className="mt-1 flex items-center justify-center">
          <arcgis-sketch
            creationMode="continuous"
            defaultGraphicsLayerDisabled
            hideSelectionToolsLassoSelection
            hideSelectionToolsRectangleSelection
            hideSettingsMenu
            hideSnappingControls
            hideUndoRedoMenu
            layer={drawingLayerRef.current}
            onarcgisCreate={onSketchCreate}
            polylineSymbol={config.SYMBOLS.LINE}
            pointSymbol={config.SYMBOLS.POINT}
            position="manual"
            ref={sketchRef}
            referenceElement={config.MAP_ELEMENT_ID}
            scale="s"
            tooltipOptions={tooltipOptions}
          />
        </div>
      </Label>
    </>
  );
}
