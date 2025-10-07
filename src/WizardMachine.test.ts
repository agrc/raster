import { describe, expect, it } from 'vitest';
import { toggleProductType } from './WizardMachine';
import type { ProductTypeKey } from './types';

describe('toggleProductType', () => {
  it('adds a product type when it is not in the list', () => {
    const currentTypes: ProductTypeKey[] = ['aerialPhotography', 'lidar'];
    const result = toggleProductType(currentTypes, 'usgsDem');

    expect(result).toEqual(['aerialPhotography', 'lidar', 'usgsDem']);
    // Verify original array is not mutated
    expect(currentTypes).toEqual(['aerialPhotography', 'lidar']);
  });

  it('removes a product type when it is already in the list', () => {
    const currentTypes: ProductTypeKey[] = ['aerialPhotography', 'lidar', 'usgsDem'];
    const result = toggleProductType(currentTypes, 'lidar');

    expect(result).toEqual(['aerialPhotography', 'usgsDem']);
    // Verify original array is not mutated
    expect(currentTypes).toEqual(['aerialPhotography', 'lidar', 'usgsDem']);
  });

  it('adds a product type to an empty list', () => {
    const currentTypes: ProductTypeKey[] = [];
    const result = toggleProductType(currentTypes, 'contours');

    expect(result).toEqual(['contours']);
    expect(currentTypes).toEqual([]);
  });

  it('removes the only product type from a list with one item', () => {
    const currentTypes: ProductTypeKey[] = ['drg'];
    const result = toggleProductType(currentTypes, 'drg');

    expect(result).toEqual([]);
    expect(currentTypes).toEqual(['drg']);
  });
});
