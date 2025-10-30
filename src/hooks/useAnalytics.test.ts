import { describe, expect, it } from 'vitest';
import type { AnalyticsEvent } from './useAnalytics';

describe('AnalyticsEvent types', () => {
  it('should support product type selection events', () => {
    const event: AnalyticsEvent = {
      type: 'product_type_selected',
      productType: 'aerialPhotography',
    };

    expect(event.type).toBe('product_type_selected');
    expect(event.productType).toBe('aerialPhotography');
  });

  it('should support product type deselection events', () => {
    const event: AnalyticsEvent = {
      type: 'product_type_deselected',
      productType: 'lidar',
    };

    expect(event.type).toBe('product_type_deselected');
    expect(event.productType).toBe('lidar');
  });

  it('should support AOI search events', () => {
    const event: AnalyticsEvent = {
      type: 'aoi_search',
      method: 'address',
    };

    expect(event.type).toBe('aoi_search');
    expect(event.method).toBe('address');
  });

  it('should support AOI draw events with various methods', () => {
    const methods = ['point', 'polyline', 'polygon', 'extent', 'circle'];

    methods.forEach((method) => {
      const event: AnalyticsEvent = {
        type: 'aoi_draw',
        method,
      };

      expect(event.type).toBe('aoi_draw');
      expect(event.method).toBe(method);
    });
  });

  it('should support result extent click events', () => {
    const event: AnalyticsEvent = {
      type: 'result_extent_click',
      productType: 'usgsDem',
      product: 'Test Product',
    };

    expect(event.type).toBe('result_extent_click');
    expect(event.productType).toBe('usgsDem');
    expect(event.product).toBe('Test Product');
  });

  it('should support result preview toggle events', () => {
    const addEvent: AnalyticsEvent = {
      type: 'result_preview_toggle',
      productType: 'contours',
      product: 'Test Product',
      action: 'add',
    };

    expect(addEvent.type).toBe('result_preview_toggle');
    expect(addEvent.action).toBe('add');

    const removeEvent: AnalyticsEvent = {
      type: 'result_preview_toggle',
      productType: 'contours',
      product: 'Test Product',
      action: 'remove',
    };

    expect(removeEvent.action).toBe('remove');
  });

  it('should support result action events', () => {
    const moreInfoEvent: AnalyticsEvent = {
      type: 'result_more_info_click',
      productType: 'autoDem',
      product: 'Test Product',
    };

    expect(moreInfoEvent.type).toBe('result_more_info_click');

    const downloadEvent: AnalyticsEvent = {
      type: 'result_download_click',
      productType: 'drg',
      product: 'Test Product',
    };

    expect(downloadEvent.type).toBe('result_download_click');

    const webPageEvent: AnalyticsEvent = {
      type: 'result_web_page_click',
      productType: 'lidar',
      product: 'Test Product',
    };

    expect(webPageEvent.type).toBe('result_web_page_click');
  });

  it('should support tile interaction events', () => {
    const downloadEventSidebar: AnalyticsEvent = {
      type: 'tile_download_click',
      productType: 'aerialPhotography',
      tileName: 'tile_001.tif',
      source: 'sidebar',
    };

    expect(downloadEventSidebar.type).toBe('tile_download_click');
    expect(downloadEventSidebar.tileName).toBe('tile_001.tif');
    expect(downloadEventSidebar.source).toBe('sidebar');

    const downloadEventPopup: AnalyticsEvent = {
      type: 'tile_download_click',
      productType: 'aerialPhotography',
      tileName: 'tile_002.tif',
      source: 'popup',
    };

    expect(downloadEventPopup.source).toBe('popup');

    const hoverEvent: AnalyticsEvent = {
      type: 'tile_hover',
      productType: 'lidar',
    };

    expect(hoverEvent.type).toBe('tile_hover');

    const metadataEventSidebar: AnalyticsEvent = {
      type: 'tile_metadata_download',
      productType: 'usgsDem',
      source: 'sidebar',
    };

    expect(metadataEventSidebar.type).toBe('tile_metadata_download');
    expect(metadataEventSidebar.source).toBe('sidebar');

    const metadataEventPopup: AnalyticsEvent = {
      type: 'tile_metadata_download',
      productType: 'usgsDem',
      source: 'popup',
    };

    expect(metadataEventPopup.source).toBe('popup');

    const reportEventSidebar: AnalyticsEvent = {
      type: 'tile_report_download',
      productType: 'autoDem',
      source: 'sidebar',
    };

    expect(reportEventSidebar.type).toBe('tile_report_download');
    expect(reportEventSidebar.source).toBe('sidebar');

    const reportEventPopup: AnalyticsEvent = {
      type: 'tile_report_download',
      productType: 'autoDem',
      source: 'popup',
    };

    expect(reportEventPopup.source).toBe('popup');
  });
});
