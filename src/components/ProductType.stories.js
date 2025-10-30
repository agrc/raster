"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LidarWithYearCollected = exports.NoResults = exports.AutoExpand = exports.Results = exports.ErrorState = exports.Loading = void 0;
var react_query_1 = require("@tanstack/react-query");
var react_1 = require("react");
var MapView_1 = require("../../.storybook/decorators/MapView");
var Preview_1 = require("../../.storybook/decorators/Preview");
var config_1 = require("../config");
var ProductType_1 = require("./ProductType");
var mockAoi = {
    toJSON: function () { return ({}); },
};
var QueryClientDecorator = function (Story) {
    var client = (0, react_1.useState)(function () {
        return new react_query_1.QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
    })[0];
    return (<react_query_1.QueryClientProvider client={client}>
      <Story />
    </react_query_1.QueryClientProvider>);
};
var meta = {
    component: ProductType_1.default,
    decorators: [QueryClientDecorator, MapView_1.MapViewDecorator, Preview_1.PreviewDecorator],
    args: {
        productType: 'lidar',
        aoi: mockAoi,
    },
    argTypes: {
        searchFn: { control: false },
        aoi: { control: false },
        productType: { control: 'select' },
    },
};
exports.default = meta;
var groupedResults = {
    'Category One': [
        {
            geometry: { type: 'polygon' },
            attributes: (_a = {},
                _a[config_1.default.EXTENT_FIELDS.OBJECTID] = 1,
                _a[config_1.default.EXTENT_FIELDS.Product] = 'Lidar Spring 2024',
                _a[config_1.default.EXTENT_FIELDS.Category] = 'Category One',
                _a[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _a[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2024,
                _a[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://example.com/lidar',
                _a[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                _a[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                _a[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_spring_2024',
                _a[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _a[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _a),
        },
        {
            geometry: { type: 'polygon' },
            attributes: (_b = {},
                _b[config_1.default.EXTENT_FIELDS.OBJECTID] = 2,
                _b[config_1.default.EXTENT_FIELDS.Product] = 'Lidar Spring 2023',
                _b[config_1.default.EXTENT_FIELDS.Category] = 'Category One {Hide Me}',
                _b[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _b[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2023,
                _b[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://example.com/lidar',
                _b[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                _b[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                _b[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_spring_2023',
                _b[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _b[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _b),
        },
    ],
    'Category Two': [
        {
            geometry: { type: 'polygon' },
            attributes: (_c = {},
                _c[config_1.default.EXTENT_FIELDS.OBJECTID] = 3,
                _c[config_1.default.EXTENT_FIELDS.Product] = 'Lidar Summer 2025',
                _c[config_1.default.EXTENT_FIELDS.Category] = 'Category Two',
                _c[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _c[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2025,
                _c[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://example.com/lidar-summer',
                _c[config_1.default.EXTENT_FIELDS.In_House] = 'No',
                _c[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                _c[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_summer_2025',
                _c[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _c[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _c),
        },
    ],
};
function ProductTypeStoryWrapper(args) {
    return (<div className="w-80 rounded-b-lg bg-gray-100 px-2 py-2 dark:bg-black">
      <ProductType_1.default {...args}/>
    </div>);
}
exports.Loading = {
    args: {
        searchFn: function () { return new Promise(function () { }); },
    },
    render: function (args) { return <ProductTypeStoryWrapper {...args}/>; },
};
exports.ErrorState = {
    args: {
        searchFn: function () { return Promise.reject(new Error('Failed to load results')); },
    },
    render: function (args) { return <ProductTypeStoryWrapper {...args}/>; },
};
exports.Results = {
    args: {
        searchFn: function () { return Promise.resolve(groupedResults); },
    },
    render: function (args) { return <ProductTypeStoryWrapper {...args}/>; },
};
var autoExpandResults = {
    'Category One': [
        {
            geometry: { type: 'polygon' },
            attributes: (_d = {},
                _d[config_1.default.EXTENT_FIELDS.OBJECTID] = 1,
                _d[config_1.default.EXTENT_FIELDS.Product] = 'Lidar Spring 2024',
                _d[config_1.default.EXTENT_FIELDS.Category] = 'Category One',
                _d[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _d[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2024,
                _d[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://example.com/lidar',
                _d[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                _d[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                _d[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_spring_2024',
                _d[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _d[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _d),
        },
    ],
};
exports.AutoExpand = {
    args: {
        searchFn: function () { return Promise.resolve(autoExpandResults); },
        isOnly: true,
    },
    render: function (args) { return <ProductTypeStoryWrapper {...args}/>; },
};
exports.NoResults = {
    args: {
        searchFn: function () { return Promise.resolve({}); },
    },
    render: function (args) { return <ProductTypeStoryWrapper {...args}/>; },
};
var groupedLidarResults = {
    'Category One {2025 LIDAR}': [
        {
            geometry: { type: 'polygon' },
            attributes: (_e = {},
                _e[config_1.default.EXTENT_FIELDS.OBJECTID] = 1,
                _e[config_1.default.EXTENT_FIELDS.Product] = 'Lidar Spring 2024',
                _e[config_1.default.EXTENT_FIELDS.Category] = 'Category One {2025 LIDAR}',
                _e[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _e[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2024,
                _e[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://example.com/lidar',
                _e[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                _e[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                _e[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_spring_2024',
                _e[config_1.default.EXTENT_FIELDS.Year_Collected] = '2024',
                _e[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _e[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _e),
        },
        {
            geometry: { type: 'polygon' },
            attributes: (_f = {},
                _f[config_1.default.EXTENT_FIELDS.OBJECTID] = 2,
                _f[config_1.default.EXTENT_FIELDS.Product] = 'Lidar Spring 2023',
                _f[config_1.default.EXTENT_FIELDS.Category] = 'Category One {2025 LIDAR}',
                _f[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _f[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2023,
                _f[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://example.com/lidar',
                _f[config_1.default.EXTENT_FIELDS.In_House] = 'Yes',
                _f[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                _f[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_spring_2023',
                _f[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _f[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _f),
        },
    ],
    'Category Two {2022 LIDAR}': [
        {
            geometry: { type: 'polygon' },
            attributes: (_g = {},
                _g[config_1.default.EXTENT_FIELDS.OBJECTID] = 3,
                _g[config_1.default.EXTENT_FIELDS.Product] = 'Lidar Summer 2022',
                _g[config_1.default.EXTENT_FIELDS.Category] = 'Category Two {2022 LIDAR}',
                _g[config_1.default.EXTENT_FIELDS.Description] = '1 Meter False Color Infrared Digital Orthophotography from 2006 NAIP (county mosaics)',
                _g[config_1.default.EXTENT_FIELDS.Estimated_Date] = 2022,
                _g[config_1.default.EXTENT_FIELDS.HTML_Page] = 'https://example.com/lidar-summer',
                _g[config_1.default.EXTENT_FIELDS.In_House] = 'No',
                _g[config_1.default.EXTENT_FIELDS.SHOW] = 'Y',
                _g[config_1.default.EXTENT_FIELDS.ServiceName] = 'lidar_summer_2022',
                _g[config_1.default.EXTENT_FIELDS.Year_Collected] = '2022',
                _g[config_1.default.EXTENT_FIELDS.Tile_Index] = '',
                _g[config_1.default.EXTENT_FIELDS.FTP_Path] = '',
                _g),
        },
    ],
};
exports.LidarWithYearCollected = {
    args: {
        productType: 'lidar',
        searchFn: function () { return Promise.resolve(groupedLidarResults); },
    },
    render: function (args) { return <ProductTypeStoryWrapper {...args}/>; },
};
