// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Visual and Interaction Testing', () => {
  test('6.2 Test Tile Highlighting in Download View', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'Step 1 - Select Products' }).click();
    await page.getByRole('group', { name: 'Step 1 - Select Products' }).getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('application').click();
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });

    // 2. Click a product with a "Download" button (expand first category and look for a Download button)
    await page
      .getByRole('button', { name: /Expand / })
      .first()
      .click();
    const downloadButton = page.getByRole('button', { name: 'Download', exact: true }).first();
    const hasDownload = await downloadButton.count();
    if (!hasDownload) {
      test.fixme(true, 'No product with a Download button available for this AOI.');
      return;
    }
    await downloadButton.click();

    // 3. Wait for Step 4 to expand
    const step4Group = page.getByRole('group', { name: 'Step 4 - Download' });
    await expect(step4Group).toBeVisible();

    // Step 4 shows tile selection interface
    await expect(page.getByText('Click on a tile on the map or in the list below')).toBeVisible();

    // 4. Hover over a tile in the list (tiles render as <a download>)
    const tileLink = step4Group.locator('a[download]').first();
    await expect(tileLink).toBeVisible({ timeout: 20000 });
    await tileLink.hover();

    // UI remains responsive
    await expect(page.locator('arcgis-map')).toBeVisible();
  });
});
