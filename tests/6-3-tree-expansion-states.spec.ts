// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visual and Interaction Testing', () => {
  test('6.3 Test Tree Expansion States', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.getByRole('application').click();
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });

    // Ensure a category is visible to check collapse behavior
    const aCategoryRow = page.getByRole('row', { level: 2 }).first();
    await expect(aCategoryRow).toBeVisible();

    // 2. Collapse the top-level Aerial Photography
    await page.getByRole('button', { name: 'Collapse Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Expand Aerial Photography' })).toBeVisible();

    // 3. Verify categories collapse (no level 2 rows visible)
    await expect(page.getByRole('row', { level: 2 })).toHaveCount(0);

    // 4. Expand Aerial Photography again
    await page.getByRole('button', { name: 'Expand Aerial Photography' }).click();
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();

    // 5. Verify categories are visible again
    await expect(page.getByRole('row', { level: 2 }).first()).toBeVisible();
  });
});
