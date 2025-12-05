import type { IFeature } from '@esri/arcgis-rest-request';
import { describe, expect, it } from 'vitest';
import config from '../config';
import { getSort, isUrlLike, isYes, removeCurlyBracesContent } from './utils';

describe('isUrlLike', () => {
  it('returns true for http and https URLs', () => {
    expect(isUrlLike('http://example.com')).toBe(true);
    expect(isUrlLike('https://example.com')).toBe(true);
    expect(isUrlLike(' https://example.com/path ')).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty string', ''],
    ['whitespace string', '   '],
    ['relative url', '/segments/path'],
    ['missing protocol', 'www.example.com'],
    ['unsupported protocol', 'ftp://example.com'],
    ['random text', 'not a url'],
  ])('returns false for %s', (_, value) => {
    expect(isUrlLike(value)).toBe(false);
  });
});

describe('isYes', () => {
  it.each([
    ['uppercase yes', 'YES'],
    ['mixed case yes', 'yEs'],
    ['normal yes', 'Yes'],
    ['leading/trailing whitespace', '  yes  '],
  ])('returns true for %s', (_, value) => {
    expect(isYes(value)).toBe(true);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty string', ''],
    ['whitespace string', '   '],
    ['no', 'NO'],
    ['partial match', 'yes please'],
  ])('returns false for %s', (_, value) => {
    expect(isYes(value)).toBe(false);
  });
});

describe('removeCurlyBraces', () => {
  it.each([
    ['removes single block', 'Test Hello {remove me}', 'Test Hello'],
    ['handles trailing block with space', 'A {x} ', 'A'],
    ['no braces stays same', 'Nothing to change', 'Nothing to change'],
  ])('%s', (_, input, output) => {
    expect(removeCurlyBracesContent(input)).toBe(output);
  });
});

describe('getSort', () => {
  const createFeature = (product: string): IFeature => ({
    attributes: { [config.EXTENT_FIELDS.Product]: product },
  });

  describe('aerialPhotography sort order', () => {
    const sortOrder = config.PRODUCT_SORT_ORDER.aerialPhotography!;

    it('sorts products according to PRODUCT_SORT_ORDER (rgb, cir, single, b&w)', () => {
      const features = [
        createFeature('Image B&W'),
        createFeature('Image RGB'),
        createFeature('Image CIR'),
        createFeature('Image Single'),
      ];

      features.sort(getSort(sortOrder));

      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Image RGB');
      expect(features[1]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Image CIR');
      expect(features[2]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Image Single');
      expect(features[3]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Image B&W');
    });

    it('handles case-insensitive matching for rgb', () => {
      const features = [createFeature('Photo RGB'), createFeature('Photo rgb'), createFeature('Photo RgB')];

      features.sort(getSort(sortOrder));

      // All should be treated as equal priority (rgb)
      expect(features.every((f) => f.attributes[config.EXTENT_FIELDS.Product].toLowerCase().includes('rgb'))).toBe(
        true,
      );
    });

    it('handles case-insensitive matching for cir', () => {
      const features = [createFeature('Photo CIR'), createFeature('Photo cir'), createFeature('Photo CiR')];

      features.sort(getSort(sortOrder));

      expect(features.every((f) => f.attributes[config.EXTENT_FIELDS.Product].toLowerCase().includes('cir'))).toBe(
        true,
      );
    });

    it('maintains relative order when products have same priority', () => {
      const features = [createFeature('RGB Photo A'), createFeature('RGB Photo B'), createFeature('RGB Photo C')];

      features.sort(getSort(sortOrder));

      // All RGB, should maintain relative order
      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toBe('RGB Photo A');
      expect(features[1]!.attributes[config.EXTENT_FIELDS.Product]).toBe('RGB Photo B');
      expect(features[2]!.attributes[config.EXTENT_FIELDS.Product]).toBe('RGB Photo C');
    });

    it('handles partial matches within product names', () => {
      const features = [
        createFeature('2023 Aerial Photography B&W 1-meter'),
        createFeature('2023 Aerial Photography RGB 6-inch'),
        createFeature('2023 Aerial Photography CIR 1-meter'),
      ];

      features.sort(getSort(sortOrder));

      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toContain('RGB');
      expect(features[1]!.attributes[config.EXTENT_FIELDS.Product]).toContain('CIR');
      expect(features[2]!.attributes[config.EXTENT_FIELDS.Product]).toContain('B&W');
    });
  });

  describe('lidar sort order', () => {
    const sortOrder = config.PRODUCT_SORT_ORDER.lidar!;

    it('sorts products according to PRODUCT_SORT_ORDER (bare, first)', () => {
      const features = [createFeature('Lidar First Surface'), createFeature('Lidar Bare Earth')];

      features.sort(getSort(sortOrder));

      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Lidar Bare Earth');
      expect(features[1]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Lidar First Surface');
    });

    it('handles case-insensitive matching for bare', () => {
      const features = [createFeature('DEM BARE'), createFeature('DEM bare'), createFeature('DEM Bare')];

      features.sort(getSort(sortOrder));

      expect(features.every((f) => f.attributes[config.EXTENT_FIELDS.Product].toLowerCase().includes('bare'))).toBe(
        true,
      );
    });

    it('handles case-insensitive matching for first', () => {
      const features = [createFeature('DEM FIRST'), createFeature('DEM first'), createFeature('DEM First')];

      features.sort(getSort(sortOrder));

      expect(features.every((f) => f.attributes[config.EXTENT_FIELDS.Product].toLowerCase().includes('first'))).toBe(
        true,
      );
    });

    it('handles complex product names with partial matches', () => {
      const features = [
        createFeature('2020 Lidar 0.5m First Return DEM'),
        createFeature('2020 Lidar 0.5m Bare Earth DEM'),
        createFeature('2020 Lidar 1m First Return DEM'),
      ];

      features.sort(getSort(sortOrder));

      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toContain('Bare');
      expect(features[1]!.attributes[config.EXTENT_FIELDS.Product]).toContain('First');
      expect(features[2]!.attributes[config.EXTENT_FIELDS.Product]).toContain('First');
    });
  });

  describe('edge cases', () => {
    it('handles products that do not match any sort order keyword', () => {
      const sortOrder = config.PRODUCT_SORT_ORDER.aerialPhotography!;
      const features = [
        createFeature('Unknown Product Z'),
        createFeature('RGB Image'),
        createFeature('Unknown Product A'),
      ];

      features.sort(getSort(sortOrder));

      // RGB should be first (matches at index 0)
      // Unknown products return -1 from findIndex, so they sort after matched items
      // When both are unmatched, they maintain relative order (Z before A)
      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toBe('RGB Image');
      expect(features[1]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Unknown Product Z');
      expect(features[2]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Unknown Product A');
    });

    it('handles empty sort order array', () => {
      const features = [createFeature('Product B'), createFeature('Product A')];

      features.sort(getSort([]));

      // Should maintain original order when no matches
      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Product B');
      expect(features[1]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Product A');
    });

    it('handles single product', () => {
      const sortOrder = config.PRODUCT_SORT_ORDER.aerialPhotography!;
      const features = [createFeature('RGB Photo')];

      features.sort(getSort(sortOrder));

      expect(features[0]!.attributes[config.EXTENT_FIELDS.Product]).toBe('RGB Photo');
    });

    it('handles multiple matches with first match taking precedence', () => {
      const sortOrder = config.PRODUCT_SORT_ORDER.aerialPhotography!;
      // Product that contains both 'rgb' and 'cir'
      const features = [createFeature('RGB or CIR Image'), createFeature('Pure RGB'), createFeature('Pure CIR')];

      features.sort(getSort(sortOrder));

      // 'RGB or CIR Image' should match on 'rgb' first (index 0)
      // 'Pure RGB' should also match on 'rgb' (index 0)
      // 'Pure CIR' should match on 'cir' (index 1)
      expect(features[2]!.attributes[config.EXTENT_FIELDS.Product]).toBe('Pure CIR');
    });
  });
});
