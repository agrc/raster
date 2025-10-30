"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapContainer = void 0;
var reactiveUtils_1 = require("@arcgis/core/core/reactiveUtils");
require("@arcgis/map-components/components/arcgis-home");
require("@arcgis/map-components/components/arcgis-locate");
require("@arcgis/map-components/components/arcgis-map");
require("@arcgis/map-components/components/arcgis-zoom");
var utah_design_system_1 = require("@ugrc/utah-design-system");
var hooks_1 = require("@ugrc/utilities/hooks");
var react_1 = require("react");
var config_1 = require("../config");
var useMap_1 = require("../hooks/useMap");
var AutoExtentVisualizer_1 = require("./AutoExtentVisualizer");
var PreviewControls_1 = require("./PreviewControls");
var TilesControls_1 = require("./TilesControls");
var MapContainer = function (_a) {
    var _b;
    var onClick = _a.onClick;
    var _c = (0, react_1.useState)(null), selectorOptions = _c[0], setSelectorOptions = _c[1];
    var setMapView = (0, useMap_1.default)().setMapView;
    var mapRef = (0, react_1.useRef)(null);
    var viewIsLoading = (0, hooks_1.useViewLoading)((_b = mapRef.current) === null || _b === void 0 ? void 0 : _b.view);
    // setup the Map
    (0, react_1.useEffect)(function () {
        if (!mapRef.current)
            return;
        var map = mapRef.current;
        map.constraints.snapToZoom = false;
        // I had issues with the base maps not being loaded if the graphics layer in AreaOfInterest.tsx was added before the view was ready
        (0, reactiveUtils_1.watch)(function () { var _a; return (_a = map.view) === null || _a === void 0 ? void 0 : _a.ready; }, function () { return setMapView(map.view); }, { once: true });
        var selectorOptions = {
            options: {
                view: map.view,
                quadWord: import.meta.env.VITE_DISCOVER,
                basemaps: ['Terrain', 'Hybrid', 'Imagery', 'Lite', 'Topo'],
            },
        };
        setSelectorOptions(selectorOptions);
    }, [setMapView]);
    return (<>
      <AutoExtentVisualizer_1.default />
      <arcgis-map id={config_1.default.MAP_ELEMENT_ID} ref={mapRef} className="size-full" onarcgisViewClick={onClick} extent={hooks_1.utahMercatorExtent.expand(config_1.default.DEFAULT_EXTENT_EXPAND)} 
    // @ts-expect-error Esri types are too strict
    popup={{
            dockOptions: {
                buttonEnabled: false,
            },
            highlightEnabled: false,
        }}>
        <utah_design_system_1.BusyBar busy={viewIsLoading}/>
        <PreviewControls_1.default />
        <TilesControls_1.default />
        <arcgis-zoom className="z-20" position="top-left"></arcgis-zoom>
        <arcgis-home className="z-20" position="top-left"></arcgis-home>
        {selectorOptions && <utah_design_system_1.LayerSelector {...selectorOptions}></utah_design_system_1.LayerSelector>}
      </arcgis-map>
    </>);
};
exports.MapContainer = MapContainer;
