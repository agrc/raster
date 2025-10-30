"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var config_1 = require("../config");
var utils_1 = require("./utils");
(0, vitest_1.describe)('isUrlLike', function () {
    (0, vitest_1.it)('returns true for http and https URLs', function () {
        (0, vitest_1.expect)((0, utils_1.isUrlLike)('http://example.com')).toBe(true);
        (0, vitest_1.expect)((0, utils_1.isUrlLike)('https://example.com')).toBe(true);
        (0, vitest_1.expect)((0, utils_1.isUrlLike)(' https://example.com/path ')).toBe(true);
    });
    vitest_1.it.each([
        ['null', null],
        ['undefined', undefined],
        ['empty string', ''],
        ['whitespace string', '   '],
        ['relative url', '/segments/path'],
        ['missing protocol', 'www.example.com'],
        ['unsupported protocol', 'ftp://example.com'],
        ['random text', 'not a url'],
    ])('returns false for %s', function (_, value) {
        (0, vitest_1.expect)((0, utils_1.isUrlLike)(value)).toBe(false);
    });
});
(0, vitest_1.describe)('isYes', function () {
    vitest_1.it.each([
        ['uppercase yes', 'YES'],
        ['mixed case yes', 'yEs'],
        ['normal yes', 'Yes'],
        ['leading/trailing whitespace', '  yes  '],
    ])('returns true for %s', function (_, value) {
        (0, vitest_1.expect)((0, utils_1.isYes)(value)).toBe(true);
    });
    vitest_1.it.each([
        ['null', null],
        ['undefined', undefined],
        ['empty string', ''],
        ['whitespace string', '   '],
        ['no', 'NO'],
        ['partial match', 'yes please'],
    ])('returns false for %s', function (_, value) {
        (0, vitest_1.expect)((0, utils_1.isYes)(value)).toBe(false);
    });
});
(0, vitest_1.describe)('removeCurlyBraces', function () {
    vitest_1.it.each([
        ['removes single block', 'Test Hello {remove me}', 'Test Hello'],
        ['handles trailing block with space', 'A {x} ', 'A'],
        ['no braces stays same', 'Nothing to change', 'Nothing to change'],
    ])('%s', function (_, input, output) {
        (0, vitest_1.expect)((0, utils_1.removeCurlyBracesContent)(input)).toBe(output);
    });
});
(0, vitest_1.describe)('getSort', function () {
    var createFeature = function (product) {
        var _a;
        return ({
            attributes: (_a = {}, _a[config_1.default.EXTENT_FIELDS.Product] = product, _a),
        });
    };
    (0, vitest_1.describe)('aerialPhotography sort order', function () {
        var sortOrder = config_1.default.PRODUCT_SORT_ORDER.aerialPhotography;
        (0, vitest_1.it)('sorts products according to PRODUCT_SORT_ORDER (rgb, cir, single, b&w)', function () {
            var features = [
                createFeature('Image B&W'),
                createFeature('Image RGB'),
                createFeature('Image CIR'),
                createFeature('Image Single'),
            ];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Image RGB');
            (0, vitest_1.expect)(features[1].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Image CIR');
            (0, vitest_1.expect)(features[2].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Image Single');
            (0, vitest_1.expect)(features[3].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Image B&W');
        });
        (0, vitest_1.it)('handles case-insensitive matching for rgb', function () {
            var features = [createFeature('Photo RGB'), createFeature('Photo rgb'), createFeature('Photo RgB')];
            features.sort((0, utils_1.getSort)(sortOrder));
            // All should be treated as equal priority (rgb)
            (0, vitest_1.expect)(features.every(function (f) { return f.attributes[config_1.default.EXTENT_FIELDS.Product].toLowerCase().includes('rgb'); })).toBe(true);
        });
        (0, vitest_1.it)('handles case-insensitive matching for cir', function () {
            var features = [createFeature('Photo CIR'), createFeature('Photo cir'), createFeature('Photo CiR')];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features.every(function (f) { return f.attributes[config_1.default.EXTENT_FIELDS.Product].toLowerCase().includes('cir'); })).toBe(true);
        });
        (0, vitest_1.it)('maintains relative order when products have same priority', function () {
            var features = [createFeature('RGB Photo A'), createFeature('RGB Photo B'), createFeature('RGB Photo C')];
            features.sort((0, utils_1.getSort)(sortOrder));
            // All RGB, should maintain relative order
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('RGB Photo A');
            (0, vitest_1.expect)(features[1].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('RGB Photo B');
            (0, vitest_1.expect)(features[2].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('RGB Photo C');
        });
        (0, vitest_1.it)('handles partial matches within product names', function () {
            var features = [
                createFeature('2023 Aerial Photography B&W 1-meter'),
                createFeature('2023 Aerial Photography RGB 6-inch'),
                createFeature('2023 Aerial Photography CIR 1-meter'),
            ];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toContain('RGB');
            (0, vitest_1.expect)(features[1].attributes[config_1.default.EXTENT_FIELDS.Product]).toContain('CIR');
            (0, vitest_1.expect)(features[2].attributes[config_1.default.EXTENT_FIELDS.Product]).toContain('B&W');
        });
    });
    (0, vitest_1.describe)('lidar sort order', function () {
        var sortOrder = config_1.default.PRODUCT_SORT_ORDER.lidar;
        (0, vitest_1.it)('sorts products according to PRODUCT_SORT_ORDER (bare, first)', function () {
            var features = [createFeature('Lidar First Surface'), createFeature('Lidar Bare Earth')];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Lidar Bare Earth');
            (0, vitest_1.expect)(features[1].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Lidar First Surface');
        });
        (0, vitest_1.it)('handles case-insensitive matching for bare', function () {
            var features = [createFeature('DEM BARE'), createFeature('DEM bare'), createFeature('DEM Bare')];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features.every(function (f) { return f.attributes[config_1.default.EXTENT_FIELDS.Product].toLowerCase().includes('bare'); })).toBe(true);
        });
        (0, vitest_1.it)('handles case-insensitive matching for first', function () {
            var features = [createFeature('DEM FIRST'), createFeature('DEM first'), createFeature('DEM First')];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features.every(function (f) { return f.attributes[config_1.default.EXTENT_FIELDS.Product].toLowerCase().includes('first'); })).toBe(true);
        });
        (0, vitest_1.it)('handles complex product names with partial matches', function () {
            var features = [
                createFeature('2020 Lidar 0.5m First Return DEM'),
                createFeature('2020 Lidar 0.5m Bare Earth DEM'),
                createFeature('2020 Lidar 1m First Return DEM'),
            ];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toContain('Bare');
            (0, vitest_1.expect)(features[1].attributes[config_1.default.EXTENT_FIELDS.Product]).toContain('First');
            (0, vitest_1.expect)(features[2].attributes[config_1.default.EXTENT_FIELDS.Product]).toContain('First');
        });
    });
    (0, vitest_1.describe)('edge cases', function () {
        (0, vitest_1.it)('handles products that do not match any sort order keyword', function () {
            var sortOrder = config_1.default.PRODUCT_SORT_ORDER.aerialPhotography;
            var features = [
                createFeature('Unknown Product Z'),
                createFeature('RGB Image'),
                createFeature('Unknown Product A'),
            ];
            features.sort((0, utils_1.getSort)(sortOrder));
            // RGB should be first (matches at index 0)
            // Unknown products return -1 from findIndex, so they sort after matched items
            // When both are unmatched, they maintain relative order (Z before A)
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('RGB Image');
            (0, vitest_1.expect)(features[1].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Unknown Product Z');
            (0, vitest_1.expect)(features[2].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Unknown Product A');
        });
        (0, vitest_1.it)('handles empty sort order array', function () {
            var features = [createFeature('Product B'), createFeature('Product A')];
            features.sort((0, utils_1.getSort)([]));
            // Should maintain original order when no matches
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Product B');
            (0, vitest_1.expect)(features[1].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Product A');
        });
        (0, vitest_1.it)('handles single product', function () {
            var sortOrder = config_1.default.PRODUCT_SORT_ORDER.aerialPhotography;
            var features = [createFeature('RGB Photo')];
            features.sort((0, utils_1.getSort)(sortOrder));
            (0, vitest_1.expect)(features[0].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('RGB Photo');
        });
        (0, vitest_1.it)('handles multiple matches with first match taking precedence', function () {
            var sortOrder = config_1.default.PRODUCT_SORT_ORDER.aerialPhotography;
            // Product that contains both 'rgb' and 'cir'
            var features = [createFeature('RGB or CIR Image'), createFeature('Pure RGB'), createFeature('Pure CIR')];
            features.sort((0, utils_1.getSort)(sortOrder));
            // 'RGB or CIR Image' should match on 'rgb' first (index 0)
            // 'Pure RGB' should also match on 'rgb' (index 0)
            // 'Pure CIR' should match on 'cir' (index 1)
            (0, vitest_1.expect)(features[2].attributes[config_1.default.EXTENT_FIELDS.Product]).toBe('Pure CIR');
        });
    });
});
