// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { drawPointOnMap, expandStep, navigateToApp, selectProduct, waitForResults } from '../fixtures/test-helpers';

test.describe('Accessibility Testing', () => {
  test('7.2 Screen Reader Compatibility (Automated Checks)', async ({ page }) => {
    // Note: Full screen reader validation requires manual testing. This automates ARIA role checks.

    await navigateToApp(page);

    // Verify step headers have button role and expected states
    const step1 = page.getByRole('button', { name: /Step 1 - Select Products/i });
    const step2 = page.getByRole('button', { name: /Step 2 - Define Area of/i });
    const step3 = page.getByRole('button', { name: /Step 3 - Results/i });
    const step4 = page.getByRole('button', { name: /Step 4 - Download/i });

    await expect(step1).toBeVisible();
    await expect(step1).toHaveAttribute('aria-expanded', 'true');
    await expect(step2).toBeDisabled();
    await expect(step3).toBeDisabled();
    await expect(step4).toBeDisabled();

    // Complete basic search to show results and verify ARIA treegrid roles
    await selectProduct(page, 'Aerial Photography');
    await expandStep(page, 'Step 2 - Define Area of');
    await drawPointOnMap(page);

    const treegrid = await waitForResults(page);
    await expect(treegrid).toBeVisible();

    // Verify rows and interactive buttons are present
    await expect(page.getByRole('row', { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Expand|Collapse/ }).first()).toBeVisible();
  });
});
