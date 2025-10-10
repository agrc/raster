import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import type { ProductTypeKey } from './types';

type Config = {
  DEFAULT_EXTENT_EXPAND: number;
  MIN_DESKTOP_WIDTH: number;
  PRODUCT_TYPES: Record<ProductTypeKey, string>;
  PRODUCT_TYPE_DESCRIPTIONS: Record<ProductTypeKey, string>;
  SYMBOLS: {
    POINT: PictureMarkerSymbol;
    LINE: SimpleLineSymbol;
  };
};

const config: Config = {
  DEFAULT_EXTENT_EXPAND: 1.1,
  MIN_DESKTOP_WIDTH: 768,
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
};

export default config;
