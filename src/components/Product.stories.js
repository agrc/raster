"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wrapping = exports.WithPreview = exports.Default = void 0;
var react_aria_components_1 = require("react-aria-components");
var MapView_1 = require("../../.storybook/decorators/MapView");
var Preview_1 = require("../../.storybook/decorators/Preview");
var config_1 = require("../config");
var Product_1 = require("./Product");
var meta = {
    component: Product_1.default,
    decorators: [MapView_1.MapViewDecorator, Preview_1.PreviewDecorator],
    render: function (args) { return (<div className="w-80 rounded-b-lg bg-gray-100 px-2 py-2 dark:bg-black">
      <react_aria_components_1.Tree aria-label="Product" selectionMode="none" defaultExpandedKeys={['HRO 2012 (12.5cm)-0']}>
        <Product_1.default {...args}/>
      </react_aria_components_1.Tree>
    </div>); },
};
exports.default = meta;
exports.Default = {
    args: {
        feature: {
            geometry: { type: 'polygon' },
            attributes: (_a = {},
                _a[config_1.default.EXTENT_FIELDS.Product] = 'HRO 2012 (12.5cm)',
                _a[config_1.default.EXTENT_FIELDS.OBJECTID] = 0,
                _a[config_1.default.EXTENT_FIELDS.Category] = '',
                _a[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _a[config_1.default.EXTENT_FIELDS.Estimated_Date] = 0,
                _a[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://gis.utah.gov/products/sgid/aerial-photography/digital-orthophoto-quadrangle/#1977-black-and-white-doqs',
                _a[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                _a[config_1.default.EXTENT_FIELDS.SHOW] = null,
                _a[config_1.default.EXTENT_FIELDS.ServiceName] = '',
                _a[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _a[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _a),
        },
    },
};
exports.WithPreview = {
    args: {
        feature: {
            geometry: { type: 'polygon' },
            attributes: (_b = {},
                _b[config_1.default.EXTENT_FIELDS.OBJECTID] = 0,
                _b[config_1.default.EXTENT_FIELDS.Category] = '',
                _b[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _b[config_1.default.EXTENT_FIELDS.Estimated_Date] = 0,
                _b[config_1.default.EXTENT_FIELDS.HTML_Page] = '',
                _b[config_1.default.EXTENT_FIELDS.In_House] = null,
                _b[config_1.default.EXTENT_FIELDS.Product] = 'HRO 2012 (12.5cm)',
                _b[config_1.default.EXTENT_FIELDS.ServiceName] = 'topo_basemap',
                _b[config_1.default.EXTENT_FIELDS.SHOW] = null,
                _b[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _b[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _b),
        },
    },
};
exports.Wrapping = {
    args: {
        feature: {
            geometry: { type: 'polygon' },
            attributes: (_c = {},
                _c[config_1.default.EXTENT_FIELDS.OBJECTID] = 0,
                _c[config_1.default.EXTENT_FIELDS.Category] = '',
                _c[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _c[config_1.default.EXTENT_FIELDS.Estimated_Date] = 0,
                _c[config_1.default.EXTENT_FIELDS.HTML_Page] = '',
                _c[config_1.default.EXTENT_FIELDS.In_House] = null,
                _c[config_1.default.EXTENT_FIELDS.Product] = 'A Really Long Product HRO 2012 (12.5cm)',
                _c[config_1.default.EXTENT_FIELDS.ServiceName] = 'topo_basemap',
                _c[config_1.default.EXTENT_FIELDS.SHOW] = null,
                _c[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _c[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _c),
        },
    },
};
