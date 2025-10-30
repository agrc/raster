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
test_1.test.describe('Auto-Correlated DEMs workflow', function () {
    (0, test_1.test)('should complete full workflow for auto-correlated DEM product', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var addressInput, resultsSection, productCard;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Step 1: Select Auto-Correlated DEMs product type
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 1 - Select Products')).toBeVisible()];
                case 2:
                    // Step 1: Select Auto-Correlated DEMs product type
                    _c.sent();
                    return [4 /*yield*/, page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' }).check()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' })).toBeChecked()];
                case 4:
                    _c.sent();
                    // Move to Step 2: Define Area of Interest
                    return [4 /*yield*/, page.getByText('Step 2 - Define Area of Interest').click()];
                case 5:
                    // Move to Step 2: Define Area of Interest
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 2 - Define Area of Interest')).toBeVisible()];
                case 6:
                    _c.sent();
                    // Use address search
                    return [4 /*yield*/, page.getByLabel('Address').click()];
                case 7:
                    // Use address search
                    _c.sent();
                    addressInput = page.getByPlaceholder('Search for an address or place');
                    return [4 /*yield*/, addressInput.fill('St. George, UT')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, addressInput.press('Enter')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 10:
                    _c.sent();
                    // Move to Step 3: Results
                    return [4 /*yield*/, page.getByText('Step 3 - Results').click()];
                case 11:
                    // Move to Step 3: Results
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 3 - Results')).toBeVisible()];
                case 12:
                    _c.sent();
                    // Wait for search results to load
                    return [4 /*yield*/, page.waitForTimeout(3000)];
                case 13:
                    // Wait for search results to load
                    _c.sent();
                    resultsSection = page.locator('[class*="SearchResults"]').first();
                    return [4 /*yield*/, (0, test_1.expect)(resultsSection).toBeVisible({ timeout: 10000 })];
                case 14:
                    _c.sent();
                    productCard = page.locator('[class*="Product"]').first();
                    return [4 /*yield*/, (0, test_1.expect)(productCard).toBeVisible({ timeout: 5000 })];
                case 15:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should allow multiple product types selection', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var addressInput, resultsSection;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Select multiple DEM types
                    return [4 /*yield*/, page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' }).check()];
                case 2:
                    // Select multiple DEM types
                    _c.sent();
                    return [4 /*yield*/, page.getByRole('checkbox', { name: 'USGS DEMs' }).check()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' })).toBeChecked()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'USGS DEMs' })).toBeChecked()];
                case 5:
                    _c.sent();
                    // Define area of interest
                    return [4 /*yield*/, page.getByText('Step 2 - Define Area of Interest').click()];
                case 6:
                    // Define area of interest
                    _c.sent();
                    return [4 /*yield*/, page.getByLabel('Address').click()];
                case 7:
                    _c.sent();
                    addressInput = page.getByPlaceholder('Search for an address or place');
                    return [4 /*yield*/, addressInput.fill('Ogden, UT')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, addressInput.press('Enter')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 10:
                    _c.sent();
                    // View results - should show products from both types
                    return [4 /*yield*/, page.getByText('Step 3 - Results').click()];
                case 11:
                    // View results - should show products from both types
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(3000)];
                case 12:
                    _c.sent();
                    resultsSection = page.locator('[class*="SearchResults"]').first();
                    return [4 /*yield*/, (0, test_1.expect)(resultsSection).toBeVisible({ timeout: 10000 })];
                case 13:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
