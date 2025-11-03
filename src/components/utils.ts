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
