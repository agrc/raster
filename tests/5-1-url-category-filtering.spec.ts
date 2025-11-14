// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

const FILTERED_CATEGORIES = ['RGB', 'CIR'];

test.describe('Category Filtering via URL Parameters', () => {
  test('5.1 Filter Aerial Photography to Specific Categories', async ({ page }) => {
    // 1. Navigate to http://localhost:5173/?catGroup=RGB,CIR (correct param keys)
    await page.goto('http://localhost:5173/?catGroup=RGB,CIR');
    await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });

    // 2. Select "Aerial Photography" by clicking the label within Step 1
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();

    // 3. Expand Step 2 and draw a point
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // 4. Expand Step 3 and wait for results
    const resultsGrid = page.getByRole('treegrid', { name: 'search results' });
    await expect(resultsGrid).toBeVisible({ timeout: 15000 });

    // Verify filter notification link appears with expected text fragment and href
    const link = page.getByRole('link', { name: /Want to search for more than/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/');
  });
});
