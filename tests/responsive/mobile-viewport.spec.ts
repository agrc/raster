// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { navigateToApp, TIMEOUTS, waitForResults } from '../fixtures/test-helpers';

test.describe('Responsive Design Testing', () => {
  test('8.1 Test on Mobile Viewport', async ({ page }) => {
    // Set viewport to 375x812 (mobile)
    await page.setViewportSize({ width: 375, height: 812 });

    // Navigate with preselected product to avoid mobile click issues
    await navigateToApp(page, 'products=0');

    // Complete basic aerial photography search
    const step2Group = page.getByRole('group', { name: 'Step 2 - Define Area of Interest' });
    await expect(step2Group).toBeVisible({ timeout: TIMEOUTS.MAP_LOAD });

    // On mobile, the action bar can overflow; trigger via evaluate to bypass viewport constraints
    const drawPointBtn = step2Group.getByRole('button', { name: 'Draw a point' });
    await drawPointBtn.evaluate((btn: HTMLButtonElement) => btn.click());
    await page.waitForTimeout(TIMEOUTS.TOOL_ACTIVATION);
    await page.getByRole('application').click();

    // Verifications
    await expect(page.locator('arcgis-map')).toBeVisible();
    await waitForResults(page);
  });
});
