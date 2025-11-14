// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { completeBasicSearch, waitForMap } from '../fixtures/test-helpers';

test.describe('State Management and Persistence', () => {
  test('10.2 Test Browser Navigation', async ({ page }) => {
    await completeBasicSearch(page);

    // Navigate back
    await page.goBack();

    // Navigate forward
    await page.goForward();

    // Reload the page
    await page.reload();

    // Verifications: App stays functional
    await waitForMap(page);

    // URL may or may not preserve state; just ensure it's a valid app URL
    await expect.poll(() => page.url()).toContain('http://localhost:5173');
  });
});
