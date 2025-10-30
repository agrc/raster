import { describe, expect, it } from 'vitest';
import { parseUrlParams } from './useUrlParams';

// Helper to mock window.location
const mockLocation = (search: string) => {
  // @ts-expect-error - we're intentionally mocking window.location
  delete window.location;
  // @ts-expect-error - we're intentionally mocking window.location
  window.location = { search } as Location;
};

const restoreLocation = (original: Location) => {
  // @ts-expect-error - restoring window.location
  window.location = original;
};

describe('parseUrlParams', () => {
  it('parses title parameter', () => {
    const originalLocation = window.location;
    mockLocation('?title=My%20Title');

    const result = parseUrlParams();
    expect(result.title).toBe('My Title');

    restoreLocation(originalLocation);
  });

  it('parses cat parameter', () => {
    const originalLocation = window.location;
    mockLocation('?cat=HRO%202009%20(25cm)');

    const result = parseUrlParams();
    expect(result.cat).toBe('HRO 2009 (25cm)');

    restoreLocation(originalLocation);
  });

  it('parses catGroup parameter as array', () => {
    const originalLocation = window.location;
    mockLocation('?catGroup=24K%20GeoPDF,24K%20DRG');

    const result = parseUrlParams();
    expect(result.catGroup).toEqual(['24K GeoPDF', '24K DRG']);

    restoreLocation(originalLocation);
  });

  it('parses products parameter as array of numbers', () => {
    const originalLocation = window.location;
    mockLocation('?products=1,3,5');

    const result = parseUrlParams();
    expect(result.products).toEqual([1, 3, 5]);

    restoreLocation(originalLocation);
  });

  it('filters out invalid product indices', () => {
    const originalLocation = window.location;
    mockLocation('?products=1,abc,3');

    const result = parseUrlParams();
    expect(result.products).toEqual([1, 3]);

    restoreLocation(originalLocation);
  });

  it('returns null for missing parameters', () => {
    const originalLocation = window.location;
    mockLocation('');

    const result = parseUrlParams();
    expect(result.title).toBeNull();
    expect(result.cat).toBeNull();
    expect(result.catGroup).toBeNull();
    expect(result.products).toBeNull();

    restoreLocation(originalLocation);
  });

  it('handles multiple parameters', () => {
    const originalLocation = window.location;
    mockLocation('?title=My%20Title&cat=HRO%202009&products=1,2');

    const result = parseUrlParams();
    expect(result.title).toBe('My Title');
    expect(result.cat).toBe('HRO 2009');
    expect(result.products).toEqual([1, 2]);

    restoreLocation(originalLocation);
  });
});
