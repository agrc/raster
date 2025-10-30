import { queryFeatures, type IQueryFeaturesResponse } from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { ProductTypeKey } from '../types';

export default async function getMoreInfo(productType: ProductTypeKey, objectId: number) {
  // security check
  if (!Number.isFinite(objectId)) {
    throw new Error('Invalid objectId');
  }

  const response = (await queryFeatures({
    url: config.EXTENT_SERVICE_URLS[productType],
    where: `${config.EXTENT_FIELDS.OBJECTID} = ${objectId}`,
    outFields: Object.keys(config.MORE_INFO_FIELD_INFOS[productType] || {}),
    returnGeometry: false,
  })) as IQueryFeaturesResponse;

  if (response.features.length === 0) {
    throw new Error('No more info found');
  }

  return response.features[0]!.attributes!;
}
