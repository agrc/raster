// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers to reduce duplication

import { expect, test } from '@playwright/test';
import { CATEGORY_PATTERN, completeBasicSearch, getCategoryRows } from '../fixtures/test-helpers';

test.describe('Basic Aerial Photography Search', () => {
  test('1.1 Search for Aerial Photography in Salt Lake County Area', async ({ page }) => {
    await completeBasicSearch(page, { verifyStep1: true, verifyStep4Disabled: true });

    const aerialPhotoRow = page.getByRole('row', { name: /Aerial Photography/i }).first();
    await expect(aerialPhotoRow).toBeVisible();

    const categories = getCategoryRows(page);
    await expect(categories.first()).toBeVisible({ timeout: 5000 });
    expect(await categories.count()).toBeGreaterThan(0);

    await expect(page.getByText('No products found')).not.toBeVisible();
  });

  test('1.2 Verify Search Results Structure', async ({ page }) => {
    await completeBasicSearch(page);

    const aerialPhotoTree = page.getByRole('row', { name: /Aerial Photography/i }).first();
    await expect(aerialPhotoTree).toBeVisible();

    const categories = getCategoryRows(page);
    await expect(categories.first()).toBeVisible();
    expect(await categories.count()).toBeGreaterThan(0);

    const firstCategory = categories.first();
    await firstCategory.getByRole('button', { name: /Expand/i }).click();
    await page.waitForTimeout(500);

    const allRows = page.getByRole('row');
    expect(await allRows.count()).toBeGreaterThanOrEqual(2);

    const categoryText = await firstCategory.textContent();
    expect(categoryText).toMatch(CATEGORY_PATTERN);

    await expect(firstCategory.locator('..')).toBeVisible();
  });

  test('1.3 Verify Product Actions Are Available', async ({ page }) => {
    await completeBasicSearch(page);

    const productRows = getCategoryRows(page);
    const firstProduct = productRows.first();
    await expect(firstProduct).toBeVisible();

    await firstProduct.getByRole('button', { name: /Expand/i }).click();
    await page.waitForTimeout(500);

    const extentButton = page.getByRole('button', { name: /Extent/i }).first();
    await expect(extentButton).toBeVisible();

    const previewButton = page.getByRole('button', { name: /Preview/i }).first();
    const previewCount = await previewButton.count();
    if (previewCount > 0) {
      await expect(previewButton).toBeVisible();
    }

    const moreInfoButton = page.getByRole('button', { name: /more info/i }).first();
    await expect(moreInfoButton).toBeVisible();

    await expect(extentButton).toBeEnabled();

    if (previewCount > 0) {
      await expect(previewButton).toBeEnabled();
    }

    await expect(moreInfoButton).toBeEnabled();

    const downloadButton = page.getByRole('button', { name: /Download/i }).first();
    const downloadCount = await downloadButton.count();
    if (downloadCount > 0) {
      await expect(downloadButton).toBeVisible();
      await expect(downloadButton).toBeEnabled();
    }
  });
});
