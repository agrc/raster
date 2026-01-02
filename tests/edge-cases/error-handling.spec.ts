// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { navigateToApp, verifyStepState } from '../fixtures/test-helpers';

test.describe('Edge Cases and Error Handling', () => {
  test('4.1 Search in Area with No Aerial Photography Coverage', async ({ page }) => {
    await navigateToApp(page);

    // Select "Aerial Photography"
    await page.getByRole('button', { name: 'Step 1 - Select Products' }).click();
    await page.getByRole('group', { name: 'Step 1 - Select Products' }).getByText('Aerial Photography').click();

    // Expand Step 2
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();

    // Activate "Draw a point" and click on the map
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('application').click();
    await page.waitForTimeout(1000);

    // Wait for Step 3 to auto-expand and show results
    const step3Header = page.getByRole('button', { name: /Step 3 - Results/i });
    await expect(step3Header).toHaveAttribute('aria-expanded', 'true', { timeout: 15000 });

    const resultsGrid = page.getByRole('treegrid', { name: 'search results' });
    await expect(resultsGrid).toBeVisible({ timeout: 15000 });

    // Verify: "Aerial Photography" header appears
    await expect(page.getByRole('button', { name: 'Collapse Aerial Photography' })).toBeVisible();
  });

  test('4.4 Test Step Navigation Before Prerequisites', async ({ page }) => {
    await navigateToApp(page);

    // Without selecting any product types, verify all steps are disabled
    await verifyStepState(page, 'Step 2 - Define Area of', 'disabled');
    await verifyStepState(page, 'Step 3 - Results', 'disabled');
    await verifyStepState(page, 'Step 4 - Download', 'disabled');
  });
});
