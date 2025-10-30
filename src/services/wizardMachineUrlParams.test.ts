import { describe, expect, it } from 'vitest';
import { getInitialState } from './wizardMachine';

describe('getInitialState with URL params', () => {
  it('returns default state when no URL params provided', () => {
    const result = getInitialState();

    expect(result.step).toBe('step1');
    expect(result.context.productTypes).toEqual([]);
    expect(result.context.categoryFilter).toBeNull();
  });

  it('selects all product types and skips to step 2 when cat is provided', () => {
    const result = getInitialState({ cat: 'HRO 2009 (25cm)', catGroup: null, products: null });

    expect(result.step).toBe('step2');
    expect(result.context.productTypes).toEqual([
      'aerialPhotography',
      'lidar',
      'usgsDem',
      'autoDem',
      'contours',
      'drg',
    ]);
    expect(result.context.categoryFilter).toBe('HRO 2009 (25cm)');
  });

  it('selects all product types and skips to step 2 when catGroup is provided', () => {
    const result = getInitialState({ cat: null, catGroup: ['24K GeoPDF', '24K DRG'], products: null });

    expect(result.step).toBe('step2');
    expect(result.context.productTypes).toEqual([
      'aerialPhotography',
      'lidar',
      'usgsDem',
      'autoDem',
      'contours',
      'drg',
    ]);
    expect(result.context.categoryFilter).toEqual(['24K GeoPDF', '24K DRG']);
  });

  it('prefers cat over catGroup when both are provided', () => {
    const result = getInitialState({ cat: 'HRO 2009', catGroup: ['24K GeoPDF'], products: null });

    expect(result.step).toBe('step2');
    expect(result.context.categoryFilter).toBe('HRO 2009');
  });

  it('pre-selects product types when products param is provided', () => {
    const result = getInitialState({ cat: null, catGroup: null, products: [0, 1, 3] });

    expect(result.step).toBe('step1');
    expect(result.context.productTypes).toEqual(['aerialPhotography', 'lidar', 'autoDem']);
    expect(result.context.categoryFilter).toBeNull();
  });

  it('filters out invalid product indices', () => {
    const result = getInitialState({ cat: null, catGroup: null, products: [-1, 0, 1, 100] });

    expect(result.context.productTypes).toEqual(['aerialPhotography', 'lidar']);
  });

  it('handles empty products array', () => {
    const result = getInitialState({ cat: null, catGroup: null, products: [] });

    expect(result.step).toBe('step1');
    expect(result.context.productTypes).toEqual([]);
  });
});
