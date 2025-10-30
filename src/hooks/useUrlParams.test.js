"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var useUrlParams_1 = require("./useUrlParams");
// Helper to mock window.location
var mockLocation = function (search) {
    // @ts-expect-error - we're intentionally mocking window.location
    delete window.location;
    // @ts-expect-error - we're intentionally mocking window.location
    window.location = { search: search };
};
var restoreLocation = function (original) {
    // @ts-expect-error - restoring window.location
    window.location = original;
};
(0, vitest_1.describe)('parseUrlParams', function () {
    (0, vitest_1.it)('parses title parameter', function () {
        var originalLocation = window.location;
        mockLocation('?title=My%20Title');
        var result = (0, useUrlParams_1.parseUrlParams)();
        (0, vitest_1.expect)(result.title).toBe('My Title');
        restoreLocation(originalLocation);
    });
    (0, vitest_1.it)('parses cat parameter', function () {
        var originalLocation = window.location;
        mockLocation('?cat=HRO%202009%20(25cm)');
        var result = (0, useUrlParams_1.parseUrlParams)();
        (0, vitest_1.expect)(result.cat).toBe('HRO 2009 (25cm)');
        restoreLocation(originalLocation);
    });
    (0, vitest_1.it)('parses catGroup parameter as array', function () {
        var originalLocation = window.location;
        mockLocation('?catGroup=24K%20GeoPDF,24K%20DRG');
        var result = (0, useUrlParams_1.parseUrlParams)();
        (0, vitest_1.expect)(result.catGroup).toEqual(['24K GeoPDF', '24K DRG']);
        restoreLocation(originalLocation);
    });
    (0, vitest_1.it)('parses products parameter as array of numbers', function () {
        var originalLocation = window.location;
        mockLocation('?products=1,3,5');
        var result = (0, useUrlParams_1.parseUrlParams)();
        (0, vitest_1.expect)(result.products).toEqual([1, 3, 5]);
        restoreLocation(originalLocation);
    });
    (0, vitest_1.it)('filters out invalid product indices', function () {
        var originalLocation = window.location;
        mockLocation('?products=1,abc,3');
        var result = (0, useUrlParams_1.parseUrlParams)();
        (0, vitest_1.expect)(result.products).toEqual([1, 3]);
        restoreLocation(originalLocation);
    });
    (0, vitest_1.it)('returns null for missing parameters', function () {
        var originalLocation = window.location;
        mockLocation('');
        var result = (0, useUrlParams_1.parseUrlParams)();
        (0, vitest_1.expect)(result.title).toBeNull();
        (0, vitest_1.expect)(result.cat).toBeNull();
        (0, vitest_1.expect)(result.catGroup).toBeNull();
        (0, vitest_1.expect)(result.products).toBeNull();
        restoreLocation(originalLocation);
    });
    (0, vitest_1.it)('handles multiple parameters', function () {
        var originalLocation = window.location;
        mockLocation('?title=My%20Title&cat=HRO%202009&products=1,2');
        var result = (0, useUrlParams_1.parseUrlParams)();
        (0, vitest_1.expect)(result.title).toBe('My Title');
        (0, vitest_1.expect)(result.cat).toBe('HRO 2009');
        (0, vitest_1.expect)(result.products).toEqual([1, 2]);
        restoreLocation(originalLocation);
    });
});
