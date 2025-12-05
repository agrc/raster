import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@arcgis/core/geometry/support/jsonUtils', () => ({
  getJsonType: vi.fn(),
}));

vi.mock('@esri/arcgis-rest-feature-service', () => ({
  queryFeatures: vi.fn(),
}));

import { getJsonType } from '@arcgis/core/geometry/support/jsonUtils';
import { queryFeatures } from '@esri/arcgis-rest-feature-service';
import type { IPolygon } from '@esri/arcgis-rest-request';
import config from '../config';
import type { ProductTypeKey, TileFeature } from '../types';
import getTiles from './tiles';

describe('getTiles', () => {
  const mockedGetJsonType = vi.mocked(getJsonType);
  const mockedQueryFeatures = vi.mocked(queryFeatures);

  const geometryJson = { rings: [] };
  const geometry = {
    toJSON: vi.fn(() => geometryJson),
  } as unknown as __esri.GeometryUnion;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetJsonType.mockReturnValue('esriGeometryPolygon' as never);
  });

  const createMockGeometry = (): IPolygon => ({
    rings: [
      [
        [0, 0],
        [1, 1],
      ],
    ],
  });

  it('returns tiles for a valid product type and tile index', async () => {
    const productType: ProductTypeKey = 'lidar';
    const tileIndex = 'index-123';
    const features: TileFeature[] = [
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 1,
          [config.INDEX_FIELDS.TILE]: 12345,
          [config.INDEX_FIELDS.PATH]: 111,
          [config.INDEX_FIELDS.SIZE]: 100,
          [config.INDEX_FIELDS.EXT]: 1,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: createMockGeometry(),
      },
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 2,
          [config.INDEX_FIELDS.TILE]: 12346,
          [config.INDEX_FIELDS.PATH]: 112,
          [config.INDEX_FIELDS.SIZE]: 120,
          [config.INDEX_FIELDS.EXT]: 1,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: createMockGeometry(),
      },
    ];

    mockedQueryFeatures.mockResolvedValue({ features, exceededTransferLimit: false } as never);

    const result = await getTiles(productType, tileIndex, geometry);

    expect(result.features).toEqual(features);
    expect(result.features).toHaveLength(2);
    expect(mockedQueryFeatures).toHaveBeenCalledTimes(1);
    expect(mockedQueryFeatures).toHaveBeenCalledWith(
      expect.objectContaining({
        url: config.INDEX_SERVICE_URLS[productType],
        where: `${config.INDEX_FIELDS.TILE_INDEX} = '${tileIndex}'`,
        outFields: Object.values(config.INDEX_FIELDS),
        geometry: geometryJson,
        geometryType: 'esriGeometryPolygon',
        returnGeometry: true,
        orderByFields: `${config.INDEX_FIELDS.OBJECTID} ASC`,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('throws an error when no tiles are found', async () => {
    const productType: ProductTypeKey = 'aerialPhotography';
    const tileIndex = 'nonexistent-index';

    mockedQueryFeatures.mockResolvedValue({ features: [], exceededTransferLimit: false } as never);

    await expect(getTiles(productType, tileIndex, geometry)).rejects.toThrow(
      `No tiles found for productType "${productType}" and tileIndex "${tileIndex}"`,
    );

    expect(mockedQueryFeatures).toHaveBeenCalledTimes(1);
  });

  it('handles pagination when exceededTransferLimit is true', async () => {
    const productType: ProductTypeKey = 'contours';
    const tileIndex = 'large-index';

    const firstBatch: TileFeature[] = [
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 1,
          [config.INDEX_FIELDS.TILE]: 100,
          [config.INDEX_FIELDS.PATH]: 200,
          [config.INDEX_FIELDS.SIZE]: 50,
          [config.INDEX_FIELDS.EXT]: 1,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: createMockGeometry(),
      },
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 2,
          [config.INDEX_FIELDS.TILE]: 101,
          [config.INDEX_FIELDS.PATH]: 201,
          [config.INDEX_FIELDS.SIZE]: 55,
          [config.INDEX_FIELDS.EXT]: 1,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: createMockGeometry(),
      },
    ];

    const secondBatch: TileFeature[] = [
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 3,
          [config.INDEX_FIELDS.TILE]: 102,
          [config.INDEX_FIELDS.PATH]: 202,
          [config.INDEX_FIELDS.SIZE]: 60,
          [config.INDEX_FIELDS.EXT]: 1,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: createMockGeometry(),
      },
    ];

    // First call returns exceeded limit
    mockedQueryFeatures.mockResolvedValueOnce({
      features: firstBatch,
      exceededTransferLimit: true,
    } as never);

    // Second call returns remaining results
    mockedQueryFeatures.mockResolvedValueOnce({
      features: secondBatch,
      exceededTransferLimit: false,
    } as never);

    const result = await getTiles(productType, tileIndex, geometry);

    expect(result.features).toHaveLength(3);
    expect(result.features).toEqual([...firstBatch, ...secondBatch]);
    expect(mockedQueryFeatures).toHaveBeenCalledTimes(2);

    // Check second call includes resultOffset
    expect(mockedQueryFeatures).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: config.INDEX_SERVICE_URLS[productType],
        where: `${config.INDEX_FIELDS.TILE_INDEX} = '${tileIndex}'`,
        outFields: Object.values(config.INDEX_FIELDS),
        geometry: geometryJson,
        geometryType: 'esriGeometryPolygon',
        returnGeometry: true,
        orderByFields: `${config.INDEX_FIELDS.OBJECTID} ASC`,
        resultOffset: 2,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('handles multiple pagination cycles', async () => {
    const productType: ProductTypeKey = 'usgsDem';
    const tileIndex = 'very-large-index';

    const createTileFeature = (id: number): TileFeature => ({
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: id,
        [config.INDEX_FIELDS.TILE]: id * 10,
        [config.INDEX_FIELDS.PATH]: id * 100,
        [config.INDEX_FIELDS.SIZE]: 50,
        [config.INDEX_FIELDS.EXT]: 1,
        [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
      },
      geometry: createMockGeometry(),
    });

    // Three batches of results
    mockedQueryFeatures.mockResolvedValueOnce({
      features: [createTileFeature(1), createTileFeature(2)],
      exceededTransferLimit: true,
    } as never);

    mockedQueryFeatures.mockResolvedValueOnce({
      features: [createTileFeature(3), createTileFeature(4)],
      exceededTransferLimit: true,
    } as never);

    mockedQueryFeatures.mockResolvedValueOnce({
      features: [createTileFeature(5)],
      exceededTransferLimit: false,
    } as never);

    const result = await getTiles(productType, tileIndex, geometry);

    expect(result.features).toHaveLength(5);
    expect(mockedQueryFeatures).toHaveBeenCalledTimes(3);

    // Verify offsets for paginated calls
    expect(mockedQueryFeatures).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        resultOffset: 2,
        signal: expect.any(AbortSignal),
      }),
    );
    expect(mockedQueryFeatures).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        resultOffset: 4,
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('uses correct URL for different product types', async () => {
    const tileIndex = 'test-index';
    const mockFeature: TileFeature = {
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: 1,
        [config.INDEX_FIELDS.TILE]: 100,
        [config.INDEX_FIELDS.PATH]: 200,
        [config.INDEX_FIELDS.SIZE]: 50,
        [config.INDEX_FIELDS.EXT]: 1,
        [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
      },
      geometry: createMockGeometry(),
    };

    mockedQueryFeatures.mockResolvedValue({
      features: [mockFeature],
      exceededTransferLimit: false,
    } as never);

    const productTypes: ProductTypeKey[] = ['aerialPhotography', 'lidar', 'contours', 'usgsDem', 'autoDem', 'drg'];

    for (const productType of productTypes) {
      await getTiles(productType, tileIndex, geometry);

      expect(mockedQueryFeatures).toHaveBeenCalledWith(
        expect.objectContaining({
          url: config.INDEX_SERVICE_URLS[productType],
        }),
      );

      mockedQueryFeatures.mockClear();
    }
  });

  it('constructs where clause with tile index', async () => {
    const productType: ProductTypeKey = 'drg';
    const tileIndex = 'special-index-456';
    const mockFeature: TileFeature = {
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: 1,
        [config.INDEX_FIELDS.TILE]: 100,
        [config.INDEX_FIELDS.PATH]: 200,
        [config.INDEX_FIELDS.SIZE]: 50,
        [config.INDEX_FIELDS.EXT]: 1,
        [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
      },
      geometry: createMockGeometry(),
    };

    mockedQueryFeatures.mockResolvedValue({
      features: [mockFeature],
      exceededTransferLimit: false,
    } as never);

    await getTiles(productType, tileIndex, geometry);

    expect(mockedQueryFeatures).toHaveBeenCalledWith(
      expect.objectContaining({
        where: `${config.INDEX_FIELDS.TILE_INDEX} = '${tileIndex}'`,
      }),
    );
  });

  it('requests all INDEX_FIELDS as outFields', async () => {
    const productType: ProductTypeKey = 'autoDem';
    const tileIndex = 'index-789';
    const mockFeature: TileFeature = {
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: 1,
        [config.INDEX_FIELDS.TILE]: 100,
        [config.INDEX_FIELDS.PATH]: 200,
        [config.INDEX_FIELDS.SIZE]: 50,
        [config.INDEX_FIELDS.EXT]: 1,
        [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
      },
      geometry: createMockGeometry(),
    };

    mockedQueryFeatures.mockResolvedValue({
      features: [mockFeature],
      exceededTransferLimit: false,
    } as never);

    await getTiles(productType, tileIndex, geometry);

    expect(mockedQueryFeatures).toHaveBeenCalledWith(
      expect.objectContaining({
        outFields: Object.values(config.INDEX_FIELDS),
      }),
    );
  });

  it('orders results by OBJECTID ascending', async () => {
    const productType: ProductTypeKey = 'lidar';
    const tileIndex = 'index-order';
    const mockFeature: TileFeature = {
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: 1,
        [config.INDEX_FIELDS.TILE]: 100,
        [config.INDEX_FIELDS.PATH]: 200,
        [config.INDEX_FIELDS.SIZE]: 50,
        [config.INDEX_FIELDS.EXT]: 1,
        [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
      },
      geometry: createMockGeometry(),
    };

    mockedQueryFeatures.mockResolvedValue({
      features: [mockFeature],
      exceededTransferLimit: false,
    } as never);

    await getTiles(productType, tileIndex, geometry);

    expect(mockedQueryFeatures).toHaveBeenCalledWith(
      expect.objectContaining({
        orderByFields: `${config.INDEX_FIELDS.OBJECTID} ASC`,
      }),
    );
  });

  it('calls geometry.toJSON and getJsonType correctly', async () => {
    const productType: ProductTypeKey = 'lidar';
    const tileIndex = 'index-geometry';
    const mockFeature: TileFeature = {
      attributes: {
        [config.INDEX_FIELDS.OBJECTID]: 1,
        [config.INDEX_FIELDS.TILE]: 100,
        [config.INDEX_FIELDS.PATH]: 200,
        [config.INDEX_FIELDS.SIZE]: 50,
        [config.INDEX_FIELDS.EXT]: 1,
        [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
      },
      geometry: createMockGeometry(),
    };

    mockedQueryFeatures.mockResolvedValue({
      features: [mockFeature],
      exceededTransferLimit: false,
    } as never);

    await getTiles(productType, tileIndex, geometry);

    expect(geometry.toJSON).toHaveBeenCalledTimes(1);
    expect(mockedGetJsonType).toHaveBeenCalledWith(geometry);
    expect(mockedQueryFeatures).toHaveBeenCalledWith(
      expect.objectContaining({
        geometry: geometryJson,
        geometryType: 'esriGeometryPolygon',
      }),
    );
  });
});
