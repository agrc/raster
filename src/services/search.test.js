"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var vitest_1 = require("vitest");
vitest_1.vi.mock('@arcgis/core/geometry/support/jsonUtils', function () { return ({
    getJsonType: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('@esri/arcgis-rest-feature-service', function () { return ({
    queryFeatures: vitest_1.vi.fn(),
}); });
var jsonUtils_1 = require("@arcgis/core/geometry/support/jsonUtils");
var arcgis_rest_feature_service_1 = require("@esri/arcgis-rest-feature-service");
var config_1 = require("../config");
var search_1 = require("./search");
(0, vitest_1.describe)('groupByCategory', function () {
    var createFeature = function (category, extraAttributes) {
        var _a;
        if (extraAttributes === void 0) { extraAttributes = {}; }
        return {
            attributes: __assign((_a = {}, _a[config_1.default.EXTENT_FIELDS.Category] = category, _a), extraAttributes),
        };
    };
    (0, vitest_1.it)('groups features by their category field', function () {
        var features = [
            createFeature('A', { id: 1 }),
            createFeature('B', { id: 2 }),
            createFeature('A', { id: 3 }),
        ];
        var grouped = (0, search_1.groupByCategory)(features);
        (0, vitest_1.expect)(grouped).toEqual({
            A: [features[0], features[2]],
            B: [features[1]],
        });
    });
    (0, vitest_1.it)('returns an empty object when no features are provided', function () {
        (0, vitest_1.expect)((0, search_1.groupByCategory)([])).toEqual({});
    });
});
(0, vitest_1.describe)('query', function () {
    var mockedGetJsonType = vitest_1.vi.mocked(jsonUtils_1.getJsonType);
    var mockedQueryFeatures = vitest_1.vi.mocked(arcgis_rest_feature_service_1.queryFeatures);
    var geometryJson = { type: 'polygon', rings: [] };
    var geometry = {
        toJSON: vitest_1.vi.fn(function () { return geometryJson; }),
    };
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        mockedGetJsonType.mockReturnValue('esriGeometryPolygon');
    });
    var expectSharedOptions = function (productType, expectedOutFields) {
        (0, vitest_1.expect)(mockedQueryFeatures).toHaveBeenCalledWith({
            url: config_1.default.EXTENT_SERVICE_URLS[productType],
            geometry: geometryJson,
            geometryType: 'esriGeometryPolygon',
            orderByFields: "".concat(config_1.default.EXTENT_FIELDS.Estimated_Date, " DESC"),
            outFields: expectedOutFields,
            returnGeometry: true,
            where: "upper(".concat(config_1.default.EXTENT_FIELDS.SHOW, ") = 'Y'"),
        });
    };
    (0, vitest_1.it)('queries with all extent fields for services that include metadata', function () { return __awaiter(void 0, void 0, void 0, function () {
        var productType, features, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productType = 'lidar';
                    features = [{ attributes: {} }];
                    mockedQueryFeatures.mockResolvedValue({ features: features });
                    return [4 /*yield*/, (0, search_1.query)(productType, geometry)];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result).toBe(features);
                    expectSharedOptions(productType, Object.values(config_1.default.EXTENT_FIELDS));
                    (0, vitest_1.expect)(mockedGetJsonType).toHaveBeenCalledWith(geometry);
                    (0, vitest_1.expect)(geometry.toJSON).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('filters metadata/report and lidar-only fields for services without them', function () { return __awaiter(void 0, void 0, void 0, function () {
        var productType, features, result, expectedOutFields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    productType = 'contours';
                    features = [{ attributes: { name: 'contour-1' } }];
                    mockedQueryFeatures.mockResolvedValue({ features: features });
                    return [4 /*yield*/, (0, search_1.query)(productType, geometry)];
                case 1:
                    result = _a.sent();
                    expectedOutFields = Object.values(config_1.default.EXTENT_FIELDS)
                        .filter(function (field) { return !['METADATA', 'REPORT'].includes(field); })
                        // "Year_Collected" is only requested for lidar product type
                        .filter(function (field) { return field !== 'Year_Collected'; });
                    (0, vitest_1.expect)(result).toBe(features);
                    expectSharedOptions(productType, expectedOutFields);
                    (0, vitest_1.expect)(mockedGetJsonType).toHaveBeenCalledWith(geometry);
                    (0, vitest_1.expect)(geometry.toJSON).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
