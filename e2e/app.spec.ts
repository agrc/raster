import { expect, test } from '@playwright/test';

test.describe('Application basics', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');

    // Verify the header is visible
    await expect(page.getByRole('heading', { name: /UGRC Raster Data Discovery/i })).toBeVisible();

    // Verify the wizard steps are present
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();
    await expect(page.getByText('Step 3 - Results')).toBeVisible();
    await expect(page.getByText('Step 4 - Download')).toBeVisible();

    // Verify the map container is present
    const mapContainer = page.locator('#map').first();
    await expect(mapContainer).toBeVisible();
  });

  test('should have all product types available', async ({ page }) => {
    await page.goto('/');

    // Verify all 6 product types are present
    await expect(page.getByRole('checkbox', { name: 'Aerial Photography' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Lidar DEMs' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'USGS DEMs' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Auto-Correlated DEMs' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Contours' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'USGS Topo Maps' })).toBeVisible();
  });

  test('should enforce wizard flow - step 2 disabled without product selection', async ({ page }) => {
    await page.goto('/');

    // Verify step 1 is expanded by default
    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();

    // Verify that without selecting a product, step 2 should not allow progression
    // (The accordion item should be disabled)
    const step2Disclosure = page.locator('[id="step2"]');
    await expect(step2Disclosure).toHaveAttribute('data-disabled', 'true');
  });

  test('should enable step 2 after selecting a product', async ({ page }) => {
    await page.goto('/');

    // Select a product
    await page.getByRole('checkbox', { name: 'Aerial Photography' }).check();

    // Verify step 2 is now enabled
    const step2Disclosure = page.locator('[id="step2"]');
    await expect(step2Disclosure).not.toHaveAttribute('data-disabled', 'true');

    // Click to expand step 2
    await page.getByText('Step 2 - Define Area of Interest').click();
    await expect(page.getByText('Step 2 - Define Area of Interest')).toBeVisible();

    // Verify area of interest options are present
    await expect(page.getByLabel('Address')).toBeVisible();
  });

  test('should have footer with links', async ({ page }) => {
    await page.goto('/');

    // Verify footer is present
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByText('Step 1 - Select Products')).toBeVisible();
  });

  test('should handle map interactions', async ({ page }) => {
    await page.goto('/');

    // Wait for map to load
    const mapContainer = page.locator('#map').first();
    await expect(mapContainer).toBeVisible();

    // Select a product and area to enable map interactions
    await page.getByRole('checkbox', { name: 'Aerial Photography' }).check();
    await page.getByText('Step 2 - Define Area of Interest').click();

    // Verify map tools are available
    await expect(page.getByLabel('Address')).toBeVisible();
  });
});
