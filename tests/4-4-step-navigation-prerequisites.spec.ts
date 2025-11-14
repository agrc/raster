// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('4.4 Test Step Navigation Before Prerequisites', async ({ page }) => {
    // 1. Navigate to http://localhost:5173
    await page.goto('http://localhost:5173');

    // 2. Without selecting any product types, try to click Step 2 header
    const step2 = page.getByRole('button', { name: 'Step 2 - Define Area of' });
    await expect(step2).toBeDisabled();

    // 3. Try to click Step 3 header
    const step3 = page.getByRole('button', { name: 'Step 3 - Results' });
    await expect(step3).toBeDisabled();

    // 4. Try to click Step 4 header
    const step4 = page.getByRole('button', { name: 'Step 4 - Download' });
    await expect(step4).toBeDisabled();
  });
});
