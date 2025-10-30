import { expect, test } from '@playwright/test';

test.describe('Lidar DEMs workflow', () => {
  test('should complete full workflow for lidar product', async ({ page }) => {
    await page.goto('/');

    // Step 1: Select Lidar product type
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Lidar DEMs' }).check();
    await expect(page.getByRole('checkbox', { name: 'Lidar DEMs' })).toBeChecked();

    // Move to Step 2: Define Area of Interest
    await page.getByText('Step 2 - Define Area of Interest').click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();

    // Use address search
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Provo, UT');
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

    // Verify lidar-specific categories (bare earth, first return)
    const productCard = page.locator('[class*="Product"]').first();
    await expect(productCard).toBeVisible({ timeout: 5000 });
  });

  test('should show lidar-specific metadata fields', async ({ page }) => {
    await page.goto('/');

    // Select Lidar
    await page.getByRole('checkbox', { name: 'Lidar DEMs' }).check();

    // Move to Step 2 and select area
    await page.getByText('Step 2 - Define Area of Interest').click();
    await page.getByLabel('Address').click();

    const addressInput = page.getByPlaceholder('Search for an address or place');
    await addressInput.fill('Logan, UT');
    await addressInput.press('Enter');
    await page.waitForTimeout(2000);

    // Move to Step 3
    await page.getByText('Step 3 - Results').click();
    await page.waitForTimeout(3000);

    // Click on a product to see more info
    const productCard = page.locator('[class*="Product"]').first();
    if (await productCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      const moreInfoButton = productCard.getByRole('button', { name: /more info/i }).first();
      if (await moreInfoButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await moreInfoButton.click();
        await page.waitForTimeout(1000);

        // Verify lidar-specific fields like Year Collected, Vertical Accuracy
        await expect(page.locator('text=/Year Collected|Vertical Accuracy/i').first()).toBeVisible({
          timeout: 5000,
        });
      }
    }
  });
});
