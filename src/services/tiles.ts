import { getJsonType } from '@arcgis/core/geometry/support/jsonUtils';
import { queryFeatures, type GeometryType, type IQueryFeaturesResponse } from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { ProductTypeKey, TileFeature } from '../types';

export default async function getTiles(productType: ProductTypeKey, tileIndex: string, aoi: __esri.GeometryUnion) {
  const outFields = Object.values(config.INDEX_FIELDS);

  const url = config.INDEX_SERVICE_URLS[productType];
  const where = `${config.INDEX_FIELDS.TILE_INDEX} = '${tileIndex}'`;

  type ResponseType = Omit<IQueryFeaturesResponse, 'features'> & {
    features: TileFeature[];
  };

  const queryParams = {
    url,
    where,
    outFields,
    geometry: aoi.toJSON(),
    geometryType: getJsonType(aoi) as GeometryType,
    returnGeometry: true,
    orderByFields: `${config.INDEX_FIELDS.OBJECTID} ASC`,
    signal: AbortSignal.timeout(config.DEFAULT_REQUEST_TIMEOUT),
  };

  const response = (await queryFeatures(queryParams)) as ResponseType;

  if (response.features.length === 0) {
    throw new Error(`No tiles found for productType "${productType}" and tileIndex "${tileIndex}"`);
  }

  if (response.exceededTransferLimit) {
    // page through results if we hit the transfer limit
    let allFeatures = response.features;
    let resultOffset = response.features.length;
    let exceededTransferLimit: boolean | undefined = response.exceededTransferLimit;

    while (exceededTransferLimit) {
      const nextResponse = (await queryFeatures({
        ...queryParams,
        resultOffset,
      })) as ResponseType;

      allFeatures = [...allFeatures, ...nextResponse.features];
      resultOffset += nextResponse.features.length;
      exceededTransferLimit = nextResponse.exceededTransferLimit;
    }

    response.features = allFeatures;
  }

  return response;
}
