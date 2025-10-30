"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var wizardMachine_1 = require("./wizardMachine");
(0, vitest_1.describe)('getInitialState with URL params', function () {
    (0, vitest_1.it)('returns default state when no URL params provided', function () {
        var result = (0, wizardMachine_1.getInitialState)();
        (0, vitest_1.expect)(result.step).toBe('step1');
        (0, vitest_1.expect)(result.context.productTypes).toEqual([]);
        (0, vitest_1.expect)(result.context.categoryFilter).toBeNull();
    });
    (0, vitest_1.it)('selects all product types and skips to step 2 when cat is provided', function () {
        var result = (0, wizardMachine_1.getInitialState)({ cat: 'HRO 2009 (25cm)', catGroup: null, products: null });
        (0, vitest_1.expect)(result.step).toBe('step2');
        (0, vitest_1.expect)(result.context.productTypes).toEqual([
            'aerialPhotography',
            'lidar',
            'usgsDem',
            'autoDem',
            'contours',
            'drg',
        ]);
        (0, vitest_1.expect)(result.context.categoryFilter).toBe('HRO 2009 (25cm)');
    });
    (0, vitest_1.it)('selects all product types and skips to step 2 when catGroup is provided', function () {
        var result = (0, wizardMachine_1.getInitialState)({ cat: null, catGroup: ['24K GeoPDF', '24K DRG'], products: null });
        (0, vitest_1.expect)(result.step).toBe('step2');
        (0, vitest_1.expect)(result.context.productTypes).toEqual([
            'aerialPhotography',
            'lidar',
            'usgsDem',
            'autoDem',
            'contours',
            'drg',
        ]);
        (0, vitest_1.expect)(result.context.categoryFilter).toEqual(['24K GeoPDF', '24K DRG']);
    });
    (0, vitest_1.it)('prefers cat over catGroup when both are provided', function () {
        var result = (0, wizardMachine_1.getInitialState)({ cat: 'HRO 2009', catGroup: ['24K GeoPDF'], products: null });
        (0, vitest_1.expect)(result.step).toBe('step2');
        (0, vitest_1.expect)(result.context.categoryFilter).toBe('HRO 2009');
    });
    (0, vitest_1.it)('pre-selects product types when products param is provided', function () {
        var result = (0, wizardMachine_1.getInitialState)({ cat: null, catGroup: null, products: [0, 1, 3] });
        (0, vitest_1.expect)(result.step).toBe('step1');
        (0, vitest_1.expect)(result.context.productTypes).toEqual(['aerialPhotography', 'lidar', 'autoDem']);
        (0, vitest_1.expect)(result.context.categoryFilter).toBeNull();
    });
    (0, vitest_1.it)('filters out invalid product indices', function () {
        var result = (0, wizardMachine_1.getInitialState)({ cat: null, catGroup: null, products: [-1, 0, 1, 100] });
        (0, vitest_1.expect)(result.context.productTypes).toEqual(['aerialPhotography', 'lidar']);
    });
    (0, vitest_1.it)('handles empty products array', function () {
        var result = (0, wizardMachine_1.getInitialState)({ cat: null, catGroup: null, products: [] });
        (0, vitest_1.expect)(result.step).toBe('step1');
        (0, vitest_1.expect)(result.context.productTypes).toEqual([]);
    });
});
