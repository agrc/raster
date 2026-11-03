// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { completeBasicSearch, getCategoryRows } from '../fixtures/test-helpers';

test.describe('Accessibility Testing', () => {
  test('7.1 Keyboard Navigation Through Results', async ({ page }) => {
    await completeBasicSearch(page);

    // Focus within the results area
    const resultsGrid = page.getByRole('treegrid', { name: 'search results' });
    await resultsGrid.click();

    // Use keyboard to expand a category
    const categoryRow = getCategoryRows(page).first();
    const wasExpanded = (await categoryRow.getAttribute('aria-expanded')) === 'true';
    const expandBtn = categoryRow.getByRole('button', { name: /^Toggle / });
    await expandBtn.focus();
    await page.keyboard.press('Enter');

    await expect(categoryRow).toHaveAttribute('aria-expanded', String(!wasExpanded));
  });
});
