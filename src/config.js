"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INDEX_FIELDS = exports.EXTENT_FIELDS = void 0;
var PictureMarkerSymbol_1 = require("@arcgis/core/symbols/PictureMarkerSymbol");
var SimpleFillSymbol_1 = require("@arcgis/core/symbols/SimpleFillSymbol");
var SimpleLineSymbol_1 = require("@arcgis/core/symbols/SimpleLineSymbol");
var resolveConfig_1 = require("tailwindcss/resolveConfig");
var tailwind_config_js_1 = require("../tailwind.config.js");
var fullConfig = (0, resolveConfig_1.default)(tailwind_config_js_1.default);
var demMoreInfoFieldInfos = {
    File_Format: 'File Format',
    File_Extension: 'File Extension',
    Average_File_Size: 'Average File Size',
    Horizontal_Accuracy: 'Horizontal Accuracy',
    Vertical_Accuracy: 'Vertical Accuracy',
    Contact: 'Contact',
    In_House: 'Stored at UGRC?',
    FTP_Path: 'Storage Path',
    HTML_Page: 'Web Page',
};
exports.EXTENT_FIELDS = {
    OBJECTID: 'OBJECTID',
    Product: 'Product',
    Category: 'Category',
    Estimated_Date: 'Estimated_Date',
    ServiceName: 'ServiceName',
    HTML_Page: 'HTML_Page',
    In_House: 'In_House',
    SHOW: 'SHOW',
    Description: 'Description',
    Tile_Index: 'Tile_Index',
    FTP_Path: 'FTP_Path',
    // these fields only show up in: autoDem, lidar, usgsDem
    METADATA: 'METADATA',
    REPORT: 'REPORT',
    // this field only show up in: lidar
    Year_Collected: 'Year_Collected',
};
exports.INDEX_FIELDS = {
    OBJECTID: 'OBJECTID',
    EXT: 'EXT',
    PATH: 'PATH',
    SIZE: 'SIZE',
    TILE: 'TILE',
    TILE_INDEX: 'TILE_INDEX',
};
var config = {
    DEFAULT_EXTENT_EXPAND: 1.1,
    MIN_DESKTOP_WIDTH: 768,
    MAP_ELEMENT_ID: 'map',
    PRODUCT_TYPES: {
        aerialPhotography: 'Aerial Photography',
        lidar: 'Lidar DEMs',
        usgsDem: 'USGS DEMs',
        autoDem: 'Auto-Correlated DEMs',
        contours: 'Contours',
        drg: 'USGS Topo Maps',
    },
    PRODUCT_TYPE_DESCRIPTIONS: {
        aerialPhotography: 'Digital aerial photography',
        lidar: 'Digital elevation models derived from Lidar',
        usgsDem: 'U.S. Geological Survey digital elevation models from The National Map',
        autoDem: 'Digital elevation models derived through an auto-correlation process from aerial photography',
        contours: 'Contour lines created at various intervals from Lidar and other sources',
        drg: 'U.S. Geological Survey topographic maps',
    },
    DRAWING_SYMBOLS: {
        POINT: new PictureMarkerSymbol_1.default({
            url: '/assets/esri/images/search/search-symbol-32.png',
            height: 24,
            width: 24,
        }),
        LINE: new SimpleLineSymbol_1.default({
            color: 'black',
            width: 2,
        }),
    },
    RESULT_SYMBOL: new SimpleFillSymbol_1.default({
        style: 'none',
        outline: {
            // @ts-expect-error this is a custom color
            color: fullConfig.theme.colors.accent[500],
            width: 3,
        },
    }),
    TILE_SYMBOL: new SimpleFillSymbol_1.default({
        style: 'solid',
        color: 'transparent',
        outline: {
            // @ts-expect-error this is a custom color
            color: fullConfig.theme.colors.primary[500],
            width: 2,
        },
    }),
    EXTENT_SERVICE_URLS: {
        aerialPhotography: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Aerial_Photography_Extents/FeatureServer/0',
        lidar: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/LiDAR_Extents/FeatureServer/0',
        usgsDem: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/USGS_DEM_Extents/FeatureServer/0',
        autoDem: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/AutoCorrelated_DEM_Extents/FeatureServer/0',
        contours: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Contour_Line_Extents/FeatureServer/0',
        drg: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/DRG_Extents/FeatureServer/0',
    },
    INDEX_SERVICE_URLS: {
        aerialPhotography: 'https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Aerial_Photography/FeatureServer/0',
        lidar: 'https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Lidar/FeatureServer/0',
        usgsDem: 'https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/USGS_DEMs_gdb/FeatureServer/0',
        autoDem: 'https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/AutoCorrelated_DEMs_gdb/FeatureServer/0',
        contours: 'https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Contours/FeatureServer/0',
        drg: 'https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/DRGs/FeatureServer/0',
    },
    EXTENT_FIELDS: exports.EXTENT_FIELDS,
    INDEX_FIELDS: exports.INDEX_FIELDS,
    MORE_INFO_FIELD_INFOS: {
        aerialPhotography: {
            Resolution: 'Resolution',
            Year_Collected: 'Year Collected',
            File_Format: 'File Format',
            Average_File_Size: 'Average File Size',
            Horizontal_Accuracy: 'Horizontal Accuracy',
            FlightDate_Location: 'Flight Date Location',
            Contact: 'Contact',
            In_House: 'Stored at UGRC?',
            FTP_Path: 'Storage Path',
            HTML_Page: 'Web Page',
        },
        lidar: {
            Year_Collected: 'Year Collected',
            File_Format: 'File Format',
            File_Extension: 'File Extension',
            Average_File_Size: 'Average File Size',
            Horizontal_Accuracy: 'Horizontal Accuracy',
            Vertical_Accuracy: 'Vertical Accuracy',
            Contact: 'Contact',
            In_House: 'Stored at UGRC?',
            FTP_Path: 'Storage Path',
            HTML_Page: 'Web Page',
        },
        usgsDem: demMoreInfoFieldInfos,
        autoDem: demMoreInfoFieldInfos,
        contours: {
            Year_Collected: 'Year Collected',
            Contact: 'Contact',
            In_House: 'Stored at UGRC?',
            FTP_Path: 'Storage Path',
            HTML_Page: 'Web Page',
        },
        drg: {
            File_Format: 'File Format',
            Average_File_Size: 'Average File Size',
            Horizontal_Accuracy: 'Horizontal Accuracy',
            Contact: 'Contact',
            In_House: 'Stored at UGRC?',
            FTP_Path: 'Storage Path',
            HTML_Page: 'Web Page',
        },
    },
    DISCOVER_URL: 'https://discover.agrc.utah.gov/login/path/<quadWord>/tiles/<serviceName>/{level}/{col}/{row}',
    PRODUCT_SORT_ORDER: {
        aerialPhotography: ['rgb', 'cir', 'single', 'b&w'],
        lidar: ['bare', 'first'],
    },
};
exports.default = config;
