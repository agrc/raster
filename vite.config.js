"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="vitest" />
var plugin_react_1 = require("@vitejs/plugin-react");
var vite_1 = require("vite");
var vite_plugin_package_version_1 = require("vite-plugin-package-version");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)(), (0, vite_plugin_package_version_1.default)()],
    resolve: {
    // this is only applicable when pnpm-linking the utah-design-package
    // dedupe: ['firebase', '@arcgis/core'],
    },
    test: {
        environment: 'happy-dom',
    },
});
