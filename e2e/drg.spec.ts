import { expect, test } from '@playwright/test';

test.describe('USGS Topo Maps (DRG) workflow', () => {
  test('should complete full workflow for DRG product', async ({ page }) => {
    await page.goto('/');

    // Step 1: Select USGS Topo Maps product type
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
    await page.getByRole('checkbox', { name: 'USGS Topo Maps' }).check();
    await expect(page.getByRole('checkbox', { name: 'USGS Topo Maps' })).toBeChecked();

    // Move to Step 2: Define Area of Interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();

    // Use address search
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Zion National Park, UT');
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

  test('should verify all 6 product types are available', async ({ page }) => {
    await page.goto('/');

    // Verify all 6 product types are visible on step 1
    await expect(page.getByRole('checkbox', { name: 'Aerial Photography' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Lidar DEMs' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'USGS DEMs' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Contours' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'USGS Topo Maps' })).toBeVisible();

    // Verify step 2 is disabled until a product is selected
    const step2Button = page.getByText('Step 2 - Define Area of Interest');
    await expect(step2Button).toBeVisible();

    // Select DRG to enable step 2
    await page.getByRole('checkbox', { name: 'USGS Topo Maps' }).check();

    // Now step 2 should be accessible
    await step2Button.click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();
  });
});
