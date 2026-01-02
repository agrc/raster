/**
 * Tests for the bulk download feature that allows users to copy
 * download commands for various tools (wget, curl, aria2c)
 */

import { expect, test } from '@playwright/test';
import { completeBasicSearch, expandCategory } from '../fixtures/test-helpers';

test.describe('Bulk Download Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Complete basic search and navigate to Step 4 - Download
    await completeBasicSearch(page);
    await expandCategory(page);

    const downloadButton = page.getByRole('button', { name: 'Download', exact: true });
    await downloadButton.click();

    // Wait for download step to be expanded
    const step4Button = page.getByRole('button', { name: 'Step 4 - Download' });
    await expect(step4Button).toHaveAttribute('aria-expanded', 'true');

    // Wait for tiles to load (the bulk download UI only appears when tiles are loaded)
    await expect(page.getByRole('radiogroup', { name: 'Bulk download snippet' })).toBeVisible({ timeout: 15000 });
  });

  test('displays bulk download tool selection with all options', async ({ page }) => {
    // Verify RadioGroup is visible
    const radioGroup = page.getByRole('radiogroup', { name: 'Bulk download snippet' });
    await expect(radioGroup).toBeVisible();

    // Verify all tool options are present
    await expect(page.getByRole('radio', { name: 'curl' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'wget' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'aria2c' })).toBeVisible();

    // Verify curl is selected by default
    await expect(page.getByRole('radio', { name: 'curl' })).toBeChecked();
  });

  test('displays copy button with tile count', async ({ page }) => {
    // Verify copy button shows the count
    const copyButton = page.getByRole('button', { name: /Copy command to download \d+ tiles?/ });
    await expect(copyButton).toBeVisible();
  });

  test('allows switching between download tools', async ({ page }) => {
    // Use label text instead of radio role to avoid click interception issues
    await page.getByText('wget', { exact: true }).click();
    await expect(page.getByRole('radio', { name: 'wget' })).toBeChecked();
    await expect(page.getByRole('radio', { name: 'curl' })).not.toBeChecked();

    await page.getByText('aria2c', { exact: true }).click();
    await expect(page.getByRole('radio', { name: 'aria2c' })).toBeChecked();
  });

  // Clipboard tests only run on Chromium - WebKit doesn't support clipboard permissions
  test('copies curl command to clipboard and shows feedback', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions not supported in WebKit');

    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Ensure curl is selected (default)
    await expect(page.getByRole('radio', { name: 'curl' })).toBeChecked();

    // Click copy button
    const copyButton = page.getByRole('button', { name: /Copy command to download \d+ tiles?/ });
    await copyButton.click();

    // Verify "Copied!" feedback appears
    await expect(page.getByRole('button', { name: /Copied!/ })).toBeVisible();

    // Verify clipboard contains curl command
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toMatch(/^curl(?:\.exe)? -O "https?:\/\/.+/);

    // Wait for feedback to reset
    await page.waitForTimeout(2500);
    await expect(page.getByRole('button', { name: /Copy command to download \d+ tiles?/ })).toBeVisible();
  });

  test('copies wget command with quotes to clipboard', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions not supported in WebKit');

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Select wget using label text
    await page.getByText('wget', { exact: true }).click();

    // Click copy button
    await page.getByRole('button', { name: /Copy command to download \d+ tiles?/ }).click();

    // Verify clipboard contains wget command with quoted URLs
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toMatch(/^wget "https?:\/\/.+/);
  });

  test('copies aria2c command to clipboard', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions not supported in WebKit');

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Select aria2c using label text
    await page.getByText('aria2c', { exact: true }).click();

    // Click copy button
    await page.getByRole('button', { name: /Copy command to download \d+ tiles?/ }).click();

    // Verify clipboard contains aria2c command with -Z flag
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toMatch(/^aria2c -Z "https?:\/\/.+/);
  });

  test('retains selected tool after copying', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Clipboard permissions not supported in WebKit');

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Select aria2c using label text
    await page.getByText('aria2c', { exact: true }).click();

    // Click copy button
    await page.getByRole('button', { name: /Copy command to download \d+ tiles?/ }).click();

    // Wait for feedback to reset
    await page.waitForTimeout(2500);

    // Verify aria2c is still selected
    await expect(page.getByRole('radio', { name: 'aria2c' })).toBeChecked();
  });
});
