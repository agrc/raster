// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { navigateToApp } from '../fixtures/test-helpers';

test.describe('Responsive Design Testing', () => {
  test('8.2 Test Drawer Behavior at Breakpoints', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1024, height: 900 });
    await navigateToApp(page);

    // Verify wizard is visible
    await expect(page.getByRole('button', { name: /Step 1 - Select Products/i })).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 812 });

    // Verify wizard remains accessible
    await expect(page.getByRole('button', { name: /Step 1 - Select Products/i })).toBeVisible();

    // Resize back to desktop
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.getByRole('button', { name: /Step 1 - Select Products/i })).toBeVisible();
  });
});
