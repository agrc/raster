// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('State Management and Persistence', () => {
  test('10.1 Test Step State Transitions', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 1. Select "Aerial Photography" and verify Step 2 enabled
    // Ensure Step 1 is expanded and toggle via label within the group
    const step1Header = page.getByRole('button', { name: 'Step 1 - Select Products' });
    await step1Header.click();
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();
    const step2 = page.getByRole('button', { name: 'Step 2 - Define Area of' });
    await expect(step2).toBeEnabled();

    // 2. Define AOI and verify Step 3 enabled
    await step2.click();
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(300);
    await page.getByRole('application').click();
    const step3 = page.getByRole('button', { name: 'Step 3 - Results' });
    await expect(step3).toBeEnabled();

    // 3. Deselect all product types (toggle off Aerial Photography)
    // Re-open Step 1 (if collapsed) and toggle the same label within Step 1
    await step1Header.click();
    await step1Group.getByText('Aerial Photography').click();

    // 4. Verify Step 2 and Step 3 disabled
    await expect(step2).toBeDisabled();
    await expect(step3).toBeDisabled();
  });
});
