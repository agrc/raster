import { expect, test } from '@playwright/test';

test.describe('Auto-Correlated DEMs workflow', () => {
  test('should complete full workflow for auto-correlated DEM product', async ({ page }) => {
    await page.goto('/');

    // Step 1: Select Auto-Correlated DEMs product type
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' }).check();
    await expect(page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' })).toBeChecked();

    // Move to Step 2: Define Area of Interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();

    // Use address search
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('St. George, UT');
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

  test('should allow multiple product types selection', async ({ page }) => {
    await page.goto('/');

    // Select multiple DEM types
    await page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' }).check();
    await page.getByRole('checkbox', { name: 'USGS DEMs' }).check();

    await expect(page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'USGS DEMs' })).toBeChecked();

    // Define area of interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Ogden, UT');
    await addressInput.press('Enter');
    await page.waitForTimeout(2000);

    // View results - should show products from both types
    await page.getByText('Step 3 - Results').click();
    await page.waitForTimeout(3000);

    const resultsSection = page.locator('[class*="SearchResults"]').first();
    await expect(resultsSection).toBeVisible({ timeout: 10000 });
  });
});
