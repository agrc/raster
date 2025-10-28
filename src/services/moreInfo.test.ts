import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@esri/arcgis-rest-feature-service', () => ({
  queryFeatures: vi.fn(),
}));

import { queryFeatures } from '@esri/arcgis-rest-feature-service';
import config from '../config';
import type { ProductTypeKey } from '../types';
import getMoreInfo from './moreInfo';

describe('getMoreInfo', () => {
  const mockedQueryFeatures = vi.mocked(queryFeatures);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws for invalid objectId', async () => {
    await expect(getMoreInfo('lidar', Number.NaN)).rejects.toThrow('Invalid objectId');
    await expect(getMoreInfo('lidar', Number.POSITIVE_INFINITY)).rejects.toThrow('Invalid objectId');
    await expect(getMoreInfo('lidar', Number.NEGATIVE_INFINITY)).rejects.toThrow('Invalid objectId');
  });

  it('queries with correct options and returns attributes', async () => {
    const productType: ProductTypeKey = 'lidar';
    const objectId = 123;
    const attributes = { Foo: 'Bar', Baz: 42 };

    mockedQueryFeatures.mockResolvedValue({
      features: [
        {
          attributes,
        },
      ],
    } as never);

    const result = await getMoreInfo(productType, objectId);

    expect(result).toEqual(attributes);
    expect(mockedQueryFeatures).toHaveBeenCalledTimes(1);
    expect(mockedQueryFeatures).toHaveBeenCalledWith({
      url: config.EXTENT_SERVICE_URLS[productType],
      where: `${config.EXTENT_FIELDS.OBJECTID} = ${objectId}`,
      outFields: Object.keys(config.MORE_INFO_FIELD_INFOS[productType] || {}),
      returnGeometry: false,
    });
  });

  it('throws when no features are returned', async () => {
    const productType: ProductTypeKey = 'aerialPhotography';
    const objectId = 9999;

    mockedQueryFeatures.mockResolvedValue({ features: [] } as never);

    await expect(getMoreInfo(productType, objectId)).rejects.toThrow('No more info found');

    expect(mockedQueryFeatures).toHaveBeenCalledWith({
      url: config.EXTENT_SERVICE_URLS[productType],
      where: `${config.EXTENT_FIELDS.OBJECTID} = ${objectId}`,
      outFields: Object.keys(config.MORE_INFO_FIELD_INFOS[productType] || {}),
      returnGeometry: false,
    });
  });
});
