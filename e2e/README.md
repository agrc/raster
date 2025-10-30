# End-to-End Tests

This directory contains Playwright end-to-end tests for the UGRC Raster Data Discovery application.

## Test Structure

The E2E tests are organized by product type, with each test file covering a complete workflow for a specific product type:

- `aerial-photography.spec.ts` - Tests for Aerial Photography products
- `lidar.spec.ts` - Tests for Lidar DEMs
- `usgs-dem.spec.ts` - Tests for USGS DEMs
- `auto-correlated-dem.spec.ts` - Tests for Auto-Correlated DEMs
- `contours.spec.ts` - Tests for Contours
- `drg.spec.ts` - Tests for USGS Topo Maps (DRG)
- `app.spec.ts` - General application tests (loading, responsiveness, wizard flow)

## Running Tests

### Prerequisites

Before running E2E tests, ensure you have:
1. Installed all dependencies: `pnpm install`
2. Installed Playwright browsers: `pnpm exec playwright install chromium`
3. Set up environment variables (optional for local development):
   - `VITE_DISCOVER` - Quad-word token for UGRC Discover services
   - `VITE_FIREBASE_CONFIG` - Firebase configuration JSON

### Run All Tests

```bash
pnpm test:e2e
```

This will:
1. Start the development server automatically
2. Run all E2E tests in headless mode
3. Generate an HTML report

### Run Tests in UI Mode

For interactive debugging and development:

```bash
pnpm test:e2e:ui
```

### Run Tests in Headed Mode

To see the browser while tests run:

```bash
pnpm test:e2e:headed
```

### Run Specific Test File

```bash
pnpm exec playwright test e2e/aerial-photography.spec.ts
```

## Test Coverage

Each product type test covers:

1. **Complete Workflow**
   - Select product type (Step 1)
   - Define area of interest via address search (Step 2)
   - View search results (Step 3)
   - Preview products on map (where applicable)
   - Download workflow (Step 4, where applicable)

2. **Product-Specific Features**
   - Category filtering (e.g., RGB, CIR for aerial photography)
   - Metadata field verification (e.g., Year Collected, Vertical Accuracy for lidar)
   - Multiple product type selection

The `app.spec.ts` file covers:
- Application loading and basic UI elements
- Wizard flow and step dependencies
- Responsive design (desktop and mobile)
- Map interactions

## Writing New Tests

When adding new E2E tests:

1. Follow the existing test structure and naming conventions
2. Use descriptive test names that explain what is being tested
3. Include appropriate waits for dynamic content (e.g., `waitForTimeout`, `toBeVisible`)
4. Use accessible selectors (roles, labels) when possible
5. Keep tests focused on user workflows rather than implementation details

## CI/CD Integration

E2E tests run automatically in GitHub Actions on every pull request:

- Tests run in a headless Chromium browser
- The development server starts automatically before tests run
- Test results and artifacts are uploaded for failed runs
- Tests must pass before deployment

## Debugging Failed Tests

When tests fail:

1. Check the HTML report: `pnpm exec playwright show-report`
2. Review screenshots captured on failure
3. Use trace viewer for detailed debugging: `pnpm exec playwright show-trace`
4. Run tests in UI mode to step through interactively

## Configuration

E2E test configuration is in `playwright.config.ts`:

- Test directory: `./e2e`
- Base URL: `http://localhost:5173` (can be overridden with `BASE_URL` env var)
- Timeout: 30 seconds per test (default)
- Retries: 2 on CI, 0 locally
- Browser: Chromium only (can be extended to other browsers)

## Tips

- Tests use real network calls to ArcGIS services, so test execution time may vary based on network conditions
- Address searches use actual addresses in Utah for realistic testing
- The application requires ArcGIS assets to be present; run `pnpm copy:arcgis` if tests fail with asset-related errors
