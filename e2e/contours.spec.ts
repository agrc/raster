import { expect, test } from '@playwright/test';

test.describe('Contours workflow', () => {
  test('should complete full workflow for contours product', async ({ page }) => {
    await page.goto('/');

    // Step 1: Select Contours product type
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Contours' }).check();
    await expect(page.getByRole('checkbox', { name: 'Contours' })).toBeChecked();

    // Move to Step 2: Define Area of Interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();

    // Use address search
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Cedar City, UT');
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

  test('should display contours on the map', async ({ page }) => {
    await page.goto('/');

    // Select Contours
    await page.getByRole('checkbox', { name: 'Contours' }).check();

    // Define area of interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Vernal, UT');
    await addressInput.press('Enter');
    await page.waitForTimeout(2000);

    // View results
    await page.getByText('Step 3 - Results').click();
    await page.waitForTimeout(3000);

    // Verify map is visible and interactive
    const mapContainer = page.locator('#map').first();
    await expect(mapContainer).toBeVisible({ timeout: 5000 });
  });
});
