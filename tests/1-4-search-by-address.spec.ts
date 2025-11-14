// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

// Scenario: Search by address instead of map click
// Goal: Ensure address geocoding sets AOI and returns results

test.describe('Basic Aerial Photography Search', () => {
  test('1.4 Search for Aerial Photography by Address', async ({ page }) => {
    // 1. Navigate with Aerial Photography preselected (index 0)
    await page.goto('http://localhost:5173/?products=0');

    // 2. Ensure Step 2 is enabled and expand it
    const step2Header = page.getByRole('button', { name: 'Step 2 - Define Area of Interest' });
    await expect(step2Header).toBeEnabled();
    await step2Header.click();

    // 3. Type an address in the Step 2 search box and submit
    const step2Group = page.getByRole('group', { name: 'Step 2 - Define Area of Interest' });
    const searchInput = step2Group.getByRole('searchbox', { name: 'Search' });
    await searchInput.fill('350 State St, Salt Lake City, UT');
    await searchInput.press('Enter');

    // 4. Verify Step 3 enables and results render
    const step3Header = page.getByRole('button', { name: 'Step 3 - Results' });
    await expect(step3Header).toBeEnabled({ timeout: 15000 });
    await step3Header.click();

    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 20000 });

    // Sanity: Aerial Photography appears as top-level
    await expect(page.getByRole('row', { name: /Aerial Photography/i })).toBeVisible();
  });
});
