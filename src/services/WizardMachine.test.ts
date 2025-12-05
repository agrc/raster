import { describe, expect, it } from 'vitest';
import { toggleValueInList } from './wizardMachine';

describe('toggleValueInList', () => {
  it('adds a product type when it is not in the list', () => {
    const currentTypes = ['aerialPhotography', 'lidar'];
    const result = toggleValueInList(currentTypes, 'usgsDem');

    expect(result).toEqual(['aerialPhotography', 'lidar', 'usgsDem']);
    // Verify original array is not mutated
    expect(currentTypes).toEqual(['aerialPhotography', 'lidar']);
  });

  it('removes a product type when it is already in the list', () => {
    const currentTypes = ['aerialPhotography', 'lidar', 'usgsDem'];
    const result = toggleValueInList(currentTypes, 'lidar');

    expect(result).toEqual(['aerialPhotography', 'usgsDem']);
    // Verify original array is not mutated
    expect(currentTypes).toEqual(['aerialPhotography', 'lidar', 'usgsDem']);
  });

  it('adds a product type to an empty list', () => {
    const currentTypes: string[] = [];
    const result = toggleValueInList(currentTypes, 'contours');

    expect(result).toEqual(['contours']);
    expect(currentTypes).toEqual([]);
  });

  it('removes the only product type from a list with one item', () => {
    const currentTypes = ['drg'];
    const result = toggleValueInList(currentTypes, 'drg');

    expect(result).toEqual([]);
    expect(currentTypes).toEqual(['drg']);
  });
});
