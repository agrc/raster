import { expect, test } from '@playwright/test';

test.describe('USGS DEMs workflow', () => {
  test('should complete full workflow for USGS DEM product', async ({ page }) => {
    await page.goto('/');

    // Step 1: Select USGS DEMs product type
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
    await page.getByRole('checkbox', { name: 'USGS DEMs' }).check();
    await expect(page.getByRole('checkbox', { name: 'USGS DEMs' })).toBeChecked();

    // Move to Step 2: Define Area of Interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();

    // Use address search
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Moab, UT');
    await addressInput.press('Enter');
    await page.waitForTimeout(2000);

    // Move to Step 3: Results
    await page.getByText('Step 3 - Results').click();
    await expect(page.getByText('Step 3 - Results')).toBeVisible();

    // Wait for search results to load
    await page.waitForTimeout(3000);

    // Verify that results are displayed
    const resultsSection = page.locator('[class*="SearchResults"]').first();
    await expect(resultsSection).toBeVisible({ timeout: 10000 });

    const productCard = page.locator('[class*="Product"]').first();
    await expect(productCard).toBeVisible({ timeout: 5000 });
  });

  test('should display USGS DEM metadata', async ({ page }) => {
    await page.goto('/');

    // Select USGS DEMs
    await page.getByRole('checkbox', { name: 'USGS DEMs' }).check();

    // Define area of interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Park City, UT');
    await addressInput.press('Enter');
    await page.waitForTimeout(2000);

    // View results
    await page.getByText('Step 3 - Results').click();
    await page.waitForTimeout(3000);

    // Verify results section is visible
    const resultsSection = page.locator('[class*="SearchResults"]').first();
    await expect(resultsSection).toBeVisible({ timeout: 10000 });
  });
});
