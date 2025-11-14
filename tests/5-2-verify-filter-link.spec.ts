// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Category Filtering via URL Parameters', () => {
  test('5.2 Verify Filter Link Appears in Results', async ({ page }) => {
    // 1. Navigate with categories filter and prepare results (subset of 5.1)
    await page.goto('http://localhost:5173/?catGroup=RGB,CIR');
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('application').click();

    // 2. Wait for results
    await expect(page.getByRole('treegrid', { name: 'search results' })).toBeVisible({ timeout: 15000 });

    // 3. Locate the filter notification link in Step 3
    const linkText = 'Want to search for more than RGB, CIR?';
    const filterLink = page.getByRole('link', { name: /Want to search for more than/i });
    await expect(filterLink).toBeVisible();

    // Verify link href
    await expect(filterLink).toHaveAttribute('href', '/');
  });
});
