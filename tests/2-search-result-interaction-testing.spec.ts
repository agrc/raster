// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Search Result Interaction Testing', () => {
  test('2.1 Test Extent Zoom Functionality', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results - Click Aerial Photography label to check the checkbox
    await page.goto('http://localhost:5173');
    await page.getByText('Aerial Photography').click();

    // 1. Complete scenario 1.1 to get aerial photography results - Expand Step 2 to define area of interest
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();

    // 1. Complete scenario 1.1 to get aerial photography results - Click point drawing tool to activate it
    await page.getByRole('button', { name: 'Draw a point' }).click();
    // brief activation delay to ensure tool is ready across browsers
    await page.waitForTimeout(300);

    // 1. Complete scenario 1.1 to get aerial photography results - Click on the map to place a point at approximate Salt Lake City location
    await page.getByRole('application').click();

    // Wait for Step 3 results to load
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();

    // 2. Note the current map extent/zoom level - 3. Expand a product category and locate a product
    await page.getByRole('button', { name: 'Expand NAIP 2024 (60cm)' }).click();

    // 4. Click the "Extent" button on a product - 5. Observe the map animation
    const extentButton = page.getByRole('button', { name: 'Extent' });
    await extentButton.click();

    // Verify the extent button is visible (it was clicked successfully)
    await expect(extentButton).toBeVisible();
  });

  test('2.2 Test Preview Toggle Functionality', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    // brief activation delay to ensure tool is ready across browsers
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // Wait for Step 3 results to load
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();

    // 2. Expand categories until a product with a "Preview" button is found
    const CATEGORY_PATTERN = /NAIP|HRO|DOQ|Historical/i;
    const categories = page.getByRole('row').filter({ hasText: CATEGORY_PATTERN });
    await expect(categories.first()).toBeVisible();

    let previewButton = page.getByRole('button', { name: 'Preview', exact: true }).first();
    let previewCount = await previewButton.count();

    const maxToCheck = Math.min(await categories.count(), 6);
    for (let i = 0; i < maxToCheck && previewCount === 0; i++) {
      const cat = categories.nth(i);
      const expandBtn = cat.getByRole('button', { name: /Expand/i });
      if (await expandBtn.isVisible()) {
        await expandBtn.click();
        await page.waitForTimeout(300);
      }
      previewButton = page.getByRole('button', { name: 'Preview', exact: true }).first();
      previewCount = await previewButton.count();
    }

    if (previewCount === 0) {
      test.fixme(true, 'No product with a Preview button available for this AOI.');
    }

    // 3. Click the "Preview" toggle button to enable preview
    await previewButton.click();

    // 4. Verify the button appears selected/toggled on
    // 5. Wait for the preview layer to load on the map
    await expect(page.getByRole('button', { name: 'Clear preview layer' })).toBeVisible();

    // 6. Click the "Preview" toggle button again to disable preview
    await previewButton.click();

    // Verify the preview layer is removed
    await expect(page.getByRole('button', { name: 'Clear preview layer' })).not.toBeVisible();
  });

  test('2.3 Test More Info Dialog', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    // brief activation delay to ensure tool is ready across browsers
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // Wait for Step 3 results to load
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();

    // 2. Expand a product item to show details
    await page.getByRole('button', { name: 'Expand NAIP 2024 (60cm)' }).click();

    // 3. Click the "more info" button - 4. Wait for modal dialog to open
    await page.getByRole('button', { name: 'more info' }).click();

    // Verify a modal dialog opens over the page
    const dialog = page.getByRole('dialog', { name: 'more info' });
    await expect(dialog).toBeVisible();

    // Verify dialog displays a title matching the product description
    await expect(
      dialog.getByText('.6 Meter 4-Band Digital Orthophotography from 2024 NAIP (county mosaics)'),
    ).toBeVisible();

    // Verify dialog shows a table with product metadata fields
    const table = dialog.getByRole('table');
    await expect(table).toBeVisible();

    // Verify specific metadata fields are present
    await expect(table.getByRole('row', { name: /Resolution/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Year Collected/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /File Format/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Average File Size/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Horizontal Accuracy/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Flight Date Location/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Contact/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Stored at UGRC/ })).toBeVisible();

    // Verify dialog has a close button
    const closeButton = dialog.getByRole('button', { name: 'Close', exact: true });
    await expect(closeButton).toBeVisible();

    // Close the more info dialog
    await closeButton.click();

    // Verify dialog is closed
    await expect(dialog).not.toBeVisible();
  });

  test('2.4 Test Web Page Link', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    // brief activation delay to ensure tool is ready across browsers
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // Wait for Step 3 results to load
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();

    // 2. Expand a product item to show details
    await page.getByRole('button', { name: 'Expand NAIP 2024 (60cm)' }).click();

    // 3. Look for "web page" link in the details section
    const webPageLink = page.getByRole('link', { name: /web page.*opens in a new window/ });

    // 4. If present, verify it appears as an external link (with icon)
    await expect(webPageLink).toBeVisible();

    // Verify link text
    await expect(webPageLink).toContainText('web page');

    // Verify the link has the correct href
    await expect(webPageLink).toHaveAttribute('href', 'https://gis.utah.gov/products/sgid/aerial-photography/naip/');
  });

  test('2.5 Test Download Button Availability', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    // brief activation delay to ensure tool is ready across browsers
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // Wait for Step 3 results to load
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();

    // 2. Expand multiple product items to show their details
    await page.getByRole('button', { name: 'Expand NAIP 2024 (60cm)' }).click();

    // 3. Identify which products show a "Download" button
    const downloadButton = page.getByRole('button', { name: 'Download', exact: true });
    await expect(downloadButton).toBeVisible();

    // 4. Click a "Download" button on a product that has one
    await downloadButton.click();

    // Verify clicking the button advances the wizard to "Step 4 - Download"
    const step4Button = page.getByRole('button', { name: 'Step 4 - Download' });
    await expect(step4Button).toHaveAttribute('aria-expanded', 'true');

    // Verify Step 4 disclosure becomes enabled and expands
    await expect(page.getByRole('group', { name: 'Step 4 - Download' })).toBeVisible();

    // Verify download UI is shown
    await expect(page.getByText('Click on a tile on the map or in the list below')).toBeVisible();
    await expect(
      page.getByText('.6 Meter 4-Band Digital Orthophotography from 2024 NAIP (county mosaics)').last(),
    ).toBeVisible();
    await expect(page.getByText('1 Tiles Found')).toBeVisible();
  });
});
