"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewContext = void 0;
exports.default = PreviewProvider;
var WebTileLayer_1 = require("@arcgis/core/layers/WebTileLayer");
var react_1 = require("react");
var config_1 = require("../config");
var useMap_1 = require("../hooks/useMap");
exports.PreviewContext = (0, react_1.createContext)(null);
var layerId = 'preview-layer';
function PreviewProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), selectedPreviewId = _b[0], setPreviewId = _b[1];
    var mapView = (0, useMap_1.default)().mapView;
    var addPreview = function (id, serviceName) {
        if (!(mapView === null || mapView === void 0 ? void 0 : mapView.map))
            return;
        removePreview();
        var previewUrl = config_1.default.DISCOVER_URL.replace('<quadWord>', import.meta.env.VITE_DISCOVER).replace('<serviceName>', serviceName);
        var layer = new WebTileLayer_1.default({
            urlTemplate: previewUrl,
            id: layerId,
        });
        mapView.map.add(layer, 0);
        setPreviewId(id);
    };
    var removePreview = function () {
        if (!(mapView === null || mapView === void 0 ? void 0 : mapView.map))
            return;
        setPreviewId(null);
        var layer = mapView.map.findLayerById(layerId);
        if (layer)
            mapView.map.remove(layer);
    };
    return (<exports.PreviewContext.Provider value={{ selectedPreviewId: selectedPreviewId, addPreview: addPreview, removePreview: removePreview }}>
      {children}
    </exports.PreviewContext.Provider>);
}
