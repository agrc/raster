// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('4.2 Search with Very Large Area of Interest', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    await page.goto('http://localhost:5173');

    // 2. Select "Aerial Photography" via label within Step 1 group for reliability
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();

    // 3. Expand Step 2
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();

    // 4. Choose "Draw a rectangle"
    await page.getByRole('button', { name: 'Draw a rectangle' }).click();
    await page.waitForTimeout(300);

    // 5. Drag to draw a very large rectangle covering most of the viewport
    // Use viewport-relative coordinates to draw across the map
    // Draw within the map application's bounding box to avoid drawer overlap
    const app = page.getByRole('application');
    const box = await app.boundingBox();
    if (!box) throw new Error('Map application bounding box not found');
    const startX = Math.floor(box.x + box.width * 0.15);
    const startY = Math.floor(box.y + box.height * 0.25);
    const endX = Math.floor(box.x + box.width * 0.85);
    const endY = Math.floor(box.y + box.height * 0.75);

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();

    // 6. Wait for Step 3 results
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 20000 });

    // UI remains responsive
    await expect(page.locator('arcgis-map')).toBeVisible();
  });
});
