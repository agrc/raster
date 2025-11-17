/**
 * Shared test helpers and utilities for Playwright tests
 */

import { expect, type Page } from '@playwright/test';

// Constants
export const BASE_URL = 'http://localhost:5173';
export const CATEGORY_PATTERN = /NAIP|HRO|DOQ|Historical/i;

// Timeouts
export const TIMEOUTS = {
  MAP_LOAD: 30000,
  TOOL_ACTIVATION: 300,
  ANIMATION: 500,
  POINT_PLACEMENT: 1000,
  RESULTS_LOAD: 15000,
  ADDRESS_GEOCODE: 20000,
} as const;

/**
 * Wait for the map to be fully loaded and visible
 */
export async function waitForMap(page: Page) {
  // Wait for both DOM and web component initialization
  await expect(page.locator('arcgis-map')).toBeVisible({ timeout: TIMEOUTS.MAP_LOAD });
  // Ensure map view is actually ready, not just visible
  await page.waitForFunction(
    () => {
      const map = document.querySelector('arcgis-map');
      return map && (map as any).view?.ready;
    },
    { timeout: TIMEOUTS.MAP_LOAD },
  );
}

/**
 * Navigate to the app with optional query parameters
 */
export async function navigateToApp(page: Page, queryParams?: string) {
  const url = queryParams ? `${BASE_URL}/?${queryParams}` : BASE_URL;
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await waitForMap(page);
}

/**
 * Select a product type by clicking its label
 */
export async function selectProduct(page: Page, productName: string) {
  const checkbox = page.getByRole('checkbox', { name: new RegExp(productName, 'i') });
  await expect(checkbox).toBeVisible();
  await checkbox.click({ force: true });
  await expect(checkbox).toBeChecked();
}

/**
 * Expand a wizard step by its name
 */
export async function expandStep(page: Page, stepName: string) {
  const stepHeader = page.getByRole('button', { name: new RegExp(stepName, 'i') });
  await expect(stepHeader).toBeEnabled();
  await stepHeader.click();
  await expect(stepHeader).toHaveAttribute('aria-expanded', 'true');
  await page.waitForTimeout(TIMEOUTS.ANIMATION);
}

/**
 * Draw a point on the map using the point drawing tool
 */
export async function drawPointOnMap(page: Page) {
  await page.getByRole('button', { name: 'Draw a point' }).click();
  await page.waitForTimeout(TIMEOUTS.TOOL_ACTIVATION);
  await page.getByRole('application').click();
  await page.waitForTimeout(TIMEOUTS.POINT_PLACEMENT);
}

/**
 * Wait for search results to load and be visible
 */
export async function waitForResults(page: Page) {
  const resultsGrid = page.getByRole('treegrid', { name: 'search results' }).first();
  await expect(resultsGrid).toBeVisible({ timeout: TIMEOUTS.RESULTS_LOAD });
  return resultsGrid;
}

/**
 * Search by address in Step 2
 */
export async function searchByAddress(page: Page, address: string) {
  const step2Group = page.getByRole('group', { name: 'Step 2 - Define Area of Interest' });
  const searchInput = step2Group.getByRole('searchbox', { name: 'Search' });
  await searchInput.fill(address);
  await searchInput.press('Enter');
}

/**
 * Complete the full basic search workflow
 */
export type BasicSearchOptions = {
  verifyStep1?: boolean;
  verifyStep4Disabled?: boolean;
  products?: string[];
  useAddress?: string;
};

export async function completeBasicSearch(page: Page, options: BasicSearchOptions = {}) {
  const { verifyStep1 = false, verifyStep4Disabled = false, products = ['Aerial Photography'], useAddress } = options;

  await navigateToApp(page);

  // Step 1 - Select Products
  const step1Header = page.getByRole('button', { name: /Step 1 - Select Products/i });
  if (verifyStep1) {
    await expect(step1Header).toBeVisible();
    await expect(step1Header).toHaveAttribute('aria-expanded', 'true');
  }

  for (const product of products) {
    await selectProduct(page, product);
  }

  // Step 2 - Define Area of Interest
  await expandStep(page, 'Step 2 - Define Area of');

  if (useAddress) {
    await searchByAddress(page, useAddress);
  } else {
    await drawPointOnMap(page);
  }

  // Step 3 - Results
  const step3Header = page.getByRole('button', { name: /Step 3 - Results/i });
  await expect(step3Header).toHaveAttribute('aria-expanded', 'true', { timeout: TIMEOUTS.RESULTS_LOAD });
  await waitForResults(page);

  // Optional Step 4 verification
  if (verifyStep4Disabled) {
    const step4Header = page.getByRole('button', { name: /Step 4 - Download/i });
    await expect(step4Header).toBeDisabled();
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Get all category rows matching the common pattern
 */
export function getCategoryRows(page: Page) {
  return page.getByRole('row').filter({ hasText: CATEGORY_PATTERN });
}

/**
 * Expand a category by name or get the first available category
 */
export async function expandCategory(page: Page, categoryName?: string) {
  if (categoryName) {
    const expandButton = page.getByRole('button', { name: new RegExp(`Expand ${categoryName}`, 'i') });
    await expandButton.click();
    await page.waitForTimeout(TIMEOUTS.ANIMATION);
  } else {
    // Expand first available category
    const firstExpandButton = page.getByRole('button', { name: /Expand / }).first();
    await firstExpandButton.click();
    await page.waitForTimeout(TIMEOUTS.ANIMATION);
  }
}

/**
 * Find a product with a Preview button
 */
export async function findProductWithPreview(page: Page, maxCategoriesToCheck = 6) {
  const categories = getCategoryRows(page);
  await expect(categories.first()).toBeVisible();

  let previewButton = page.getByRole('button', { name: 'Preview', exact: true }).first();
  let previewCount = await previewButton.count();

  const maxToCheck = Math.min(await categories.count(), maxCategoriesToCheck);
  for (let i = 0; i < maxToCheck && previewCount === 0; i++) {
    const cat = categories.nth(i);
    const expandBtn = cat.getByRole('button', { name: /Expand/i });
    if (await expandBtn.isVisible()) {
      await expandBtn.click();
      await page.waitForTimeout(TIMEOUTS.ANIMATION);
    }
    previewButton = page.getByRole('button', { name: 'Preview', exact: true }).first();
    previewCount = await previewButton.count();
  }

  return { previewButton, found: previewCount > 0 };
}

/**
 * Verify common wizard step states
 */
export async function verifyStepState(
  page: Page,
  stepName: string,
  state: 'enabled' | 'disabled' | 'expanded' | 'collapsed',
) {
  const stepButton = page.getByRole('button', { name: new RegExp(stepName, 'i') });

  switch (state) {
    case 'enabled':
      await expect(stepButton).toBeEnabled();
      break;
    case 'disabled':
      await expect(stepButton).toBeDisabled();
      break;
    case 'expanded':
      await expect(stepButton).toHaveAttribute('aria-expanded', 'true');
      break;
    case 'collapsed':
      await expect(stepButton).toHaveAttribute('aria-expanded', 'false');
      break;
  }
}
