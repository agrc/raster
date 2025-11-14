// spec: tests/aerial-photography-search-test-plan.md
// Refactored: Uses shared test helpers

import { test } from '@playwright/test';
import { drawPointOnMap, expandStep, navigateToApp, verifyStepState } from '../fixtures/test-helpers';

test.describe('State Management and Persistence', () => {
  test('10.1 Test Step State Transitions', async ({ page }) => {
    await navigateToApp(page);

    // Select "Aerial Photography" and verify Step 2 enabled
    const step1Header = page.getByRole('button', { name: 'Step 1 - Select Products' });
    await step1Header.click();
    const step1Group = page.getByRole('group', { name: 'Step 1 - Select Products' });
    await step1Group.getByText('Aerial Photography').click();

    await verifyStepState(page, 'Step 2 - Define Area of', 'enabled');

    // Define AOI and verify Step 3 enabled
    await expandStep(page, 'Step 2 - Define Area of');
    await drawPointOnMap(page);

    await verifyStepState(page, 'Step 3 - Results', 'enabled');

    // Deselect all product types
    await step1Header.click();
    await step1Group.getByText('Aerial Photography').click();

    // Verify Step 2 and Step 3 disabled
    await verifyStepState(page, 'Step 2 - Define Area of', 'disabled');
    await verifyStepState(page, 'Step 3 - Results', 'disabled');
  });
});
