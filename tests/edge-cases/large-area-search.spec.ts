// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { expandStep, navigateToApp, TIMEOUTS, waitForMap } from '../fixtures/test-helpers';

test.describe('Edge Cases and Error Handling', () => {
  test('4.2 Search with Very Large Area of Interest', async ({ page }) => {
    await navigateToApp(page);

    // Select product via Step 1 group for reliability
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();

    // Expand Step 2
    await expandStep(page, 'Step 2 - Define Area of');

    // Choose "Draw a rectangle"
    await page.getByRole('button', { name: 'Draw a rectangle' }).click();
    await page.waitForTimeout(TIMEOUTS.TOOL_ACTIVATION);

    // Drag to draw a very large rectangle covering most of the viewport
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

    // Wait for results with extended timeout
    await expect(page.getByRole('treegrid', { name: 'search results' }).first()).toBeVisible({ timeout: 20000 });

    // UI remains responsive
    await waitForMap(page);
  });
});
