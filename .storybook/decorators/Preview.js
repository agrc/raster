"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewDecorator = void 0;
var PreviewProvider_1 = require("../../src/contexts/PreviewProvider");
var PreviewDecorator = function (Story) { return (<PreviewProvider_1.PreviewContext.Provider value={{ selectedPreviewId: 'NAIP 2024 | 4-Band (county mosaic)', removePreview: function () { }, addPreview: function () { } }}>
    <Story />
  </PreviewProvider_1.PreviewContext.Provider>); };
exports.PreviewDecorator = PreviewDecorator;
