import { useMemo } from 'react';
import { parseUrlParams, type UrlParams } from '../services/urlParams';

/**
 * Hook that returns current URL parameters
 */
export function useUrlParams(): UrlParams & { hasFilters: boolean } {
  // we only need to parse the URL params once on load
  const params = useMemo(() => parseUrlParams(), []);

  const hasFilters = params.categories.length > 0;

  return {
    ...params,
    hasFilters,
  };
}
