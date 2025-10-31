import { beforeEach, describe, expect, it, vi } from 'vitest';

const graphicConstructorSpy = vi.fn();

vi.mock('@arcgis/core/Graphic', () => {
  return {
    default: class {
      attributes: unknown;
      geometry: __esri.Geometry;
      symbol: unknown;

      constructor(options: __esri.GraphicProperties) {
        graphicConstructorSpy(options);
        this.attributes = options.attributes;
        this.geometry = options.geometry as __esri.Geometry;
        this.symbol = options.symbol;
      }
    },
  };
});

vi.mock('@esri/arcgis-rest-feature-service', () => ({
  queryFeatures: vi.fn(),
}));

import { queryFeatures, type IQueryFeaturesResponse, type IQueryResponse } from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { ProductTypeKey } from '../types';
import { getGraphicsAndExtent, getInitialProductTypes, parseUrlParams } from './urlParams';

const mockedQueryFeatures = vi.mocked(queryFeatures);
const setSearch = (search: string) => {
  const url = new URL(window.location.href);
  url.search = search;
  window.history.replaceState({}, '', url.toString());
};

beforeEach(() => {
  vi.clearAllMocks();
  setSearch('');
});

describe('parseUrlParams', () => {
  it('parses title, categories, and products from the URL', () => {
    setSearch(
      '?title=%20Mountain%20Data%20&cat=Contours&catGroup=Elevation%20Models,%20Slope%20Maps&products=0, 2 ,not-a-number, 99',
    );

    const result = parseUrlParams();

    expect(result).toEqual({
      title: 'Mountain Data',
      categories: ['Contours', 'Elevation Models', 'Slope Maps'],
      productTypes: ['aerialPhotography', 'usgsDem'],
    });
  });

  it('returns defaults when no parameters are present', () => {
    const result = parseUrlParams();

    expect(result).toEqual({
      title: undefined,
      categories: [],
      productTypes: [],
    });
  });
});

describe('getInitialProductTypes', () => {
  it('returns product types specified in the URL when categories are absent', async () => {
    setSearch('?products=1,4');

    const result = await getInitialProductTypes();

    expect(result).toEqual(['lidar', 'contours']);
    expect(mockedQueryFeatures).not.toHaveBeenCalled();
  });

  it('includes product types whose categories have available data', async () => {
    setSearch('?cat=Contours&catGroup=Elevation,Slope&products=5');

    const counts: Partial<Record<ProductTypeKey, number>> = {
      lidar: 2,
      contours: 1,
    };

    mockedQueryFeatures.mockImplementation(async (options) => {
      const productType = (Object.entries(config.EXTENT_SERVICE_URLS).find(([, url]) => url === options.url)?.[0] ??
        '') as ProductTypeKey;

      return { count: counts[productType] ?? 0 } as IQueryResponse;
    });

    const result = await getInitialProductTypes();

    expect(result).toEqual(['lidar', 'contours', 'drg']);
    expect(mockedQueryFeatures).toHaveBeenCalledTimes(Object.keys(config.PRODUCT_TYPES).length);

    const expectedWhere = `lower(${config.EXTENT_FIELDS.Category}) in ('contours','elevation','slope') AND upper(${config.EXTENT_FIELDS.SHOW}) = 'Y'`;

    mockedQueryFeatures.mock.calls.forEach(([options]) => {
      expect(options.where).toBe(expectedWhere);
      expect(options.returnCountOnly).toBe(true);
    });
  });
});

describe('getGraphicsAndExtent', () => {
  it('returns graphics and the combined extent for matching features', async () => {
    const combinedExtent = { id: 'combined' } as unknown as __esri.Extent;
    const unionSpy = vi.fn(() => combinedExtent);
    const extentA = {
      id: 'extentA',
      union: unionSpy,
    } as unknown as __esri.Extent;
    const extentB = { id: 'extentB' } as unknown as __esri.Extent;

    const featuresByType: Partial<
      Record<ProductTypeKey, Array<{ attributes: Record<string, unknown>; geometry: Record<string, unknown> }>>
    > = {
      lidar: [
        {
          attributes: { OBJECTID: 1 },
          geometry: { extent: extentA },
        },
        {
          attributes: { OBJECTID: 2 },
          geometry: { extent: extentB },
        },
      ],
    };

    mockedQueryFeatures.mockImplementation(async (options) => {
      const productType = (Object.entries(config.EXTENT_SERVICE_URLS).find(([, url]) => url === options.url)?.[0] ??
        '') as ProductTypeKey;

      return {
        features: (featuresByType[productType] ?? []) as unknown as IQueryFeaturesResponse['features'],
      } as IQueryFeaturesResponse;
    });

    const result = await getGraphicsAndExtent({ categories: ['Contours'], productTypes: [] });

    expect(mockedQueryFeatures).toHaveBeenCalledTimes(Object.keys(config.PRODUCT_TYPES).length);

    const expectedWhere = `lower(${config.EXTENT_FIELDS.Category}) in ('contours') AND upper(${config.EXTENT_FIELDS.SHOW}) = 'Y'`;

    mockedQueryFeatures.mock.calls.forEach(([options]) => {
      expect(options.where).toBe(expectedWhere);
    });

    expect(graphicConstructorSpy).toHaveBeenCalledTimes(2);

    const firstGraphicArgs = graphicConstructorSpy.mock.calls[0]![0]!;
    expect(firstGraphicArgs.symbol).toBe(config.RESULT_SYMBOL);
    expect(firstGraphicArgs.geometry.type).toBe('polygon');
    expect(firstGraphicArgs.geometry.spatialReference).toEqual({ wkid: 3857 });

    expect(result.graphics).toHaveLength(2);
    expect(result.graphics[0]?.attributes).toEqual({ OBJECTID: 1 });
    expect(result.graphics[1]?.attributes).toEqual({ OBJECTID: 2 });
    expect(result.extent).toBe(combinedExtent);
    expect(unionSpy).toHaveBeenCalledWith(extentB);
  });

  it('returns an empty graphics array and null extent when no features are found', async () => {
    mockedQueryFeatures.mockResolvedValue({ features: [] } as IQueryFeaturesResponse);

    const result = await getGraphicsAndExtent({ categories: [], productTypes: [] });

    expect(mockedQueryFeatures).toHaveBeenCalledTimes(0);
    expect(result.graphics).toEqual([]);
    expect(result.extent).toBeNull();
    expect(graphicConstructorSpy).not.toHaveBeenCalled();
  });
});
