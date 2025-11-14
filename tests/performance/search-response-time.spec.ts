// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { expect, test } from '@playwright/test';
import { expandStep, navigateToApp, selectProduct, TIMEOUTS, waitForResults } from '../fixtures/test-helpers';

test.describe('Performance Testing', () => {
  test('9.1 Measure Search Response Time', async ({ page }) => {
    await navigateToApp(page);
    await selectProduct(page, 'Aerial Photography');
    await expandStep(page, 'Step 2 - Define Area of');
    await page.getByRole('button', { name: 'Draw a point' }).click();
    await page.waitForTimeout(TIMEOUTS.TOOL_ACTIVATION);

    const start = Date.now();
    await page.getByRole('application').click();

    await waitForResults(page);
    const elapsed = Date.now() - start;

    // Assert under 10 seconds; logs actual value for reference
    expect(elapsed).toBeLessThanOrEqual(10000);
    console.log(`Search response time: ${elapsed}ms`);
  });
});
