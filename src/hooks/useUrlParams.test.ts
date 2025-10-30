import { describe, expect, it, vi } from 'vitest';
import { parseUrlParams } from './useUrlParams';

describe('parseUrlParams', () => {
  it('parses title parameter', () => {
    const originalLocation = window.location;
    // @ts-expect-error mocking window.location
    delete window.location;
    window.location = { ...originalLocation, search: '?title=My%20Title' };

    const result = parseUrlParams();
    expect(result.title).toBe('My Title');

    window.location = originalLocation;
  });

  it('parses cat parameter', () => {
    const originalLocation = window.location;
    // @ts-expect-error mocking window.location
    delete window.location;
    window.location = { ...originalLocation, search: '?cat=HRO%202009%20(25cm)' };

    const result = parseUrlParams();
    expect(result.cat).toBe('HRO 2009 (25cm)');

    window.location = originalLocation;
  });

  it('parses catGroup parameter as array', () => {
    const originalLocation = window.location;
    // @ts-expect-error mocking window.location
    delete window.location;
    window.location = { ...originalLocation, search: '?catGroup=24K%20GeoPDF,24K%20DRG' };

    const result = parseUrlParams();
    expect(result.catGroup).toEqual(['24K GeoPDF', '24K DRG']);

    window.location = originalLocation;
  });

  it('parses products parameter as array of numbers', () => {
    const originalLocation = window.location;
    // @ts-expect-error mocking window.location
    delete window.location;
    window.location = { ...originalLocation, search: '?products=1,3,5' };

    const result = parseUrlParams();
    expect(result.products).toEqual([1, 3, 5]);

    window.location = originalLocation;
  });

  it('filters out invalid product indices', () => {
    const originalLocation = window.location;
    // @ts-expect-error mocking window.location
    delete window.location;
    window.location = { ...originalLocation, search: '?products=1,abc,3' };

    const result = parseUrlParams();
    expect(result.products).toEqual([1, 3]);

    window.location = originalLocation;
  });

  it('returns null for missing parameters', () => {
    const originalLocation = window.location;
    // @ts-expect-error mocking window.location
    delete window.location;
    window.location = { ...originalLocation, search: '' };

    const result = parseUrlParams();
    expect(result.title).toBeNull();
    expect(result.cat).toBeNull();
    expect(result.catGroup).toBeNull();
    expect(result.products).toBeNull();

    window.location = originalLocation;
  });

  it('handles multiple parameters', () => {
    const originalLocation = window.location;
    // @ts-expect-error mocking window.location
    delete window.location;
    window.location = {
      ...originalLocation,
      search: '?title=My%20Title&cat=HRO%202009&products=1,2',
    };

    const result = parseUrlParams();
    expect(result.title).toBe('My Title');
    expect(result.cat).toBe('HRO 2009');
    expect(result.products).toEqual([1, 2]);

    window.location = originalLocation;
  });
});
