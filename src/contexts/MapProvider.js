"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapProvider = exports.MapContext = void 0;
var hooks_1 = require("@ugrc/utilities/hooks");
var react_1 = require("react");
var config_1 = require("../config");
exports.MapContext = (0, react_1.createContext)(null);
var MapProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), mapView = _b[0], setMapView = _b[1];
    var setGraphic = (0, hooks_1.useGraphicManager)(mapView).setGraphic;
    var zoom = function (geometry) {
        if (!mapView) {
            console.warn('attempting to zoom before the mapView is set');
            return;
        }
        mapView.goTo(geometry.extent.expand(config_1.default.DEFAULT_EXTENT_EXPAND));
    };
    var placeGraphic = function (graphic) {
        setGraphic(graphic);
    };
    return (<exports.MapContext.Provider value={{
            mapView: mapView,
            setMapView: setMapView,
            placeGraphic: placeGraphic,
            zoom: zoom,
        }}>
      {children}
    </exports.MapContext.Provider>);
};
exports.MapProvider = MapProvider;
