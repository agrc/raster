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

/**
 * Queries for extents without an AOI (used to get all extents matching a category filter)
 */
export async function queryExtentsByCategoryFilter(
  productType: ProductTypeKey,
  categoryFilter: string | string[],
): Promise<IFeature[]> {
  let whereClause = `upper(${config.EXTENT_FIELDS.SHOW}) = 'Y'`;

  // Add category filter
  if (Array.isArray(categoryFilter)) {
    // Handle catGroup (multiple categories)
    const categoryList = categoryFilter.map((cat) => `'${cat.replace(/'/g, "''")}'`).join(', ');
    whereClause += ` AND ${config.EXTENT_FIELDS.Category} IN (${categoryList})`;
  } else {
    // Handle cat (single category)
    whereClause += ` AND ${config.EXTENT_FIELDS.Category} = '${categoryFilter.replace(/'/g, "''")}'`;
  }

  const commonOptions: Partial<IQueryFeaturesOptions> = {
    orderByFields: `${config.EXTENT_FIELDS.Estimated_Date} DESC`,
    outFields: ['OBJECTID'],
    returnGeometry: true,
    where: whereClause,
  };

  const url = config.EXTENT_SERVICE_URLS[productType];

  const response = (await queryFeatures({
    url,
    ...commonOptions,
  })) as IQueryFeaturesResponse;

  return response.features;
}

export async function query(
  productType: ProductTypeKey,
  aoi: __esri.GeometryUnion,
  categoryFilter?: string | string[] | null,
) {
  let whereClause = `upper(${config.EXTENT_FIELDS.SHOW}) = 'Y'`;

  // Add category filter if provided
  if (categoryFilter) {
    if (Array.isArray(categoryFilter)) {
      // Handle catGroup (multiple categories)
      const categoryList = categoryFilter.map((cat) => `'${cat.replace(/'/g, "''")}'`).join(', ');
      whereClause += ` AND ${config.EXTENT_FIELDS.Category} IN (${categoryList})`;
    } else {
      // Handle cat (single category)
      whereClause += ` AND ${config.EXTENT_FIELDS.Category} = '${categoryFilter.replace(/'/g, "''")}'`;
    }
  }

  const commonOptions: Partial<IQueryFeaturesOptions> = {
    geometry: aoi.toJSON(),
    geometryType: getJsonType(aoi) as GeometryType,
    orderByFields: `${config.EXTENT_FIELDS.Estimated_Date} DESC`,
    outFields: Object.values(config.EXTENT_FIELDS),
    returnGeometry: true,
    where: whereClause,
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

export default async function search(
  productType: ProductTypeKey,
  aoi: __esri.GeometryUnion,
  categoryFilter?: string | string[] | null,
) {
  const results = await query(productType, aoi, categoryFilter);

  return groupByCategory(results);
}
