// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { expandStep, navigateToApp, searchByAddress, TIMEOUTS, waitForResults } from '../fixtures/test-helpers';

test.describe('Address-Based Search', () => {
  test('1.4 Search for Aerial Photography by Address', async ({ page }) => {
    // Navigate with Aerial Photography preselected (index 0)
    await navigateToApp(page, 'products=0');

    // Ensure Step 2 is enabled and expand it
    await expandStep(page, 'Step 2 - Define Area of Interest');

    // Type an address and submit
    await searchByAddress(page, '350 State St, Salt Lake City, UT');

    // Verify Step 3 enables and results render
    const step3Header = page.getByRole('button', { name: 'Step 3 - Results' });
    await expect(step3Header).toBeEnabled({ timeout: TIMEOUTS.ADDRESS_GEOCODE });
    await expect(step3Header).toHaveAttribute('aria-expanded', 'true');

    await waitForResults(page);

    // Sanity: Aerial Photography appears as top-level
    await expect(page.getByRole('row', { name: /Aerial Photography/i })).toBeVisible();
  });
});
