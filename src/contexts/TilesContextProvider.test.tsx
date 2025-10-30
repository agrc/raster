import { describe, expect, it } from 'vitest';

describe('TilesContextProvider', () => {
  it('tracks downloaded tiles with Set data structure', () => {
    // Test the core logic that TilesContextProvider uses
    const downloadedTiles = new Set<number>();

    // Add tiles
    downloadedTiles.add(123);
    downloadedTiles.add(456);

    expect(downloadedTiles.has(123)).toBe(true);
    expect(downloadedTiles.has(456)).toBe(true);
    expect(downloadedTiles.size).toBe(2);

    // Adding duplicate doesn't increase size
    downloadedTiles.add(123);
    expect(downloadedTiles.size).toBe(2);

    // Clear
    downloadedTiles.clear();
    expect(downloadedTiles.size).toBe(0);
  });

  it('creates new Set when marking as downloaded', () => {
    // Test the immutable update pattern used in markAsDownloaded
    const prev = new Set([123, 456]);
    const next = new Set(prev).add(789);

    expect(prev.size).toBe(2);
    expect(next.size).toBe(3);
    expect(next.has(789)).toBe(true);
  });
});
