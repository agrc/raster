// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Responsive Design Testing', () => {
  test('8.2 Test Drawer Behavior at Breakpoints', async ({ page }) => {
    // 1. Desktop viewport
    await page.setViewportSize({ width: 1024, height: 900 });

    // 2. Navigate to http://localhost:5173
    await page.goto('http://localhost:5173');

    // 3. Verify wizard is visible
    await expect(page.getByRole('button', { name: /Step 1 - Select Products/i })).toBeVisible();

    // 4. Resize to mobile
    await page.setViewportSize({ width: 375, height: 812 });

    // 5. Verify wizard remains accessible (Step 1 header visible)
    await expect(page.getByRole('button', { name: /Step 1 - Select Products/i })).toBeVisible();

    // 6. Resize back to desktop
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.getByRole('button', { name: /Step 1 - Select Products/i })).toBeVisible();
  });
});
