// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { completeBasicSearch, expandCategory } from '../fixtures/test-helpers';

test.describe('Visual and Interaction Testing', () => {
  test('6.1 Test Product Hover Highlighting', async ({ page }) => {
    await completeBasicSearch(page);

    // Expand a category to show products
    await expandCategory(page);

    // Move mouse over a product item without clicking
    const firstProductRow = page.getByRole('row', { level: 3 }).first();
    await expect(firstProductRow).toBeVisible();
    await firstProductRow.hover();

    // Verify: "Extent" button is visible on hover (proxy for hover state)
    const extentButton = page.getByRole('button', { name: 'Extent' }).first();
    await expect(extentButton).toBeVisible();

    // Map remains responsive
    await expect(page.locator('arcgis-map')).toBeVisible();
  });
});
