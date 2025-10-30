import { useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { useCallback } from 'react';
import type { ProductTypeKey } from '../types';

export type AnalyticsEvent =
  // Step 1 - Product selection
  | { type: 'product_type_selected'; productType: ProductTypeKey }
  | { type: 'product_type_deselected'; productType: ProductTypeKey }
  // Step 2 - AOI definition
  | { type: 'aoi_search'; method: 'address' }
  | { type: 'aoi_draw'; method: string }
  // Step 3 - Result actions
  | { type: 'result_extent_click'; productType: ProductTypeKey; product: string }
  | { type: 'result_preview_toggle'; productType: ProductTypeKey; product: string; action: 'add' | 'remove' }
  | { type: 'result_more_info_click'; productType: ProductTypeKey; product: string }
  | { type: 'result_download_click'; productType: ProductTypeKey; product: string }
  | { type: 'result_web_page_click'; productType: ProductTypeKey; product: string }
  // Step 4 - Tile actions
  | { type: 'tile_download_click'; productType: ProductTypeKey; tileName: string; source: 'popup' | 'sidebar' }
  | { type: 'tile_hover'; productType: ProductTypeKey }
  | { type: 'tile_metadata_download'; productType: ProductTypeKey; source: 'popup' | 'sidebar' }
  | { type: 'tile_report_download'; productType: ProductTypeKey; source: 'popup' | 'sidebar' };

export function useAnalytics() {
  const logEvent = useFirebaseAnalytics();

  const trackEvent = useCallback(
    (event: AnalyticsEvent) => {
      // Extract the event type and parameters
      const { type, ...params } = event;

      // Log the event with Firebase Analytics
      logEvent(type, params);
    },
    [logEvent],
  );

  return { trackEvent };
}
