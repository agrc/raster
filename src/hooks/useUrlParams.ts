import { useEffect, useMemo } from 'react';

export type UrlParams = {
  title: string | null;
  cat: string | null;
  catGroup: string[] | null;
  products: number[] | null;
};

/**
 * Parses URL search parameters and returns structured data
 */
export function parseUrlParams(): UrlParams {
  const searchParams = new URLSearchParams(window.location.search);

  const title = searchParams.get('title');
  const cat = searchParams.get('cat');
  const catGroupParam = searchParams.get('catGroup');
  const productsParam = searchParams.get('products');

  // Parse catGroup as comma-separated list
  const catGroup = catGroupParam ? catGroupParam.split(',').map((s) => s.trim()) : null;

  // Parse products as comma-separated list of zero-based indices
  const products = productsParam
    ? productsParam
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n))
    : null;

  return {
    title,
    cat,
    catGroup,
    products,
  };
}

/**
 * Hook that returns current URL parameters
 */
export function useUrlParams(): UrlParams & { hasFilters: boolean; resetUrl: string } {
  const params = useMemo(() => parseUrlParams(), []);

  // Update document title if title parameter is present
  useEffect(() => {
    if (params.title) {
      document.title = params.title;
    }
  }, [params.title]);

  const hasFilters = params.cat !== null || params.catGroup !== null;

  // Create reset URL (removes cat/catGroup filters but keeps other params)
  const resetUrl = useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete('cat');
    searchParams.delete('catGroup');
    const newSearch = searchParams.toString();
    return newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
  }, []);

  return {
    ...params,
    hasFilters,
    resetUrl,
  };
}
