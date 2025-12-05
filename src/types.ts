import type { IPolygon } from '@esri/arcgis-rest-request';
import config from './config';

export type ProductTypeKey = 'aerialPhotography' | 'lidar' | 'usgsDem' | 'autoDem' | 'contours' | 'drg';

export type TileFeature = {
  attributes: {
    [config.INDEX_FIELDS.OBJECTID]: number;
    [config.INDEX_FIELDS.EXT]: number;
    [config.INDEX_FIELDS.PATH]: number;
    [config.INDEX_FIELDS.SIZE]: number;
    [config.INDEX_FIELDS.TILE]: number;
    [config.INDEX_FIELDS.TILE_INDEX]: string;
  };
  geometry: IPolygon;
};
