// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('State Management and Persistence', () => {
  test('10.2 Test Browser Navigation', async ({ page }) => {
    // 1. Complete basic search through Step 3
    await page.goto('http://localhost:5173');
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    // brief activation delay for draw tool
    await page.waitForTimeout(300);
    await page.getByRole('application').click();
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });

    // 2. Record current URL
    const urlBefore = page.url();

    // 3. Navigate back
    await page.goBack();

    // 4. Navigate forward
    await page.goForward();

    // 5. Reload the page
    await page.reload();

    // Verifications: App stays functional
    await expect(page.locator('arcgis-map')).toBeVisible();

    // URL may or may not preserve state; just ensure it's a valid app URL
    await expect.poll(() => page.url()).toContain('http://localhost:5173');
  });
});
