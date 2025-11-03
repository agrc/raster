import Graphic from '@arcgis/core/Graphic';
import {
  queryFeatures,
  type IQueryFeaturesOptions,
  type IQueryFeaturesResponse,
  type IQueryResponse,
} from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { ProductTypeKey } from '../types';

export type UrlParams = {
  title?: string;
  categories: string[];
  productTypes: ProductTypeKey[];
};

/**
 * Parses URL search parameters and returns structured data
 */
export function parseUrlParams(): UrlParams {
  const searchParams = new URLSearchParams(window.location.search);

  const title = searchParams.get('title')?.trim();

  const cat = searchParams.get('cat')?.trim();

  // Parse catGroup as comma-separated list
  const catGroupParam = searchParams.get('catGroup');
  const catGroup = catGroupParam ? catGroupParam.split(',').map((s) => s.trim()) : null;

  const categories: string[] = [];

  if (cat) {
    categories.push(cat);
  }

  if (catGroup) {
    categories.push(...catGroup);
  }

  const productsParam = searchParams.get('products');
  const productIndexes = productsParam
    ? productsParam
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n))
    : null;

  const productTypes = productIndexes
    ? productIndexes
        .filter((index) => index in config.PRODUCT_TYPE_INDEX)
        .map((index) => config.PRODUCT_TYPE_INDEX[index]!)
    : [];

  return {
    title,
    categories,
    productTypes,
  };
}

export async function getInitialProductTypes(): Promise<ProductTypeKey[]> {
  const urlParams = parseUrlParams();
  const productTypesFromCategories: ProductTypeKey[] = [];

  if (urlParams.categories.length > 0) {
    await Promise.all(
      Object.keys(config.PRODUCT_TYPES).map(async (pt) => {
        const options: Partial<IQueryFeaturesOptions> = {
          where: `lower(${config.EXTENT_FIELDS.Category}) in ('${urlParams.categories
            .map((c) => c.toLowerCase().replace(/'/g, "''"))
            .join("','")}') AND upper(${config.EXTENT_FIELDS.SHOW}) = 'Y'`,
          returnCountOnly: true,
        };

        const response = (await queryFeatures({
          url: config.EXTENT_SERVICE_URLS[pt as ProductTypeKey],
          ...options,
        })) as IQueryResponse;

        if (response.count && response.count > 0) {
          productTypesFromCategories.push(pt as ProductTypeKey);
        }
      }),
    );
  }

  return Array.from(new Set(productTypesFromCategories.concat(urlParams.productTypes)));
}

export async function getGraphicsAndExtent(urlParams?: UrlParams) {
  const categories = urlParams?.categories || [];
  const graphics: __esri.Graphic[] = [];

  if (categories.length === 0) {
    return { graphics, extent: null };
  }

  await Promise.all(
    Object.keys(config.PRODUCT_TYPES).map(async (pt) => {
      const options: Partial<IQueryFeaturesOptions> = {
        where: `lower(${config.EXTENT_FIELDS.Category}) in ('${categories.map((c) => c.toLowerCase().replace(/'/g, "''")).join("','")}') AND upper(${config.EXTENT_FIELDS.SHOW}) = 'Y'`,
      };

      const response = (await queryFeatures({
        url: config.EXTENT_SERVICE_URLS[pt as ProductTypeKey],
        ...options,
      })) as IQueryFeaturesResponse;

      graphics.push(
        ...response.features.map(
          (f) =>
            new Graphic({
              attributes: f.attributes,
              geometry: {
                type: 'polygon',
                spatialReference: { wkid: 3857 },
                ...f.geometry,
              },
              symbol: config.RESULT_SYMBOL,
            }),
        ),
      );
    }),
  );

  // Calculate the combined extent of all features
  let combinedExtent: __esri.Extent | null = null;
  if (graphics.length > 0) {
    combinedExtent = graphics[0]!.geometry!.extent!;
    for (let i = 1; i < graphics.length; i++) {
      // polygon geometries always have an extent
      combinedExtent = combinedExtent.union(graphics[i]!.geometry!.extent!);
    }
  }

  return { graphics, extent: combinedExtent };
}
