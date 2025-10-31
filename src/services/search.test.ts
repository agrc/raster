import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@arcgis/core/geometry/support/jsonUtils', () => ({
  getJsonType: vi.fn(),
}));

vi.mock('@esri/arcgis-rest-feature-service', () => ({
  queryFeatures: vi.fn(),
}));

import { getJsonType } from '@arcgis/core/geometry/support/jsonUtils';
import { queryFeatures, type IFeature } from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { ProductTypeKey } from '../types';
import { groupByCategory, query } from './search';

describe('groupByCategory', () => {
  const createFeature = (category: string, extraAttributes: Record<string, unknown> = {}) => {
    return {
      attributes: {
        [config.EXTENT_FIELDS.Category]: category,
        ...extraAttributes,
      },
    } as unknown as IFeature;
  };

  it('groups features by their category field', () => {
    const features: IFeature[] = [
      createFeature('A', { id: 1 }),
      createFeature('B', { id: 2 }),
      createFeature('A', { id: 3 }),
    ];

    const grouped = groupByCategory(features);

    expect(grouped).toEqual({
      A: [features[0], features[2]],
      B: [features[1]],
    });
  });

  it('returns an empty object when no features are provided', () => {
    expect(groupByCategory([])).toEqual({});
  });
});

describe('query', () => {
  const mockedGetJsonType = vi.mocked(getJsonType);
  const mockedQueryFeatures = vi.mocked(queryFeatures);

  const geometryJson = { type: 'polygon', rings: [] };
  const geometry = {
    toJSON: vi.fn(() => geometryJson),
  } as unknown as __esri.GeometryUnion;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetJsonType.mockReturnValue('esriGeometryPolygon' as never);
  });

  const expectSharedOptions = (productType: ProductTypeKey, expectedOutFields: string[]) => {
    expect(mockedQueryFeatures).toHaveBeenCalledWith({
      url: config.EXTENT_SERVICE_URLS[productType],
      geometry: geometryJson,
      geometryType: 'esriGeometryPolygon',
      orderByFields: `${config.EXTENT_FIELDS.Estimated_Date} DESC`,
      outFields: expectedOutFields,
      returnGeometry: true,
      where: `lower(${config.EXTENT_FIELDS.SHOW}) = 'y'`,
    });
  };

  it('queries with all extent fields for services that include metadata', async () => {
    const productType: ProductTypeKey = 'lidar';
    const features = [{ attributes: {} } as unknown as IFeature];
    mockedQueryFeatures.mockResolvedValue({ features } as never);

    const result = await query(productType, geometry);

    expect(result).toBe(features);
    expectSharedOptions(productType, Object.values(config.EXTENT_FIELDS));
    expect(mockedGetJsonType).toHaveBeenCalledWith(geometry);
    expect(geometry.toJSON).toHaveBeenCalledTimes(1);
  });

  it('filters metadata/report and lidar-only fields for services without them', async () => {
    const productType: ProductTypeKey = 'contours';
    const features = [{ attributes: { name: 'contour-1' } } as unknown as IFeature];
    mockedQueryFeatures.mockResolvedValue({ features } as never);

    const result = await query(productType, geometry);

    const expectedOutFields = Object.values(config.EXTENT_FIELDS)
      .filter((field) => !['METADATA', 'REPORT'].includes(field))
      // "Year_Collected" is only requested for lidar product type
      .filter((field) => field !== 'Year_Collected');

    expect(result).toBe(features);
    expectSharedOptions(productType, expectedOutFields);
    expect(mockedGetJsonType).toHaveBeenCalledWith(geometry);
    expect(geometry.toJSON).toHaveBeenCalledTimes(1);
  });
});
