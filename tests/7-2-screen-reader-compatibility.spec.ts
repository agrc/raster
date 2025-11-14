// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Accessibility Testing', () => {
  test('7.2 Screen Reader Compatibility (Automated Checks)', async ({ page }) => {
    // Note: Full screen reader validation requires manual testing. This automates ARIA role checks.

    // 1. Navigate to http://localhost:5173
    await page.goto('http://localhost:5173');

    // 2. Verify step headers have button role and expected states
    const step1 = page.getByRole('button', { name: /Step 1 - Select Products/i });
    const step2 = page.getByRole('button', { name: /Step 2 - Define Area of/i });
    const step3 = page.getByRole('button', { name: /Step 3 - Results/i });
    const step4 = page.getByRole('button', { name: /Step 4 - Download/i });

    await expect(step1).toBeVisible();
    await expect(step1).toHaveAttribute('aria-expanded', 'true');
    await expect(step2).toBeDisabled();
    await expect(step3).toBeDisabled();
    await expect(step4).toBeDisabled();

    // 3. Complete basic search to show results and verify ARIA treegrid roles
    await page.getByText('Aerial Photography').click();
    await step2.click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.getByRole('application').click();

    const treegrid = page.getByRole('treegrid', { name: 'search results' });
    await expect(treegrid).toBeVisible({ timeout: 15000 });

    // Verify rows and interactive buttons are present
    await expect(page.getByRole('row', { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Expand|Collapse/ }).first()).toBeVisible();
  });
});
