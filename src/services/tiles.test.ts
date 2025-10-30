import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@arcgis/core/geometry/support/jsonUtils', () => ({
  getJsonType: vi.fn(),
}));

vi.mock('@esri/arcgis-rest-feature-service', () => ({
  queryFeatures: vi.fn(),
}));

import { getJsonType } from '@arcgis/core/geometry/support/jsonUtils';
import { queryFeatures } from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { TileFeature } from '../types';
import getTiles from './tiles';

describe('getTiles', () => {
  const mockedGetJsonType = vi.mocked(getJsonType);
  const mockedQueryFeatures = vi.mocked(queryFeatures);

  const geometryJson = { type: 'polygon', rings: [] };
  const geometry = {
    toJSON: vi.fn(() => geometryJson),
  } as unknown as __esri.GeometryUnion;

  const tileIndex = 'test-tile-index';
  const productType = 'aerialPhotography';

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetJsonType.mockReturnValue('esriGeometryPolygon' as never);
  });

  it('queries tiles with correct parameters', async () => {
    const mockFeatures: TileFeature[] = [
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 1,
          [config.INDEX_FIELDS.EXT]: 0,
          [config.INDEX_FIELDS.PATH]: 0,
          [config.INDEX_FIELDS.SIZE]: 1000,
          [config.INDEX_FIELDS.TILE]: 123,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: { rings: [] } as never,
      },
    ];

    mockedQueryFeatures.mockResolvedValue({
      features: mockFeatures,
      exceededTransferLimit: false,
    } as never);

    const result = await getTiles(productType, tileIndex, geometry);

    expect(mockedQueryFeatures).toHaveBeenCalledWith({
      url: config.INDEX_SERVICE_URLS[productType],
      where: `${config.INDEX_FIELDS.TILE_INDEX} = '${tileIndex}'`,
      outFields: Object.values(config.INDEX_FIELDS),
      geometry: geometryJson,
      geometryType: 'esriGeometryPolygon',
      returnGeometry: true,
      orderByFields: `${config.INDEX_FIELDS.OBJECTID} ASC`,
    });

    expect(result.features).toEqual(mockFeatures);
    expect(geometry.toJSON).toHaveBeenCalledTimes(1);
    expect(mockedGetJsonType).toHaveBeenCalledWith(geometry);
  });

  it('throws an error when no tiles are found', async () => {
    mockedQueryFeatures.mockResolvedValue({
      features: [],
      exceededTransferLimit: false,
    } as never);

    await expect(getTiles(productType, tileIndex, geometry)).rejects.toThrow(
      `No tiles found for productType "${productType}" and tileIndex "${tileIndex}"`,
    );
  });

  it('pages through results when transfer limit is exceeded', async () => {
    const firstBatch: TileFeature[] = [
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 1,
          [config.INDEX_FIELDS.EXT]: 0,
          [config.INDEX_FIELDS.PATH]: 0,
          [config.INDEX_FIELDS.SIZE]: 1000,
          [config.INDEX_FIELDS.TILE]: 123,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: { rings: [] } as never,
      },
    ];

    const secondBatch: TileFeature[] = [
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 2,
          [config.INDEX_FIELDS.EXT]: 0,
          [config.INDEX_FIELDS.PATH]: 0,
          [config.INDEX_FIELDS.SIZE]: 2000,
          [config.INDEX_FIELDS.TILE]: 456,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: { rings: [] } as never,
      },
    ];

    const thirdBatch: TileFeature[] = [
      {
        attributes: {
          [config.INDEX_FIELDS.OBJECTID]: 3,
          [config.INDEX_FIELDS.EXT]: 0,
          [config.INDEX_FIELDS.PATH]: 0,
          [config.INDEX_FIELDS.SIZE]: 3000,
          [config.INDEX_FIELDS.TILE]: 789,
          [config.INDEX_FIELDS.TILE_INDEX]: tileIndex,
        },
        geometry: { rings: [] } as never,
      },
    ];

    mockedQueryFeatures
      .mockResolvedValueOnce({
        features: firstBatch,
        exceededTransferLimit: true,
      } as never)
      .mockResolvedValueOnce({
        features: secondBatch,
        exceededTransferLimit: true,
      } as never)
      .mockResolvedValueOnce({
        features: thirdBatch,
        exceededTransferLimit: false,
      } as never);

    const result = await getTiles(productType, tileIndex, geometry);

    expect(mockedQueryFeatures).toHaveBeenCalledTimes(3);

    // Verify second call includes resultOffset
    expect(mockedQueryFeatures).toHaveBeenNthCalledWith(2, expect.objectContaining({ resultOffset: 1 }));

    // Verify third call includes updated resultOffset
    expect(mockedQueryFeatures).toHaveBeenNthCalledWith(3, expect.objectContaining({ resultOffset: 2 }));

    // Verify all features are combined
    expect(result.features).toEqual([...firstBatch, ...secondBatch, ...thirdBatch]);
  });
});
