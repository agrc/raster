# Test Plan

## Application Overview

The UGRC Raster Data Discovery application is a React-based single-page application that allows users to search for and download various types of Utah raster datasets, including aerial photography, Lidar DEMs, USGS DEMs, auto-correlated DEMs, contours, and USGS topo maps. The application uses a wizard-based workflow with four steps:

1. **Step 1 - Select Products**: Users select one or more product types they're interested in
2. **Step 2 - Define Area of Interest**: Users define a geographic area using point, line, or polygon drawing tools
3. **Step 3 - Results**: Search results are displayed hierarchically by product type > category > individual products
4. **Step 4 - Download**: Users can select tiles for download (for products stored at UGRC)

### Key Features

- **Product Selection**: Checkbox-based selection with tooltip help text
- **Area of Interest**: Interactive map drawing tools
- **Search Results**: Hierarchical tree structure showing:
  - Product Type (Aerial Photography)
  - Categories (e.g., RGB, CIR, Single, B&W)
  - Individual Products with descriptions and dates
- **Product Actions**: Extent zoom, preview toggle, more info, web page links, download
- **Result Filtering**: Can filter by specific categories via URL parameters

## Test Scenarios

### 1. Basic Aerial Photography Search

**Objective**: Verify that selecting aerial photography and defining an area returns product results.

#### 1.1 Search for Aerial Photography in Salt Lake County Area

**Steps:**

1. Navigate to `http://localhost:5173`
2. Wait for the page to load completely (map view initialized)
3. Verify "Step 1 - Select Products" disclosure is expanded by default
4. Locate the "Aerial Photography" checkbox
5. Click on the "Aerial Photography" checkbox to select it
6. Verify the checkbox is now checked
7. Click on "Step 2 - Define Area of Interest" disclosure header to expand it
8. Wait for Step 2 panel to expand
9. Locate the point drawing tool button in the map toolbar
10. Click the point drawing tool button to activate it
11. Click on the map at approximate coordinates for Salt Lake City (center of the visible extent)
12. Verify a point marker appears on the map
13. Click on "Step 3 - Results" disclosure header to expand it
14. Wait for Step 3 panel to expand and search query to complete

**Expected Results:**

- A loading indicator should appear while results are being fetched
- After loading completes, "Aerial Photography" should appear as a top-level result header
- One or more category items should appear under "Aerial Photography" (e.g., "RGB 2023", "CIR 2021")
- Each category should contain one or more product items
- Product items should display description text and action buttons (Extent, Preview)
- "No products found" should NOT appear
- Step 4 should remain disabled until a product with download capability is selected

#### 1.2 Verify Search Results Structure

**Steps:**

1. Complete steps 1-14 from scenario 1.1
2. Locate the "Aerial Photography" tree item in results
3. Verify at least one category is present (look for text matching pattern like "RGB", "CIR", "B&W", etc.)
4. Click to expand the first category if not already expanded
5. Verify at least one product is listed under the category
6. Locate a product item (should have a colored background)

**Expected Results:**

- Results follow hierarchy: Product Type > Category > Product
- Category labels include descriptive text (e.g., "RGB", "CIR")
- Product items have colored backgrounds (darker background color)
- Product items display readable description text
- Product items show estimated date information in the description

#### 1.3 Verify Product Actions Are Available

**Steps:**

1. Complete steps 1-14 from scenario 1.1
2. Expand a product category to reveal individual products
3. Hover mouse over a product item
4. Verify the "Extent" button is visible
5. Verify the "Preview" button is visible (if ServiceName is available)
6. Click on the product item to expand its details
7. Verify the details panel expands below the product

**Expected Results:**

- Hovering over a product highlights it on the map with a colored outline
- "Extent" button is visible and clickable for all products
- "Preview" toggle button is visible for products with ServiceName
- Clicking on a product expands a details section
- Details section shows full description, "more info" button, and potentially "web page" link and "Download" button

---

### 2. Search Result Interaction Testing

**Objective**: Verify that result interactions work correctly.

#### 2.1 Test Extent Zoom Functionality

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Note the current map extent/zoom level
3. Expand a product category and locate a product
4. Click the "Extent" button on a product
5. Observe the map animation

**Expected Results:**

- Map zooms and pans to the extent of the selected product
- A colored outline appears showing the product's geographic boundary
- The map extent changes noticeably from the initial view
- Firebase analytics event `result_extent_click` is logged (check console if analytics debugging enabled)

#### 2.2 Test Preview Toggle Functionality

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Expand a product category and locate a product with a "Preview" button
3. Click the "Preview" toggle button to enable preview
4. Verify the button appears selected/toggled on
5. Wait for the preview layer to load on the map
6. Click the "Preview" toggle button again to disable preview

**Expected Results:**

- After clicking once, the "Preview" button appears in a selected/active state
- Map view displays the preview imagery layer overlay
- Layer appears within the product's extent boundary
- After clicking again, the preview layer is removed from the map
- Firebase analytics events `result_preview_add` is logged on enable

#### 2.3 Test More Info Dialog

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Expand a product item to show details
3. Click the "more info" button
4. Wait for modal dialog to open

**Expected Results:**

- A modal dialog opens over the page
- Dialog displays a title matching the product description
- Dialog shows a table or list of product metadata fields:
  - Resolution
  - Year Collected
  - File Format
  - Average File Size
  - Horizontal Accuracy
  - Flight Date Location
  - Contact
  - Storage information
- Values are populated (not all null/empty)
- Dialog has a close button or dismissal method
- Firebase analytics event `result_more_info_click` is logged

#### 2.4 Test Web Page Link

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Expand a product item to show details
3. Look for "web page" link in the details section
4. If present, verify it appears as an external link (with icon)
5. (Optional) Click the link to verify it opens

**Expected Results:**

- If HTML_Page field is populated with a valid URL, "web page" link appears
- Link has external link styling/icon
- Link opens in a new tab/window
- Firebase analytics event `result_web_page_click` is logged on click

#### 2.5 Test Download Button Availability

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Expand multiple product items to show their details
3. Identify which products show a "Download" button
4. Click a "Download" button on a product that has one

**Expected Results:**

- "Download" button appears only for products where In_House = "Yes"
- Button has accent styling (visually prominent)
- Clicking the button advances the wizard to "Step 4 - Download"
- Step 4 disclosure becomes enabled and expands
- Firebase analytics event `result_download_click` is logged

---

### 3. Multiple Product Type Search

**Objective**: Verify aerial photography results appear correctly when searching alongside other product types.

#### 3.1 Search for Aerial Photography and Lidar Together

**Steps:**

1. Navigate to `http://localhost:5173`
2. Select both "Aerial Photography" and "Lidar DEMs" checkboxes in Step 1
3. Verify both checkboxes are checked
4. Expand Step 2 and define an area of interest (use point tool on Salt Lake area)
5. Expand Step 3 to view results
6. Wait for search to complete

**Expected Results:**

- Results section shows two separate product type headers: "Aerial Photography" and "Lidar DEMs"
- Each product type has its own category tree
- Product types appear in consistent order matching Step 1 config
- Both product types can be expanded independently
- Aerial Photography results structure matches single-product search (scenario 1.1)

#### 3.2 Verify Product Type Display Order

**Steps:**

1. Complete scenario 3.1
2. Observe the order of product types in the results

**Expected Results:**

- Product types appear in the same order as defined in config:
  1. Aerial Photography
  2. Lidar DEMs
  3. (etc., if selected)
- Order is consistent with Step 1 checkbox order

---

### 4. Edge Cases and Error Handling

**Objective**: Verify the application handles edge cases gracefully.

#### 4.1 Search in Area with No Aerial Photography Coverage

**Steps:**

1. Navigate to `http://localhost:5173`
2. Select "Aerial Photography" checkbox
3. Expand Step 2
4. Use point drawing tool to place a point in a remote area likely without coverage (e.g., far western Utah desert)
5. Expand Step 3
6. Wait for search to complete

**Expected Results:**

- Loading indicator appears during search
- After loading, "Aerial Photography" header appears
- Under the header, "No products found" message is displayed
- No category or product items appear
- No error messages or crashes occur
- Map remains interactive

#### 4.2 Search with Very Large Area of Interest

**Steps:**

1. Navigate to `http://localhost:5173`
2. Select "Aerial Photography" checkbox
3. Expand Step 2
4. Use polygon drawing tool to draw a very large polygon covering most or all of Utah
5. Complete the polygon
6. Expand Step 3
7. Wait for search to complete (may take longer than usual)

**Expected Results:**

- Search completes without timeout errors
- Large number of results may be returned across many categories
- Results are displayed in hierarchical tree structure
- Tree items can be expanded/collapsed to navigate many results
- Performance remains acceptable (no freezing or extreme lag)
- If there are many results, they should be sorted properly (by date descending)

#### 4.3 Network Error Handling

**Steps:**

1. (Optional setup: Use browser dev tools to throttle or block network)
2. Navigate to `http://localhost:5173`
3. Select "Aerial Photography" checkbox
4. Expand Step 2 and define an area
5. (If simulating: Block the EXTENT_SERVICE_URLS request)
6. Expand Step 3
7. Observe error handling

**Expected Results:**

- If network request fails, an error message appears
- Error message states "Error loading search results"
- Error is displayed in a Banner component (styled notification)
- Application doesn't crash or become unresponsive
- User can still navigate to other steps
- User can modify their selection and try again

#### 4.4 Test Step Navigation Before Prerequisites

**Steps:**

1. Navigate to `http://localhost:5173`
2. Without selecting any product types, try to click Step 2 header
3. Without completing Step 1 or 2, try to click Step 3 header
4. Without completing download selection, try to click Step 4 header

**Expected Results:**

- Step 2 is disabled (cannot expand) until at least one product type is selected
- Step 3 is disabled until both product type and area of interest are defined
- Step 4 is disabled until a download-eligible product is selected
- Disabled steps have appropriate visual styling (grayed out, reduced opacity)
- No errors occur when attempting to interact with disabled steps

---

### 5. Category Filtering via URL Parameters

**Objective**: Verify URL-based category filtering works for aerial photography.

#### 5.1 Filter Aerial Photography to Specific Categories

**Steps:**

1. Navigate to `http://localhost:5173/?categories=RGB,CIR` (adjust URL based on actual category names)
2. Wait for page to load
3. Select "Aerial Photography" checkbox
4. Expand Step 2 and define an area of interest
5. Expand Step 3 to view results

**Expected Results:**

- Only specified categories (RGB, CIR in this example) appear in results
- Other categories are filtered out
- A link appears stating "Want to search for more than RGB, CIR?"
- Clicking the link navigates to base URL without filters
- Filtered search returns only matching products

#### 5.2 Verify Filter Link Appears in Results

**Steps:**

1. Complete scenario 5.1
2. Scroll through the results section
3. Locate the filter notification link

**Expected Results:**

- Link text reads "Want to search for more than \[category list\]?"
- Link appears both in Step 1 (SelectProductTypes) and Step 3 (SearchResults)
- Link href is "/" (returns to unfiltered view)
- Link styling is consistent with other links in the app

---

### 6. Visual and Interaction Testing

**Objective**: Verify visual feedback and hover interactions work correctly.

#### 6.1 Test Product Hover Highlighting

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Expand a category to show products
3. Move mouse over different product items without clicking
4. Observe map graphics

**Expected Results:**

- When hovering over a product item, a colored outline appears on the map showing the product extent
- Outline uses the RESULT_SYMBOL configuration (defined in config.ts)
- Moving to a different product updates the outline to the new product
- Moving mouse away from all products removes the outline
- Hover works on both collapsed product items and expanded details

#### 6.2 Test Tile Highlighting in Download View

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Find and click a "Download" button on a product
3. Observe Step 4 expanding with tile selection interface
4. Hover over different tiles in the tile selection panel
5. Observe map graphics

**Expected Results:**

- Hovering over a tile in the list highlights the corresponding tile on the map
- Tile highlighting uses TILE_SYMBOL (distinct from product extent symbol)
- Selected tiles show with DOWNLOADED_TILE_SYMBOL (green color)
- Hover highlighting is responsive and immediate

#### 6.3 Test Tree Expansion States

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Click to collapse the "Aerial Photography" top-level item
3. Verify all child categories collapse
4. Click to expand "Aerial Photography" again
5. Verify previously expanded categories remain in their last state (or follow default expansion logic)

**Expected Results:**

- Tree items expand/collapse smoothly with chevron indicators
- Expanding/collapsing product types shows/hides all child categories
- Auto-expansion logic works:
  - Single category in single product type: auto-expands
  - Single product in category: auto-expands
- Manual user expansions are respected

---

### 7. Accessibility Testing

**Objective**: Verify accessibility features work correctly.

#### 7.1 Keyboard Navigation Through Results

**Steps:**

1. Complete scenario 1.1 to get aerial photography results
2. Click in the Step 3 results area to focus it
3. Use Tab key to navigate through focusable elements
4. Use Arrow keys to navigate tree items
5. Use Enter/Space to expand/collapse items

**Expected Results:**

- All interactive elements are reachable via keyboard
- Focus indicators are clearly visible on focused elements
- Tree navigation follows ARIA tree pattern:
  - Arrow Up/Down moves between items
  - Arrow Right expands, Arrow Left collapses
  - Enter activates buttons/links
- Tab key moves between major interactive sections
- Focus order is logical and predictable

#### 7.2 Screen Reader Compatibility

**Steps:**

1. Enable screen reader (VoiceOver on Mac, NVDA on Windows, etc.)
2. Navigate to the application
3. Navigate through the wizard steps using screen reader
4. Navigate through aerial photography search results

**Expected Results:**

- Step disclosure headers announce their state (expanded/collapsed)
- Checkboxes announce their state (checked/unchecked)
- Tree structure is announced correctly (e.g., "Aerial Photography, 1 of 1, level 1")
- Product items announce their text content and available actions
- Buttons have descriptive labels
- Help tooltips are accessible
- ARIA labels and descriptions are present and meaningful

---

### 8. Responsive Design Testing

**Objective**: Verify aerial photography search works on different screen sizes.

#### 8.1 Test on Mobile Viewport

**Steps:**

1. Resize browser to mobile viewport (e.g., 375px width) or use device emulation
2. Navigate to `http://localhost:5173`
3. Verify drawer/wizard is visible or accessible
4. Complete aerial photography search workflow
5. Interact with results

**Expected Results:**

- Wizard drawer is closeable/openable on mobile (if auto-hidden)
- Map remains visible and interactive
- Step disclosures work properly on narrow screens
- Product actions (buttons) remain accessible
- Text wraps appropriately without overflow
- Touch interactions work smoothly

#### 8.2 Test Drawer Behavior at Breakpoints

**Steps:**

1. Start at desktop width (>= 768px as per MIN_DESKTOP_WIDTH config)
2. Verify drawer is open by default
3. Resize to mobile width (< 768px)
4. Observe drawer behavior
5. Resize back to desktop width

**Expected Results:**

- Drawer is open by default on desktop viewports
- Drawer state persists across resizes (if user manually closed it)
- Drawer can be toggled via trigger button at all sizes
- Map adjusts size appropriately when drawer opens/closes
- No layout shifts or content overflow occurs

---

### 9. State Management and Persistence

**Objective**: Verify wizard state is managed correctly.

#### 10.1 Test Step State Transitions

**Steps:**

1. Complete Step 1 by selecting "Aerial Photography"
2. Verify Step 2 becomes enabled
3. Complete Step 2 by defining an area
4. Verify Step 3 becomes enabled
5. Go back to Step 1 and deselect "Aerial Photography"
6. Observe Step 2 and Step 3 states

**Expected Results:**

- Steps enable/disable based on wizard machine state
- Deselecting all product types disables subsequent steps
- Wizard machine state (XState) manages transitions correctly
- Context preserves selections across step transitions

---

## Testing Checklist Summary

### Critical Path Tests

- [ ] 1.1 - Basic aerial photography search returns results
- [ ] 1.2 - Results display in correct hierarchical structure
- [ ] 1.3 - Product actions (Extent, Preview, Download) are available
- [ ] 2.1 - Extent zoom functionality works
- [ ] 2.5 - Download button advances to Step 4

### Feature Tests

- [ ] 2.2 - Preview toggle shows/hides imagery layer
- [ ] 2.3 - More info dialog displays product metadata
- [ ] 3.1 - Multiple product types display correctly together
- [ ] 5.1 - URL category filtering works

### Edge Cases

- [ ] 4.1 - No results message displays for areas without coverage
- [ ] 4.2 - Large area searches complete successfully
- [ ] 4.3 - Network errors are handled gracefully
- [ ] 4.4 - Step navigation enforces prerequisites

### Quality Assurance

- [ ] 6.1 - Hover interactions provide visual feedback
- [ ] 6.3 - Tree expansion states work correctly
- [ ] 7.1 - Keyboard navigation is functional
- [ ] 8.1 - Mobile viewport is usable

---

## Test Data and Environment Notes

### Required Environment Variables

- `VITE_DISCOVER`: Required for map basemap layers
- `VITE_FIREBASE_CONFIG`: Required for analytics (optional for basic functionality)

### Test Data Assumptions

- Aerial photography data exists for Salt Lake County area
- At least one product has `In_House = 'Yes'` for download testing
- At least one product has `ServiceName` populated for preview testing
- Network connectivity to ArcGIS Online services is available

### Service Dependencies

- **Extent Service**: `https://services1.arcgis.com/99lidPhWCzftIe9K/arcgis/rest/services/Aerial_Photography_Extents/FeatureServer/0`
- **Index Service**: Used in Step 4 for tile selection (not covered in this plan)
- **ArcGIS JS API**: For map rendering and geometry utilities

### Known Limitations

- Test scenarios assume dev server is running on `http://localhost:5173`
- Some scenarios require manual verification (screen readers, analytics events)
- Performance benchmarks are guidelines, not strict requirements

---

## Automation Implementation Notes

For implementing these scenarios as automated Playwright tests:

1. **Selectors**: Use role-based selectors where possible:
   - `page.getByRole('checkbox', { name: 'Aerial Photography' })`
   - `page.getByRole('button', { name: 'Extent' })`
   - `page.getByRole('treeitem', { name: /RGB/ })`

2. **Waiting Strategies**:
   - Wait for network requests: `page.waitForResponse(/Aerial_Photography_Extents/)`
   - Wait for tree items: `page.waitForSelector('[role="treeitem"]')`
   - Wait for loading to finish: Look for absence of loading indicators

3. **Map Interactions**:
   - May require evaluating JavaScript to interact with ArcGIS map
   - Use `page.evaluate()` for complex map interactions
   - Wait for map view readiness before drawing

4. **Assertions**:
   - Count tree items: `expect(page.locator('[role="treeitem"]')).toHaveCount()`
   - Verify text content: `expect(page.getByText('Aerial Photography')).toBeVisible()`
   - Check button states: `expect(button).toBeEnabled()`

5. **Test Isolation**:
   - Each test should start with fresh page load
   - Clear any persisted state between tests
   - Consider using beforeEach hooks for common setup
