"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AreaOfInterest;
var Collection_1 = require("@arcgis/core/core/Collection");
var GraphicsLayer_1 = require("@arcgis/core/layers/GraphicsLayer");
var SketchTooltipOptions_1 = require("@arcgis/core/views/interactive/sketch/SketchTooltipOptions");
require("@arcgis/map-components/components/arcgis-search");
require("@arcgis/map-components/components/arcgis-sketch");
var utah_design_system_1 = require("@ugrc/utah-design-system");
var react_1 = require("react");
var config_1 = require("../config");
var useMap_1 = require("../hooks/useMap");
var useWizardMachine_1 = require("../hooks/useWizardMachine");
require("./AreaOfInterest.css");
var sources = new Collection_1.default([
    {
        name: 'Street Address',
        placeholder: 'e.g. 123 South Main St',
        url: 'https://masquerade.ugrc.utah.gov/arcgis/rest/services/UtahLocator/GeocodeServer',
    },
]);
var tooltipOptions = new SketchTooltipOptions_1.default({ enabled: true });
function AreaOfInterest() {
    var mapView = (0, useMap_1.default)().mapView;
    var drawingLayerRef = (0, react_1.useRef)(new GraphicsLayer_1.default());
    var send = (0, useWizardMachine_1.default)().send;
    var searchRef = (0, react_1.useRef)(null);
    var sketchRef = (0, react_1.useRef)(null);
    // add graphics layer to the map
    (0, react_1.useEffect)(function () {
        if (!(mapView === null || mapView === void 0 ? void 0 : mapView.map))
            return;
        mapView.map.add(drawingLayerRef.current);
    }, [mapView]);
    if (!mapView) {
        return null;
    }
    var onSketchCreate = function (event) {
        var _a, _b;
        var _c = event.detail, state = _c.state, graphic = _c.graphic;
        if (state === 'complete') {
            (_a = searchRef.current) === null || _a === void 0 ? void 0 : _a.clear();
            drawingLayerRef.current.removeAll();
            drawingLayerRef.current.add(graphic);
            send({ type: 'SET_AOI', aoi: graphic.geometry });
            // reset sketch tool so that it's not active in step 3
            (_b = sketchRef.current) === null || _b === void 0 ? void 0 : _b.cancel();
        }
    };
    var onSearchSelect = function (event) {
        var _a;
        var result = event.detail.result;
        if (result === null || result === void 0 ? void 0 : result.feature) {
            // cancel any active sketching and reset toolbar
            (_a = sketchRef.current) === null || _a === void 0 ? void 0 : _a.cancel();
            result.feature.symbol = config_1.default.DRAWING_SYMBOLS.POINT;
            drawingLayerRef.current.removeAll();
            drawingLayerRef.current.add(result.feature);
            send({ type: 'SET_AOI', aoi: result.feature.geometry });
        }
    };
    return (<>
      <utah_design_system_1.Label>
        Search for an address
        <arcgis-search includeDefaultSourcesDisabled locationDisabled onarcgisSelectResult={onSearchSelect} popupDisabled ref={searchRef} referenceElement={config_1.default.MAP_ELEMENT_ID} resultGraphicDisabled sources={sources}/>
      </utah_design_system_1.Label>
      <utah_design_system_1.Label className="mt-4 block">
        Or draw on the map using the tools below
        <div className="mt-1 flex items-center justify-center">
          <arcgis-sketch creationMode="continuous" defaultGraphicsLayerDisabled hideSelectionToolsLassoSelection hideSelectionToolsRectangleSelection hideSettingsMenu hideSnappingControls hideUndoRedoMenu layer={drawingLayerRef.current} onarcgisCreate={onSketchCreate} onarcgisPropertyChange={function (event) {
            var _a;
            // clear everything if a new sketch tool is selected
            if (event.target.state === 'active') {
                (_a = searchRef.current) === null || _a === void 0 ? void 0 : _a.clear();
                drawingLayerRef.current.removeAll();
            }
        }} polylineSymbol={config_1.default.DRAWING_SYMBOLS.LINE} pointSymbol={config_1.default.DRAWING_SYMBOLS.POINT} position="manual" ref={sketchRef} referenceElement={config_1.default.MAP_ELEMENT_ID} scale="s" tooltipOptions={tooltipOptions}/>
        </div>
      </utah_design_system_1.Label>
    </>);
}
