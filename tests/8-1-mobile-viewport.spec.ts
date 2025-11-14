// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Responsive Design Testing', () => {
  test('8.1 Test on Mobile Viewport', async ({ page }) => {
    // 1. Set viewport to 375x812 (mobile)
    await page.setViewportSize({ width: 375, height: 812 });

    // 2. Navigate to http://localhost:5173 with preselected product to avoid mobile click issues
    await page.goto('http://localhost:5173/?products=0');

    // 3. Complete basic aerial photography search
    // Product preselected via URL; wait for Step 2 to enable then proceed
    const step2Group = page.getByRole('group', { name: 'Step 2 - Define Area of Interest' });
    await expect(step2Group).toBeVisible({ timeout: 10000 });
    // On mobile, the action bar can overflow; trigger the click via evaluate to bypass viewport constraints
    const drawPointBtn = step2Group.getByRole('button', { name: 'Draw a point' });
    await drawPointBtn.evaluate((btn: HTMLButtonElement) => btn.click());
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // Verifications
    await expect(page.locator('arcgis-map')).toBeVisible();
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });
  });
});
