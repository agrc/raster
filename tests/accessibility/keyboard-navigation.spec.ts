// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { completeBasicSearch } from '../fixtures/test-helpers';

test.describe('Accessibility Testing', () => {
  test('7.1 Keyboard Navigation Through Results', async ({ page }) => {
    await completeBasicSearch(page);

    // Focus within the results area
    const resultsGrid = page.getByRole('treegrid', { name: 'search results' });
    await resultsGrid.click();

    // Use keyboard to expand a category
    const expandBtn = page.getByRole('button', { name: /Expand / }).first();
    await expandBtn.focus();
    await page.keyboard.press('Enter');

    // Verify expanded state by locating corresponding Collapse button
    const collapseBtn = page.getByRole('button', { name: /Collapse / }).first();
    await expect(collapseBtn).toBeVisible();
  });
});
