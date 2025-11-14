// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Accessibility Testing', () => {
  test('7.1 Keyboard Navigation Through Results', async ({ page }) => {
    // 1. Complete scenario 1.1 to get aerial photography results
    await page.goto('http://localhost:5173');
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.getByRole('application').click();
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });

    // 2. Focus within the results area
    const resultsGrid = page.getByRole('treegrid', { name: 'search results' });
    await resultsGrid.click();

    // 3. Use keyboard to expand a category
    const expandBtn = page.getByRole('button', { name: /Expand / }).first();
    await expandBtn.focus();
    await page.keyboard.press('Enter');

    // Verify expanded state by locating corresponding Collapse button
    const collapseBtn = page.getByRole('button', { name: /Collapse / }).first();
    await expect(collapseBtn).toBeVisible();
  });
});
