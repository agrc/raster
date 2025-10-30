"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AerialPhotography = exports.LidarDEMsExpanded = void 0;
var react_aria_components_1 = require("react-aria-components");
var MapView_1 = require("../../.storybook/decorators/MapView");
var Preview_1 = require("../../.storybook/decorators/Preview");
var config_1 = require("../config");
var Category_1 = require("./Category");
var meta = {
    component: Category_1.default,
    decorators: [MapView_1.MapViewDecorator, Preview_1.PreviewDecorator],
    render: function (args) { return (<div className="w-80 rounded-b-lg bg-gray-100 px-2 py-2 dark:bg-black">
      <react_aria_components_1.Tree aria-label="Category" selectionMode="none" defaultExpandedKeys={[args.category]}>
        <Category_1.default {...args}/>
      </react_aria_components_1.Tree>
    </div>); },
};
exports.default = meta;
exports.LidarDEMsExpanded = {
    args: {
        category: '5 Meter',
        productType: 'lidar',
        products: [
            {
                geometry: { type: 'polygon' },
                attributes: (_a = {},
                    _a[config_1.default.EXTENT_FIELDS.OBJECTID] = 4,
                    _a[config_1.default.EXTENT_FIELDS.Product] = 'no match (3)',
                    _a[config_1.default.EXTENT_FIELDS.Category] = '5 Meter',
                    _a[config_1.default.EXTENT_FIELDS.Description] = 'should be third',
                    _a[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2024,
                    _a[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://gis.utah.gov/products/sgid/elevation/lidar/',
                    _a[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                    _a[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                    _a[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_dsm_first_return',
                    _a[config_1.default.EXTENT_FIELDS.Year_Collected] = '2024',
                    _a),
            },
            {
                geometry: { type: 'polygon' },
                attributes: (_b = {},
                    _b[config_1.default.EXTENT_FIELDS.OBJECTID] = 1,
                    _b[config_1.default.EXTENT_FIELDS.Product] = 'First Return DSM (2)',
                    _b[config_1.default.EXTENT_FIELDS.Category] = '5 Meter',
                    _b[config_1.default.EXTENT_FIELDS.Description] = 'should be second',
                    _b[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2024,
                    _b[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://gis.utah.gov/products/sgid/elevation/lidar/',
                    _b[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                    _b[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                    _b[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_dsm_first_return',
                    _b[config_1.default.EXTENT_FIELDS.Year_Collected] = '2024',
                    _b),
            },
            {
                geometry: { type: 'polygon' },
                attributes: (_c = {},
                    _c[config_1.default.EXTENT_FIELDS.OBJECTID] = 2,
                    _c[config_1.default.EXTENT_FIELDS.Product] = 'Bare Earth DEM (1)',
                    _c[config_1.default.EXTENT_FIELDS.Category] = '5 Meter',
                    _c[config_1.default.EXTENT_FIELDS.Description] = 'should be first',
                    _c[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2024,
                    _c[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://gis.utah.gov/products/sgid/elevation/lidar/',
                    _c[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                    _c[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                    _c[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_dem_bare_earth',
                    _c[config_1.default.EXTENT_FIELDS.Year_Collected] = '2024',
                    _c),
            },
        ],
    },
};
exports.AerialPhotography = {
    args: {
        category: 'RGB',
        productType: 'aerialPhotography',
        products: [
            {
                geometry: { type: 'polygon' },
                attributes: (_d = {},
                    _d[config_1.default.EXTENT_FIELDS.OBJECTID] = 3,
                    _d[config_1.default.EXTENT_FIELDS.Product] = 'single infrared band 4 (3)',
                    _d[config_1.default.EXTENT_FIELDS.Category] = 'HRO 2023 (6 inch)',
                    _d[config_1.default.EXTENT_FIELDS.Description] = 'should be third',
                    _d[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2023,
                    _d[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://gis.utah.gov/products/sgid/aerial-photography/hro-2023-6-inch/',
                    _d[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                    _d[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                    _d[config_1.default.EXTENT_FIELDS.ServiceName] = 'hro_2023_6inch',
                    _d),
            },
            {
                geometry: { type: 'polygon' },
                attributes: (_e = {},
                    _e[config_1.default.EXTENT_FIELDS.OBJECTID] = 6,
                    _e[config_1.default.EXTENT_FIELDS.Product] = 'CIR (county mosaic) (2)',
                    _e[config_1.default.EXTENT_FIELDS.Category] = 'HRO 2023 (6 inch)',
                    _e[config_1.default.EXTENT_FIELDS.Description] = 'should be second',
                    _e[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2023,
                    _e[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://gis.utah.gov/products/sgid/aerial-photography/hro-2023-6-inch/',
                    _e[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                    _e[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                    _e[config_1.default.EXTENT_FIELDS.ServiceName] = 'hro_2023_6inch',
                    _e),
            },
            {
                geometry: { type: 'polygon' },
                attributes: (_f = {},
                    _f[config_1.default.EXTENT_FIELDS.OBJECTID] = 7,
                    _f[config_1.default.EXTENT_FIELDS.Product] = 'RGB (county mosaic) (1)',
                    _f[config_1.default.EXTENT_FIELDS.Category] = 'HRO 2023 (6 inch)',
                    _f[config_1.default.EXTENT_FIELDS.Description] = 'should be first',
                    _f[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2022,
                    _f[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://gis.utah.gov/products/sgid/aerial-photography/naip/',
                    _f[config_1.default.EXTENT_FIELDS.In_House] = 'No',
                    _f[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                    _f[config_1.default.EXTENT_FIELDS.ServiceName] = 'naip_2022_60cm',
                    _f),
            },
        ],
    },
};
