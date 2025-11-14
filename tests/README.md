# Playwright Test Organization

This directory contains end-to-end tests for the Raster Data Discovery application, organized by test category for better maintainability.

## Directory Structure

```
tests/
├── fixtures/              # Shared test utilities and helpers
│   └── test-helpers.ts    # Common functions, constants, and workflows
├── search/                # Search functionality tests
├── interaction/           # User interaction tests (click, hover, etc.)
├── edge-cases/            # Error handling and boundary condition tests
├── visual/                # Visual and UI tests
├── accessibility/         # Accessibility and keyboard navigation tests
├── responsive/            # Responsive design and viewport tests
├── performance/           # Performance and timing tests
└── state-management/      # Application state and persistence tests
```

## Shared Test Helpers

The `fixtures/test-helpers.ts` file provides reusable utilities to eliminate code duplication:

### Constants

- `BASE_URL` - Application base URL
- `CATEGORY_PATTERN` - Regex for matching product categories
- `TIMEOUTS` - Standardized timeout values for consistent waiting

### Navigation Functions

- `navigateToApp(page, queryParams?)` - Navigate to app with optional URL parameters
- `waitForMap(page)` - Wait for ArcGIS map to load

### Wizard Step Functions

- `selectProduct(page, productName)` - Select a product checkbox
- `expandStep(page, stepName)` - Expand a wizard step
- `verifyStepState(page, stepName, state)` - Verify step enabled/disabled/expanded/collapsed

### Search Functions

- `drawPointOnMap(page)` - Use point tool to define area of interest
- `searchByAddress(page, address)` - Search by address
- `waitForResults(page)` - Wait for search results to appear
- `completeBasicSearch(page, options)` - Complete full search workflow with options

### Product Interaction Functions

- `getCategoryRows(page)` - Get all category rows
- `expandCategory(page, categoryName)` - Expand a specific category
- `findProductWithPreview(page, maxCategoriesToCheck)` - Find a product with preview capability

## Usage Example

**Before refactoring:**

```typescript
test('Search for Aerial Photography', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('arcgis-map')).toBeVisible({ timeout: 10000 });

  const checkbox = page.getByRole('checkbox', { name: /Aerial Photography/i });
  await expect(checkbox).toBeVisible();
  await checkbox.click({ force: true });
  await expect(checkbox).toBeChecked();

  const step2Header = page.getByRole('button', { name: /Step 2 - Define Area of/i });
  await expect(step2Header).toBeEnabled();
  await step2Header.click();
  // ... 20+ more lines
});
```

**After refactoring:**

```typescript
import { completeBasicSearch } from '../fixtures/test-helpers';

test('Search for Aerial Photography', async ({ page }) => {
  await completeBasicSearch(page, { verifyStep1: true });

  // Your specific test assertions here
  await expect(page.getByRole('row', { name: /Aerial Photography/i })).toBeVisible();
});
```

## Benefits

1. **Reduced Duplication**: Common workflows are defined once and reused
2. **Consistent Timing**: Standardized timeouts prevent flaky tests
3. **Better Organization**: Tests grouped by category for easier navigation
4. **Easier Maintenance**: Changes to workflows only need updating in one place
5. **More Readable**: Tests focus on what's unique, not boilerplate

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in a specific category
pnpm test tests/search/
pnpm test tests/accessibility/

# Run a specific test file
pnpm test tests/search/basic-aerial-photography.spec.ts

# Run in UI mode for debugging
pnpm exec playwright test --ui
```

## Adding New Tests

1. **Determine the category** - Choose the appropriate subdirectory
2. **Import helpers** - Use shared utilities from `fixtures/test-helpers.ts`
3. **Focus on uniqueness** - Write only the test-specific logic
4. **Follow naming conventions** - Use descriptive file and test names

Example:

```typescript
import { test, expect } from '@playwright/test';
import { completeBasicSearch, expandCategory } from '../fixtures/test-helpers';

test.describe('My New Feature', () => {
  test('should do something specific', async ({ page }) => {
    await completeBasicSearch(page);

    // Your unique test logic
    await expandCategory(page, 'NAIP 2024');
    await expect(page.getByRole('button', { name: 'My Feature' })).toBeVisible();
  });
});
```
