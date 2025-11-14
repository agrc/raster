// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { drawPointOnMap, expandStep, navigateToApp, waitForResults } from '../fixtures/test-helpers';

test.describe('Category Filtering via URL Parameters', () => {
  test('5.1 Filter Aerial Photography to Specific Categories', async ({ page }) => {
    // Navigate with category filter
    await navigateToApp(page, 'catGroup=RGB,CIR');

    // Select "Aerial Photography" by clicking the label within Step 1
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();

    // Expand Step 2 and draw a point
    await expandStep(page, 'Step 2 - Define Area of');
    await drawPointOnMap(page);

    // Wait for results
    await waitForResults(page);

    // Verify filter notification link appears
    const link = page.getByRole('link', { name: /Want to search for more than/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/');
  });

  test('5.2 Verify Filter Link Appears in Results', async ({ page }) => {
    // Navigate with category filter
    await navigateToApp(page, 'catGroup=RGB,CIR');

    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();

    await expandStep(page, 'Step 2 - Define Area of');
    await drawPointOnMap(page);

    // Wait for results
    await waitForResults(page);

    // Locate the filter notification link in Step 3
    const filterLink = page.getByRole('link', { name: /Want to search for more than/i });
    await expect(filterLink).toBeVisible();
    await expect(filterLink).toHaveAttribute('href', '/');
  });
});
