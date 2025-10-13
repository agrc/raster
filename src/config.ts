import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import type { ProductTypeKey } from './types';

export const EXTENT_FIELDS = {
  OBJECTID: 'OBJECTID',
  Product: 'Product',
  Category: 'Category',
  Estimated_Date: 'Estimated_Date',
  REST_Endpoint: 'REST_Endpoint',
  ServiceName: 'ServiceName',
  HTML_Page: 'HTML_Page',
  In_House: 'In_House',
  SHOW: 'SHOW',
  Description: 'Description',

  // these fields only show up in: autoDem, lidar, usgsDem
  METADATA: 'METADATA',
  REPORT: 'REPORT',
} as const;

type Config = {
  DEFAULT_EXTENT_EXPAND: number;
  MIN_DESKTOP_WIDTH: number;
  PRODUCT_TYPES: Record<ProductTypeKey, string>;
  PRODUCT_TYPE_DESCRIPTIONS: Record<ProductTypeKey, string>;
  SYMBOLS: {
    POINT: PictureMarkerSymbol;
    LINE: SimpleLineSymbol;
  };
  MAP_ELEMENT_ID: string;
  EXTENT_SERVICE_URLS: Record<ProductTypeKey, `https://${string}`>;
  EXTENT_FIELDS: typeof EXTENT_FIELDS;
};

const config: Config = {
  DEFAULT_EXTENT_EXPAND: 1.1,
  MIN_DESKTOP_WIDTH: 768,
  MAP_ELEMENT_ID: 'map',
  PRODUCT_TYPES: {
    aerialPhotography: 'Aerial Photography',
    lidar: 'LiDAR DEMs',
    usgsDem: 'USGS DEMs',
    autoDem: 'Auto-Correlated DEMs',
    contours: 'Contours',
    drg: 'USGS Topo Maps',
  },
  PRODUCT_TYPE_DESCRIPTIONS: {
    aerialPhotography: 'Digital aerial photography',
    lidar: 'Digital elevation models derived from LiDAR',
    usgsDem: 'U.S. Geological Survey digital elevation models from The National Map',
    autoDem: 'Digital elevation models derived through an auto-correlation process from aerial photography',
    contours: 'Contour lines created at various intervals from Lidar and other sources',
    drg: 'U.S. Geological Survey topographic maps',
  },
  SYMBOLS: {
    POINT: new PictureMarkerSymbol({
      url: '/assets/esri/images/search/search-symbol-32.png',
      height: 24,
      width: 24,
    }),
    LINE: new SimpleLineSymbol({
      color: 'black',
      width: 2,
    }),
  },
  EXTENT_SERVICE_URLS: {
    aerialPhotography:
      'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Aerial_Photography_Extents/FeatureServer/0',
    lidar: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/LiDAR_Extents/FeatureServer/0',
    usgsDem: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/USGS_DEM_Extents/FeatureServer/0',
    autoDem:
      'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/AutoCorrelated_DEM_Extents/FeatureServer/0',
    contours: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Contour_Line_Extents/FeatureServer/0',
    drg: 'https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/DRG_Extents/FeatureServer/0',
  },
  EXTENT_FIELDS,
} as const;

export default config;
