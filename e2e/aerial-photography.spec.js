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
test_1.test.describe('Aerial Photography workflow', function () {
    (0, test_1.test)('should complete full workflow for aerial photography product', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var addressInput, resultsSection, productCard, previewButton, downloadIcon, downloadSection;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Step 1: Select Aerial Photography product type
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 1 - Select Products')).toBeVisible()];
                case 2:
                    // Step 1: Select Aerial Photography product type
                    _c.sent();
                    return [4 /*yield*/, page.getByRole('checkbox', { name: 'Aerial Photography' }).check()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByRole('checkbox', { name: 'Aerial Photography' })).toBeChecked()];
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
                    // Select the map draw tool option (point, extent, or polygon)
                    return [4 /*yield*/, page.getByLabel('Address').click()];
                case 7:
                    // Select the map draw tool option (point, extent, or polygon)
                    _c.sent();
                    addressInput = page.getByPlaceholder('Search for an address or place');
                    return [4 /*yield*/, addressInput.fill('350 State St, Salt Lake City, UT')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, addressInput.press('Enter')];
                case 9:
                    _c.sent();
                    // Wait for the address to be found and selected
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 10:
                    // Wait for the address to be found and selected
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
                    // Click on the product to select it
                    return [4 /*yield*/, productCard.click()];
                case 16:
                    // Click on the product to select it
                    _c.sent();
                    previewButton = page.getByRole('button', { name: /preview/i }).first();
                    return [4 /*yield*/, previewButton.isVisible()];
                case 17:
                    if (!_c.sent()) return [3 /*break*/, 20];
                    return [4 /*yield*/, previewButton.click()];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 19:
                    _c.sent();
                    _c.label = 20;
                case 20:
                    downloadIcon = page.locator('[class*="download"]').first();
                    return [4 /*yield*/, downloadIcon.isVisible()];
                case 21:
                    if (!_c.sent()) return [3 /*break*/, 27];
                    return [4 /*yield*/, downloadIcon.click()];
                case 22:
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(1000)];
                case 23:
                    _c.sent();
                    // Verify Step 4 is now accessible
                    return [4 /*yield*/, page.getByText('Step 4 - Download').click()];
                case 24:
                    // Verify Step 4 is now accessible
                    _c.sent();
                    return [4 /*yield*/, (0, test_1.expect)(page.getByText('Step 4 - Download')).toBeVisible()];
                case 25:
                    _c.sent();
                    downloadSection = page.locator('[class*="Download"]').first();
                    return [4 /*yield*/, (0, test_1.expect)(downloadSection).toBeVisible({ timeout: 5000 })];
                case 26:
                    _c.sent();
                    _c.label = 27;
                case 27: return [2 /*return*/];
            }
        });
    }); });
    (0, test_1.test)('should filter aerial photography by category', function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var addressInput, categorySection;
        var page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, page.goto('/')];
                case 1:
                    _c.sent();
                    // Select Aerial Photography
                    return [4 /*yield*/, page.getByRole('checkbox', { name: 'Aerial Photography' }).check()];
                case 2:
                    // Select Aerial Photography
                    _c.sent();
                    // Move to Step 2 and select area of interest
                    return [4 /*yield*/, page.getByText('Step 2 - Define Area of Interest').click()];
                case 3:
                    // Move to Step 2 and select area of interest
                    _c.sent();
                    return [4 /*yield*/, page.getByLabel('Address').click()];
                case 4:
                    _c.sent();
                    addressInput = page.getByPlaceholder('Search for an address or place');
                    return [4 /*yield*/, addressInput.fill('1594 W North Temple, Salt Lake City, UT')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, addressInput.press('Enter')];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(2000)];
                case 7:
                    _c.sent();
                    // Move to Step 3
                    return [4 /*yield*/, page.getByText('Step 3 - Results').click()];
                case 8:
                    // Move to Step 3
                    _c.sent();
                    return [4 /*yield*/, page.waitForTimeout(3000)];
                case 9:
                    _c.sent();
                    categorySection = page.locator('text=/RGB|CIR|B&W|Single/i').first();
                    return [4 /*yield*/, categorySection.isVisible()];
                case 10:
                    if (!_c.sent()) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, test_1.expect)(categorySection).toBeVisible()];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    }); });
});
