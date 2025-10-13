import { getJsonType } from '@arcgis/core/geometry/support/jsonUtils';
import { queryFeatures, type GeometryType, type IQueryFeaturesOptions } from '@esri/arcgis-rest-feature-service';
import config from '../../config';
import type { ProductTypeKey } from '../../types';

export default async function search(productTypes: ProductTypeKey[], aoi: __esri.GeometryUnion) {
  const commonOptions: Partial<IQueryFeaturesOptions> = {
    geometry: aoi.toJSON(),
    geometryType: getJsonType(aoi) as GeometryType,
    orderByFields: `${config.EXTENTS_FIELDS.Estimated_Date} DESC`,
    outFields: Object.values(config.EXTENTS_FIELDS),
    returnGeometry: true,
    where: `upper(${config.EXTENTS_FIELDS.SHOW}) = 'Y'`,
  };

  const promises = productTypes.map(async (type) => {
    const url = config.EXTENT_SERVICE_URLS[type];

    const typesWithoutMetadataAndReport: ProductTypeKey[] = ['aerialPhotography', 'contours', 'drg'];
    if (typesWithoutMetadataAndReport.includes(type)) {
      // these services don't have these fields
      commonOptions.outFields = (commonOptions.outFields as string[]).filter((field) => {
        return !['METADATA', 'REPORT'].includes(field);
      });
    }

    const response = await queryFeatures({
      url,
      ...commonOptions,
    });

    return response;
  });

  const results = await Promise.all(promises);

  return results;
}
