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
var test_1 = require("@playwright/test");
test_1.test.describe('Application basics', function () {
    (0, test_1.test)('should load the application successfully', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var mapContainer;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Verify the header is visible
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: /UGRC Raster Data Discovery/i })).toBeVisible()];
                case 2:
                    // Verify the header is visible
                    _c.sent();
                    // Verify the wizard steps are present
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 1 - Select Products')).toBeVisible()];
                case 3:
                    // Verify the wizard steps are present
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 2 - Define Area of Interest')).toBeVisible()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 3 - Results')).toBeVisible()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 4 - Download')).toBeVisible()];
                case 6:
                    _c.sent();
                    mapContainer = page.locator('#map').first();
                    return [4 /*yield*/, (0, test_1.expect)(mapContainer).toBeVisible()];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should have all product types available', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Verify all 6 product types are present
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'Aerial Photography' })).toBeVisible()];
                case 2:
                    // Verify all 6 product types are present
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'Lidar DEMs' })).toBeVisible()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'USGS DEMs' })).toBeVisible()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' })).toBeVisible()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'Contours' })).toBeVisible()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'USGS Topo Maps' })).toBeVisible()];
                case 7:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should enforce wizard flow - step 2 disabled without product selection', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var step2Disclosure;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Verify step 1 is expanded by default
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 1 - Select Products')).toBeVisible()];
                case 2:
                    // Verify step 1 is expanded by default
                    _c.sent();
                    step2Disclosure = page.locator('[id="step2"]');
                    return [4 /*yield*/, (0, test_1.expect)(step2Disclosure).toHaveAttribute('data-disabled', 'true')];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should enable step 2 after selecting a product', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var step2Disclosure;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Select a product
                    return [4 /*yield*/, page.getByRole('checkbox', { name: 'Aerial Photography' }).check()];
                case 2:
                    // Select a product
                    _c.sent();
                    step2Disclosure = page.locator('[id="step2"]');
                    return [4 /*yield*/, (0, test_1.expect)(step2Disclosure).not.toHaveAttribute('data-disabled', 'true')];
                case 3:
                    _c.sent();
                    // Click to expand step 2
                    return [4 /*yield*/, page.getByText('Step 2 - Define Area of Interest').click()];
                case 4:
                    // Click to expand step 2
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 2 - Define Area of Interest')).toBeVisible()];
                case 5:
                    _c.sent();
                    // Verify area of interest options are present
                    return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Address')).toBeVisible()];
                case 6:
                    // Verify area of interest options are present
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should have footer with links', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var footer;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    footer = page.locator('footer').first();
                    return [4 /*yield*/, (0, test_1.expect)(footer).toBeVisible()];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should have responsive design', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: 
                // Test desktop view
                return [4 /*yield*/, page.setViewportSize({ width: 1280, height: 720 })];
                case 1:
                    // Test desktop view
                    _c.sent();
                    return [4 /*yield*/, page.goto('/')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 1 - Select Products')).toBeVisible()];
                case 3:
                    _c.sent();
                    // Test mobile view
                    return [4 /*yield*/, page.setViewportSize({ width: 375, height: 667 })];
                case 4:
                    // Test mobile view
                    _c.sent();
                    return [4 /*yield*/, page.goto('/')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 1 - Select Products')).toBeVisible()];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should handle map interactions', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var mapContainer;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    mapContainer = page.locator('#map').first();
                    return [4 /*yield*/, (0, test_1.expect)(mapContainer).toBeVisible()];
                case 2:
                    _c.sent();
                    // Select a product and area to enable map interactions
                    return [4 /*yield*/, page.getByRole('checkbox', { name: 'Aerial Photography' }).check()];
                case 3:
                    // Select a product and area to enable map interactions
                    _c.sent();
                    return [4 /*yield*/, page.getByText('Step 2 - Define Area of Interest').click()];
                case 4:
                    _c.sent();
                    // Verify map tools are available
                    return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Address')).toBeVisible()];
                case 5:
                    // Verify map tools are available
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
