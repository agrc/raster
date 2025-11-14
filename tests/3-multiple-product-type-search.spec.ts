// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Multiple Product Type Search', () => {
  test('3.1 Search for Aerial Photography and Lidar Together', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    await page.goto('http://localhost:5173');
    await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });

    // 2. Select both "Aerial Photography" and "Lidar DEMs" checkboxes in Step 1
    await page.getByText('Aerial Photography').click();
    await page.getByText('Lidar DEMs').click();

    // 3. Verify both checkboxes are checked
    await expect(page.getByRole('checkbox', { name: /Aerial Photography/ })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: /Lidar DEMs/ })).toBeChecked();

    // 4. Expand Step 2 and define an area of interest (use point tool on Salt Lake area)
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // 5. Wait for search to complete - Step 3 expands automatically
    await expect(page.getByRole('treegrid', { name: 'search results' }).first()).toBeVisible({ timeout: 15000 });

    // Verify results section shows two separate product type headers: "Aerial Photography" and "Lidar DEMs"
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse Lidar DEMs' })).toBeVisible();

    // Verify each product type has its own category tree
    const aerialPhotoRow = page.getByRole('row', { name: /Aerial Photography/ }).first();
    const lidarRow = page.getByRole('row', { name: /Lidar DEMs/ }).first();
    await expect(aerialPhotoRow).toBeVisible();
    await expect(lidarRow).toBeVisible();

    // Verify Aerial Photography has categories
    await expect(page.getByRole('button', { name: /Expand NAIP/ }).first()).toBeVisible();

    // Verify Lidar DEMs has categories
    await expect(page.getByRole('button', { name: /Expand .5 Meter/ }).first()).toBeVisible();

    // Verify both product types can be expanded independently - Collapse Aerial Photography
    await page.getByRole('button', { name: 'Collapse Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Expand Aerial Photography' })).toBeVisible();

    // Verify Lidar DEMs is still expanded
    await expect(page.getByRole('button', { name: 'Collapse Lidar DEMs' })).toBeVisible();

    // Re-expand Aerial Photography
    await page.getByRole('button', { name: 'Expand Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();
  });

  test('3.2 Verify Product Type Display Order', async ({ page }) => {
    // 1. Complete scenario 3.1
    await page.goto('http://localhost:5173');
    await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });
    await page.getByText('Aerial Photography').click();
    await page.getByText('Lidar DEMs').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('application').click();
    await expect(page.getByRole('treegrid', { name: 'search results' }).first()).toBeVisible({ timeout: 15000 });

    // 2. Observe the order of product types in the results
    const resultRows = page.getByRole('row', { level: 1 });

    // Verify product types appear in the same order as defined in config:
    // 1. Aerial Photography
    // 2. Lidar DEMs
    const firstProductType = resultRows.first();
    const secondProductType = resultRows.nth(1);

    await expect(firstProductType).toContainText('Aerial Photography');
    await expect(secondProductType).toContainText('Lidar DEMs');

    // Verify order is consistent with Step 1 checkbox order
    await expect(firstProductType.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();
    await expect(secondProductType.getByRole('button', { name: 'Collapse Lidar DEMs' })).toBeVisible();
  });
});
