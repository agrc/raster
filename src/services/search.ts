import { getJsonType } from '@arcgis/core/geometry/support/jsonUtils';
import {
  queryFeatures,
  type GeometryType,
  type IFeature,
  type IQueryFeaturesOptions,
  type IQueryFeaturesResponse,
} from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { ProductTypeKey } from '../types';

const typesWithoutMetadataAndReport: ProductTypeKey[] = ['aerialPhotography', 'contours', 'drg'];

export async function query(productType: ProductTypeKey, aoi: __esri.GeometryUnion, urlCategories?: string[]) {
  let where = `lower(${config.EXTENT_FIELDS.SHOW}) = 'y'`;
  if (urlCategories && urlCategories.length > 0) {
    const categoryConditions = urlCategories
      .map((cat) => {
        // Escape single quotes by doubling them
        const safeCat = cat.replace(/'/g, "''");
        return `${config.EXTENT_FIELDS.Category} = '${safeCat}'`;
      })
      .join(' OR ');

    // append category conditions to where clause
    where = `(${where}) AND (${categoryConditions})`;
  }
  const commonOptions: Partial<IQueryFeaturesOptions> = {
    geometry: aoi.toJSON(),
    geometryType: getJsonType(aoi) as GeometryType,
    orderByFields: `${config.EXTENT_FIELDS.Estimated_Date} DESC`,
    outFields: Object.values(config.EXTENT_FIELDS),
    returnGeometry: true,
    where,
  };

  const url = config.EXTENT_SERVICE_URLS[productType];

  if (typesWithoutMetadataAndReport.includes(productType)) {
    // these services don't have these fields
    commonOptions.outFields = (commonOptions.outFields as string[]).filter((field) => {
      return !['METADATA', 'REPORT'].includes(field);
    });
  }

  if (productType !== 'lidar') {
    commonOptions.outFields = (commonOptions.outFields as string[]).filter((field) => {
      return field !== config.EXTENT_FIELDS.Year_Collected;
    });
  }

  const response = (await queryFeatures({
    url,
    ...commonOptions,
  })) as IQueryFeaturesResponse;

  // no need to worry about transfer limit exceeded since there are only a few hundred records at most and the max record count for queries is 2000

  // no need to check for response.error since queryFeatures will throw an error if the request fails

  return response.features;
}

export function groupByCategory(features: IFeature[]) {
  const grouped: Record<string, IFeature[]> = {};

  features.forEach((feature) => {
    const category = feature.attributes[config.EXTENT_FIELDS.Category] as string;

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(feature);
  });

  return grouped;
}

export default async function search(productType: ProductTypeKey, aoi: __esri.GeometryUnion, urlCategories?: string[]) {
  const results = await query(productType, aoi, urlCategories);

  return groupByCategory(results);
}
