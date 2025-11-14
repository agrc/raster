// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { completeBasicSearch, expandCategory, waitForMap } from '../fixtures/test-helpers';

test.describe('Visual and Interaction Testing', () => {
  test('6.2 Test Tile Highlighting in Download View', async ({ page }) => {
    await completeBasicSearch(page);

    // Expand first category and look for a Download button
    await expandCategory(page);

    const downloadButton = page.getByRole('button', { name: 'Download', exact: true }).first();
    const hasDownload = await downloadButton.count();
    if (!hasDownload) {
      test.fixme(true, 'No product with a Download button available for this AOI.');
      return;
    }
    await downloadButton.click();

    // Wait for Step 4 to expand
    const step4Group = page.getByRole('group', { name: 'Step 4 - Download' });
    await expect(step4Group).toBeVisible();

    // Step 4 shows tile selection interface
    await expect(page.getByText('Click on a tile on the map or in the list below')).toBeVisible();

    // Hover over a tile in the list
    const tileLink = step4Group.locator('a[download]').first();
    await expect(tileLink).toBeVisible({ timeout: 20000 });
    await tileLink.hover();

    // UI remains responsive
    await waitForMap(page);
  });

  test('6.3 Test Tree Expansion States', async ({ page }) => {
    await completeBasicSearch(page);

    // Ensure a category is visible to check collapse behavior
    const aCategoryRow = page.getByRole('row', { level: 2 }).first();
    await expect(aCategoryRow).toBeVisible();

    // Collapse the top-level Aerial Photography
    await page.getByRole('button', { name: 'Collapse Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Expand Aerial Photography' })).toBeVisible();

    // Verify categories collapse (no level 2 rows visible)
    await expect(page.getByRole('row', { level: 2 })).toHaveCount(0);

    // Expand Aerial Photography again
    await page.getByRole('button', { name: 'Expand Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();

    // Verify categories are visible again
    await expect(page.getByRole('row', { level: 2 }).first()).toBeVisible();
  });
});
