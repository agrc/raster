"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useMap;
var react_1 = require("react");
var MapProvider_1 = require("../contexts/MapProvider");
function useMap() {
    var context = (0, react_1.useContext)(MapProvider_1.MapContext);
    if (context === null) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
}
