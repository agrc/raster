import type { IFeature } from '@esri/arcgis-rest-request';
import config from '../config';

export function getSort(order: string[]) {
  order = order.map((val) => val.toLowerCase());

  return (a: IFeature, b: IFeature) => {
    const aValue = a.attributes[config.EXTENT_FIELDS.Product].toLowerCase();
    const aIndex = order.findIndex((val) => aValue.includes(val));
    const bValue = b.attributes[config.EXTENT_FIELDS.Product].toLowerCase();
    const bIndex = order.findIndex((val) => bValue.includes(val));

    // Unmatched items (index === -1) should be sorted to the end, and
    // maintain their relative order among themselves (by returning 0).
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  };
}

export function isYes(value: string | null | undefined) {
  if (typeof value !== 'string') {
    return false;
  }

  return value.trim().toUpperCase() === 'YES';
}

export function isUrlLike(text: string | null | undefined) {
  if (typeof text !== 'string') {
    return false;
  }

  const trimmed = text.trim();

  if (trimmed === '') {
    return false;
  }

  try {
    const url = new URL(trimmed);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function removeCurlyBracesContent(text: string) {
  // Remove non-nested occurrences of {...} including the braces themselves, then trim.
  return text.replace(/\{[^}]*\}/g, '').trim();
}

export type DownloadTool = 'wget' | 'curl' | 'aria2c';

type TileAttributes = {
  [config.INDEX_FIELDS.PATH]: string | number;
  [config.INDEX_FIELDS.TILE]: string | number;
  [config.INDEX_FIELDS.EXT]: string | number;
};

/**
 * Generates a single command string for bulk downloading tiles using the specified tool.
 * The command can be copied and pasted directly into a terminal.
 */
export function generateCommands(tool: DownloadTool, features: { attributes: TileAttributes }[]): string {
  const urls = features.map(
    (f) =>
      `${f.attributes[config.INDEX_FIELDS.PATH]}${f.attributes[config.INDEX_FIELDS.TILE]}${f.attributes[config.INDEX_FIELDS.EXT]}`,
  );

  switch (tool) {
    case 'wget':
      // wget accepts multiple URLs as arguments
      return `wget ${urls.map((url) => `"${url}"`).join(' ')}`;

    case 'curl': {
      // Prefer curl.exe on Windows (avoids the PowerShell curl alias), plain curl elsewhere
      const isWindows = typeof navigator !== 'undefined' && /windows/i.test(navigator.userAgent);
      const curlCommand = isWindows ? 'curl.exe' : 'curl';
      return `${curlCommand} ${urls.map((url) => `-O "${url}"`).join(' ')}`;
    }

    case 'aria2c':
      // aria2c -Z treats each URL as a separate download (without -Z, multiple URLs are treated as mirrors)
      return `aria2c -Z ${urls.map((url) => `"${url}"`).join(' ')}`;
  }
}
