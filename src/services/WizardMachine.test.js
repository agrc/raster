"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var wizardMachine_1 = require("./wizardMachine");
(0, vitest_1.describe)('toggleValueInList', function () {
    (0, vitest_1.it)('adds a product type when it is not in the list', function () {
        var currentTypes = ['aerialPhotography', 'lidar'];
        var result = (0, wizardMachine_1.toggleValueInList)(currentTypes, 'usgsDem');
        (0, vitest_1.expect)(result).toEqual(['aerialPhotography', 'lidar', 'usgsDem']);
        // Verify original array is not mutated
        (0, vitest_1.expect)(currentTypes).toEqual(['aerialPhotography', 'lidar']);
    });
    (0, vitest_1.it)('removes a product type when it is already in the list', function () {
        var currentTypes = ['aerialPhotography', 'lidar', 'usgsDem'];
        var result = (0, wizardMachine_1.toggleValueInList)(currentTypes, 'lidar');
        (0, vitest_1.expect)(result).toEqual(['aerialPhotography', 'usgsDem']);
        // Verify original array is not mutated
        (0, vitest_1.expect)(currentTypes).toEqual(['aerialPhotography', 'lidar', 'usgsDem']);
    });
    (0, vitest_1.it)('adds a product type to an empty list', function () {
        var currentTypes = [];
        var result = (0, wizardMachine_1.toggleValueInList)(currentTypes, 'contours');
        (0, vitest_1.expect)(result).toEqual(['contours']);
        (0, vitest_1.expect)(currentTypes).toEqual([]);
    });
    (0, vitest_1.it)('removes the only product type from a list with one item', function () {
        var currentTypes = ['drg'];
        var result = (0, wizardMachine_1.toggleValueInList)(currentTypes, 'drg');
        (0, vitest_1.expect)(result).toEqual([]);
        (0, vitest_1.expect)(currentTypes).toEqual(['drg']);
    });
});
