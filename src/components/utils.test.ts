import { describe, expect, it } from 'vitest';
import { isUrlLike, isYes } from './utils';

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
