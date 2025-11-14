// spec: tests/aerial-photography-search-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Performance Testing', () => {
  test('9.1 Measure Search Response Time', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByText('Aerial Photography').click();
    await page.getByRole('button', { name: 'Step 2 - Define Area of' }).click();
    await page.getByRole('button', { name: 'Draw a point' }).click();

    const start = Date.now();
    await page.getByRole('application').click();

    const results = page.getByRole('treegrid', { name: 'search results' });
    await expect(results).toBeVisible({ timeout: 15000 });
    const elapsed = Date.now() - start;

    // Assert under 10 seconds; logs actual value for reference
    expect(elapsed).toBeLessThanOrEqual(10000);
    // eslint-disable-next-line no-console
    console.log(`Search response time: ${elapsed}ms`);
  });
});
