// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visual and Interaction Testing', () => {
  test('6.1 Test Product Hover Highlighting', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.getByRole('application').click();
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });

    // 2. Expand a category to show products
    const firstCategoryExpand = page.getByRole('button', { name: /Expand / }).first();
    await firstCategoryExpand.click();

    // 3. Move mouse over a product item without clicking
    const firstProductRow = page.getByRole('row', { level: 3 }).first();
    await expect(firstProductRow).toBeVisible();
    await firstProductRow.hover();

    // Verify: "Extent" button is visible on hover (proxy for hover state)
    const extentButton = page.getByRole('button', { name: 'Extent' }).first();
    await expect(extentButton).toBeVisible();

    // Map remains responsive (arcgis-map visible)
    await expect(page.locator('arcgis-map')).toBeVisible();
  });
});
