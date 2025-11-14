// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { drawPointOnMap, expandStep, navigateToApp, selectProduct, waitForResults } from '../fixtures/test-helpers';

test.describe('Multiple Product Type Search', () => {
  test('3.1 Search for Aerial Photography and Lidar Together', async ({ page }) => {
    await navigateToApp(page);

    // Select both product types
    await selectProduct(page, 'Aerial Photography');
    await selectProduct(page, 'Lidar DEMs');

    // Verify both checkboxes are checked
    await expect(page.getByRole('checkbox', { name: /Aerial Photography/ })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: /Lidar DEMs/ })).toBeChecked();

    // Define area of interest
    await expandStep(page, 'Step 2 - Define Area of');
    await drawPointOnMap(page);

    // Wait for search to complete
    await waitForResults(page);

    // Verify results section shows two separate product type headers
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

    // Verify both product types can be expanded independently
    await page.getByRole('button', { name: 'Collapse Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Expand Aerial Photography' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse Lidar DEMs' })).toBeVisible();

    // Re-expand Aerial Photography
    await page.getByRole('button', { name: 'Expand Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();
  });

  test('3.2 Verify Product Type Display Order', async ({ page }) => {
    await navigateToApp(page);
    await selectProduct(page, 'Aerial Photography');
    await selectProduct(page, 'Lidar DEMs');
    await expandStep(page, 'Step 2 - Define Area of');
    await drawPointOnMap(page);
    await waitForResults(page);

    // Observe the order of product types in the results
    const resultRows = page.getByRole('row', { level: 1 });

    // Verify product types appear in the same order as defined in config
    const firstProductType = resultRows.first();
    const secondProductType = resultRows.nth(1);

    await expect(firstProductType).toContainText('Aerial Photography');
    await expect(secondProductType).toContainText('Lidar DEMs');

    // Verify order is consistent with Step 1 checkbox order
    await expect(firstProductType.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();
    await expect(secondProductType.getByRole('button', { name: 'Collapse Lidar DEMs' })).toBeVisible();
  });
});
