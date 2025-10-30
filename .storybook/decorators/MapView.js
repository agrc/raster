"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapViewDecorator = void 0;
var MapProvider_1 = require("../../src/contexts/MapProvider");
var MapViewDecorator = function (Story) { return (<MapProvider_1.MapContext.Provider value={{ mapView: {}, setMapView: function () { }, placeGraphic: function () { }, zoom: function () { } }}>
    <Story />
  </MapProvider_1.MapContext.Provider>); };
exports.MapViewDecorator = MapViewDecorator;
