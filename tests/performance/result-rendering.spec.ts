// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { expandStep, navigateToApp, TIMEOUTS } from '../fixtures/test-helpers';

test.describe('Performance Testing', () => {
  test('9.2 Test Result Rendering Performance', async ({ page }) => {
    await navigateToApp(page);

    // Select product and expand Step 2
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();

    await expandStep(page, 'Step 2 - Define Area of');

    // Choose rectangle tool
    await page.getByRole('button', { name: 'Draw a rectangle' }).click();
    await page.waitForTimeout(TIMEOUTS.TOOL_ACTIVATION);

    // Draw large rectangle entirely within the map application bounds
    const app = page.getByRole('application');
    const box = await app.boundingBox();
    if (!box) throw new Error('Map application bounding box not found');
    const sx = Math.floor(box.x + box.width * 0.2);
    const sy = Math.floor(box.y + box.height * 0.3);
    const ex = Math.floor(box.x + box.width * 0.8);
    const ey = Math.floor(box.y + box.height * 0.7);
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(ex, ey);
    await page.mouse.up();

    const grid = page.getByRole('treegrid', { name: 'search results' }).first();
    await expect(grid).toBeVisible({ timeout: 20000 });

    // Measure time to expand first visible category
    const expandBtn = page.getByRole('button', { name: /Expand / }).first();
    const startExpand = Date.now();
    await expandBtn.click();
    await expect(page.getByRole('row', { level: 3 }).first()).toBeVisible({ timeout: 10000 });
    const expandElapsed = Date.now() - startExpand;
    expect(expandElapsed).toBeLessThanOrEqual(3000);

    // Measure time to collapse
    const collapseBtn = page.getByRole('button', { name: /Collapse / }).first();
    const startCollapse = Date.now();
    await collapseBtn.click();
    await expect(page.getByRole('row', { level: 3 })).toHaveCount(0);
    const collapseElapsed = Date.now() - startCollapse;
    expect(collapseElapsed).toBeLessThanOrEqual(3000);

    // Log timings for reference
    console.log(`Expand: ${expandElapsed}ms, Collapse: ${collapseElapsed}ms`);
  });
});
