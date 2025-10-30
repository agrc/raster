"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useTiles;
var react_1 = require("react");
var TilesContextProvider_1 = require("../contexts/TilesContextProvider");
function useTiles() {
    var context = (0, react_1.useContext)(TilesContextProvider_1.TilesContext);
    if (!context) {
        throw new Error('useTiles must be used within a TilesContextProvider');
    }
    return context;
}
