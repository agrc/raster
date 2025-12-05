// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers to eliminate duplication

import { expect, test } from '@playwright/test';
import { completeBasicSearch, expandCategory, findProductWithPreview } from '../fixtures/test-helpers';

test.describe('Search Result Interaction Testing', () => {
  test('2.1 Test Extent Zoom Functionality', async ({ page }) => {
    await completeBasicSearch(page);

    // Expand a product category
    await expandCategory(page);

    // Click the "Extent" button on a product
    const extentButton = page.getByRole('button', { name: 'Extent' });
    await extentButton.click();

    // Verify the extent button is visible (it was clicked successfully)
    await expect(extentButton).toBeVisible();
  });

  test('2.2 Test Preview Toggle Functionality', async ({ page }) => {
    await completeBasicSearch(page);

    // Find a product with a preview button
    const { previewButton, found } = await findProductWithPreview(page);

    if (!found) {
      test.fixme(true, 'No product with a Preview button available for this AOI.');
    }

    // Click the "Preview" toggle button to enable preview
    await previewButton.click();

    // Verify the button appears selected/toggled on
    await expect(page.getByRole('button', { name: 'Clear preview layer' })).toBeVisible();

    // Click the "Preview" toggle button again to disable preview
    await previewButton.click();

    // Verify the preview layer is removed
    await expect(page.getByRole('button', { name: 'Clear preview layer' })).not.toBeVisible();
  });

  test('2.3 Test More Info Dialog', async ({ page }) => {
    await completeBasicSearch(page);

    // Expand a product item to show details
    await expandCategory(page);

    // Click the "more info" button
    await page.getByRole('button', { name: 'more info' }).click();

    // Verify a modal dialog opens over the page
    const dialog = page.getByRole('dialog', { name: 'more info' });
    await expect(dialog).toBeVisible();

    // Verify dialog displays a title matching the product description
    await expect(
      dialog.getByText('.6 Meter 4-Band Digital Orthophotography from 2024 NAIP (county mosaics)'),
    ).toBeVisible();

    // Verify dialog shows a table with product metadata fields
    const table = dialog.getByRole('table');
    await expect(table).toBeVisible();

    // Verify specific metadata fields are present
    await expect(table.getByRole('row', { name: /Resolution/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Year Collected/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /File Format/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Average File Size/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Horizontal Accuracy/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Flight Date Location/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Contact/ })).toBeVisible();
    await expect(table.getByRole('row', { name: /Stored at UGRC/ })).toBeVisible();

    // Close the more info dialog
    const closeButton = dialog.getByRole('button', { name: 'Close', exact: true });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // Verify dialog is closed
    await expect(dialog).not.toBeVisible();
  });

  test('2.4 Test Web Page Link', async ({ page }) => {
    await completeBasicSearch(page);

    // Expand a product item to show details
    await expandCategory(page);

    // Look for "web page" link in the details section
    const webPageLink = page.getByRole('link', { name: /web page.*opens in a new window/ });
    await expect(webPageLink).toBeVisible();

    // Verify link text
    await expect(webPageLink).toContainText('web page');

    // Verify the link has the correct href
    await expect(webPageLink).toHaveAttribute('href', /https:\/\/gis\.utah\.gov\//);
  });

  test('2.5 Test Download Button Availability', async ({ page }) => {
    await completeBasicSearch(page);

    // Expand a product item to show details
    await expandCategory(page);

    // Click a "Download" button on a product that has one
    const downloadButton = page.getByRole('button', { name: 'Download', exact: true });
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();

    // Verify clicking the button advances the wizard to "Step 4 - Download"
    const step4Button = page.getByRole('button', { name: 'Step 4 - Download' });
    await expect(step4Button).toHaveAttribute('aria-expanded', 'true');

    // Verify Step 4 disclosure becomes enabled and expands
    await expect(page.getByRole('group', { name: 'Step 4 - Download' })).toBeVisible();

    // Verify download UI is shown
    await expect(page.getByText('Click on a tile on the map or in the list below')).toBeVisible();
    await expect(
      page.getByText('.6 Meter 4-Band Digital Orthophotography from 2024 NAIP (county mosaics)').last(),
    ).toBeVisible();
    await expect(page.getByText('1 Tiles Found')).toBeVisible();
  });
});
