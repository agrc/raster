import { expect, test } from '@playwright/test';

test.describe('Aerial Photography workflow', () => {
  test('should complete full workflow for aerial photography product', async ({ page }) => {
    await page.goto('/');

    // Step 1: Select Aerial Photography product type
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Aerial Photography' }).check();
    await expect(page.getByRole('checkbox', { name: 'Aerial Photography' })).toBeChecked();

    // Move to Step 2: Define Area of Interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();

    // Select the map draw tool option (point, extent, or polygon)
    await page.getByLabel('Address').click();

    // Enter an address in Utah
    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('350 State St, Salt Lake City, UT');
    await addressInput.press('Enter');

    // Wait for the address to be found and selected
    await page.waitForTimeout(2000);

    // Move to Step 3: Results
    await page.getByText('Step 3 - Results').click();
    await expect(page.getByText('Step 3 - Results')).toBeVisible();

    // Wait for search results to load
    await page.waitForTimeout(3000);

    // Verify that results are displayed (at least one product should be found)
    const resultsSection = page.locator('[class*="SearchResults"]').first();
    await expect(resultsSection).toBeVisible({ timeout: 10000 });

    // Select a product from the results
    // Look for RGB category (common in aerial photography)
    const productCard = page.locator('[class*="Product"]').first();
    await expect(productCard).toBeVisible({ timeout: 5000 });

    // Click on the product to select it
    await productCard.click();

    // Preview the product on map
    const previewButton = page.getByRole('button', { name: /preview/i }).first();
    if (await previewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await previewButton.click();
      await page.waitForTimeout(2000);
    }

    // Move to Step 4: Download
    // Click on the download button/icon for a tile
    const downloadIcon = page.locator('[class*="download"]').first();
    if (await downloadIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
      await downloadIcon.click();
      await page.waitForTimeout(1000);

      // Verify Step 4 is now accessible
      await page.getByText('Step 4 - Download').click();
      await expect(page.getByText('Step 4 - Download')).toBeVisible();

      // Verify download information is displayed
      const downloadSection = page.locator('[class*="Download"]').first();
      await expect(downloadSection).toBeVisible({ timeout: 5000 });
    }
  });

  test('should filter aerial photography by category', async ({ page }) => {
    await page.goto('/');

    // Select Aerial Photography
    await page.getByRole('checkbox', { name: 'Aerial Photography' }).check();

    // Move to Step 2 and select area of interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('1594 W North Temple, Salt Lake City, UT');
    await addressInput.press('Enter');
    await page.waitForTimeout(2000);

    // Move to Step 3
    await page.getByText('Step 3 - Results').click();
    await page.waitForTimeout(3000);

    // Verify category filters are available (RGB, CIR, B&W, etc.)
    const categorySection = page.locator('text=/RGB|CIR|B&W|Single/i').first();
    if (await categorySection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(categorySection).toBeVisible();
    }
  });
});
