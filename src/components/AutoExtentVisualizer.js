"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AutoExtentVisualizer;
var Graphic_1 = require("@arcgis/core/Graphic");
var jsonUtils_1 = require("@arcgis/core/geometry/support/jsonUtils");
var react_query_1 = require("@tanstack/react-query");
var react_1 = require("react");
var config_1 = require("../config");
var useMap_1 = require("../hooks/useMap");
var useUrlParams_1 = require("../hooks/useUrlParams");
var search_1 = require("../services/search");
/**
 * Component that automatically visualizes extents on the map when URL filters are present
 */
function AutoExtentVisualizer() {
    var _this = this;
    var _a = (0, useUrlParams_1.useUrlParams)(), hasFilters = _a.hasFilters, cat = _a.cat, catGroup = _a.catGroup;
    var _b = (0, useMap_1.default)(), placeGraphic = _b.placeGraphic, zoom = _b.zoom, mapView = _b.mapView;
    var categoryFilter = cat || catGroup;
    // Query all extents matching the category filter across all product types
    var extentsData = (0, react_query_1.useQuery)({
        queryKey: ['autoExtents', categoryFilter],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var allProductTypes, allExtents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!categoryFilter)
                            return [2 /*return*/, null];
                        allProductTypes = [
                            'aerialPhotography',
                            'lidar',
                            'usgsDem',
                            'autoDem',
                            'contours',
                            'drg',
                        ];
                        return [4 /*yield*/, Promise.all(allProductTypes.map(function (productType) { return (0, search_1.queryExtentsByCategoryFilter)(productType, categoryFilter); }))];
                    case 1:
                        allExtents = _a.sent();
                        return [2 /*return*/, allExtents.flat()];
                }
            });
        }); },
        enabled: hasFilters && categoryFilter !== null,
        staleTime: Infinity, // Don't refetch, this data is static for the session
    }).data;
    // Place graphics on the map when extents data is available and map is ready
    (0, react_1.useEffect)(function () {
        if (!extentsData || extentsData.length === 0 || !mapView || !mapView.ready) {
            return;
        }
        // Wait for map to be fully ready before adding graphics
        mapView.when(function () {
            var graphics = extentsData.map(function (feature) {
                return new Graphic_1.default({
                    geometry: (0, jsonUtils_1.fromJSON)(feature.geometry),
                    symbol: config_1.default.RESULT_SYMBOL,
                });
            });
            placeGraphic(graphics);
            // Zoom to combined extent of all graphics
            if (graphics.length > 0) {
                // Get the combined extent of all graphics
                var allGeometries = graphics.map(function (g) { return g.geometry; }).filter(function (g) { return g !== null; });
                if (allGeometries.length > 0) {
                    zoom({ extent: allGeometries[0].extent });
                }
            }
        });
    }, [extentsData, mapView, placeGraphic, zoom]);
    return null; // This is an invisible component
}
