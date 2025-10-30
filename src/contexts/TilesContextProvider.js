"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TilesContext = void 0;
exports.default = TilesContextProvider;
var react_1 = require("react");
exports.TilesContext = (0, react_1.createContext)(null);
function TilesContextProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), count = _b[0], setCount = _b[1];
    return <exports.TilesContext.Provider value={{ count: count, setCount: setCount }}>{children}</exports.TilesContext.Provider>;
}
