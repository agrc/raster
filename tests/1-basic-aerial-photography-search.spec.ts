// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const CATEGORY_PATTERN = /NAIP|HRO|DOQ|Historical/i;

type BasicSearchOptions = {
  verifyStep1?: boolean;
  verifyStep4Disabled?: boolean;
};

const completeBasicSearch = async (page: Page, options: BasicSearchOptions = {}) => {
  const { verifyStep1 = false, verifyStep4Disabled = false } = options;

  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });

  const step1Header = page.getByRole('button', { name: /Step 1 - Select Products/i });
  if (verifyStep1) {
    await expect(step1Header).toBeVisible();
    await expect(step1Header).toHaveAttribute('aria-expanded', 'true');
  }

  const aerialPhotoCheckbox = page.getByRole('checkbox', { name: /Aerial Photography/i });
  await expect(aerialPhotoCheckbox).toBeVisible();
  await aerialPhotoCheckbox.click({ force: true });
  await expect(aerialPhotoCheckbox).toBeChecked();

  const step2Header = page.getByRole('button', { name: /Step 2 - Define Area of/i });
  await expect(step2Header).toBeEnabled();
  await step2Header.click();
  await expect(step2Header).toHaveAttribute('aria-expanded', 'true');
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Draw a point' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('application').click();
  await page.waitForTimeout(1000);

  const step3Header = page.getByRole('button', { name: /Step 3 - Results/i });
  await expect(step3Header).toHaveAttribute('aria-expanded', 'true', { timeout: 5000 });
  await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });

  if (verifyStep4Disabled) {
    const step4Header = page.getByRole('button', { name: /Step 4 - Download/i });
    await expect(step4Header).toBeDisabled();
  }

  await page.waitForLoadState('networkidle');
};

const getCategoryRows = (page: Page) => page.getByRole('row').filter({ hasText: CATEGORY_PATTERN });

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
