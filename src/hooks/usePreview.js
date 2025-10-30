"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = usePreview;
var react_1 = require("react");
var PreviewProvider_1 = require("../contexts/PreviewProvider");
function usePreview() {
    var context = (0, react_1.useContext)(PreviewProvider_1.PreviewContext);
    if (context === null) {
        throw new Error('usePreview must be used within a PreviewProvider');
    }
    return context;
}
