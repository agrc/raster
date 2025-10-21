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
