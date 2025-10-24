# raster.utah.gov

This repository contains the source code for the raster data discovery website maintained by the Utah Geospatial Resource Center (UGRC). The website provides users with tools to discover, visualize, and download various raster datasets relevant to Utah.

## Architecture

### Models

#### Product Types

These are the different types of data available through the app. Each of them have corresponding extent and tile indexes feature classes.

- Aerial Photography
- Auto-Correlated DEMs
- Lidar
- Contours
- USGS DEMs
- Topos

##### Category

Top-level results groups returned in step 3. These come from the `Category` field in the extents datasets. Products are grouped by category but everything within the curly braces is removed from the label. For example from Lidar Extents: `2 Meter {2006 Lidar}` is labeled as `2 Meter`.

Categories are sorted by `Estimated_Date` in descending order (most recent first). This is done directly in the query to the extents datasets in `src/services/search.ts`.

##### Product

Individual results returned in step 3 as cards. Each product is represented by an individual row in the extents datasets.

Products within each category are sorted using a configuration object.

- Define sort tokens per product type in `src/config.ts` under `PRODUCT_SORT_ORDER`.
- How it works:
  - Sorting is applied only for product types that have an entry in `PRODUCT_SORT_ORDER`.
  - Each product's `Product` field is matched case-insensitively against the tokens, using substring matching.
  - Items are ordered by the index of the first matching token in the configured array.
  - Items that don’t match any token will appear after matched items (they keep their relative order among themselves).

To change the ordering, update the token arrays in `PRODUCT_SORT_ORDER`. If a product type has no entry, its products are shown in their original order.

##### Tile

A single file that can be downloaded from cloud storage. Each row in the tile indexes datasets represents a single tile.

### Datasets

#### Extents

Currently available as hosted feature services in ArcGIS Online (AGOL) (maintained in internal, pushed to AGOL via Dolly Carton). One service per product type. Stores an extent for each feature along with metadata. These provide the search results (grouped by `Category`).

- [Utah Aerial Photography Extents](https://www.arcgis.com/home/item.html?id=91f0336b027a426ba14d62aa95a4af9b#data)
- [Utah Lidar Extents](https://www.arcgis.com/home/item.html?id=90556bb0e09640648be66013a6ab56e6#data)
- [Utah USGS DEM Extents](https://www.arcgis.com/home/item.html?id=855e7b6e4ce9481ca0faef64c9113f8a#data)
- [Utah Auto Correlated DEM Extents](https://www.arcgis.com/home/item.html?id=3e82e35d69744ce4991c15daa4edd775#data)
- [Utah Contour Line Extents](https://www.arcgis.com/home/item.html?id=3e82e35d69744ce4991c15daa4edd775#data)
- [Utah DRG Extents](https://www.arcgis.com/home/item.html?id=7da0b87ffa894450b65f955daae23bfb#data)

##### Common Fields for Extents

A full analysis of the schema for the extents services can be found in the [schema report](docs/schema-reports.md).

- `Average_File_Size`
- `Category`
- `Contact`
- `Description`
- `Estimated_Date`
- `FTP_Path`
- `File_Extension`
- `File_Format`
- `FlightDate_Location`
- `HTML_Page`
- `Horizontal_Accuracy`
- `In_House`
- `Interval`
- `LYR_File`
- `Product`
- `Resolution`
- `SHOW`
- `ServiceName`
- `Tile_Index`
- `Total_Size`
- `Total_Square_Miles`
- `Upload_Date`
- `Vertical_Accuracy`
- `Year_Collected`

These are only found in Auto-Correlated DEMs, Lidar DEMs, and USGS DEMs:

- `METADATA`
- `REPORT`

#### Tile Indexes

Individual tile index data aggregated into six feature classes corresponding with the product types similar to extents above.

- [Utah Aerial Photography Tiles](https://utah.maps.arcgis.com/home/item.html?id=747a5deabc6e46e9bec5594ce0993612#data)
- [Utah Lidar Tiles](https://utah.maps.arcgis.com/home/item.html?id=fc0ab17302f64c8e9d734f978f520c9b#data)
- [Utah USGS DEM Tiles](https://utah.maps.arcgis.com/home/item.html?id=aa02c1a8d1c343a39645fbed55cf5dad#data)
- [Utah AutoCorrelated DEM Tiles](https://utah.maps.arcgis.com/home/item.html?id=b2a1ace211d343aaa54d8b8378715120#data)
- [Utah Contours Tiles](https://utah.maps.arcgis.com/home/item.html?id=61822c08b6bd43178490dd9b53e1b273#data)
- [Utah DRG Tiles](https://utah.maps.arcgis.com/home/item.html?id=b1f987e828354f13976941cfcece57b2#data)

##### Common Fields for Tile Indexes

A full analysis of the schema for the tile index services can be found in the [schema report](docs/schema-reports.md).

- `EXT`
- `PATH`
- `SIZE`
- `TILE`
- `TILE_INDEX`

### Data-Driven App Functionality

#### Staging data prior to making it visible in the app

The app will only show results from the extents datasets where `upper(SHOW) = 'Y'`. This allows data to be staged in the datasets but not visible to end users until ready.

#### Preview Button

The preview button is only shown for products that have a value in the `ServiceName` field. When clicked, the value is used to build a URL to the corresponding discover layer and it is added to the map.

#### Download Button

The download button is only shown for products where `In_House` equals `Yes`.

#### "web page" Link

The "web page" link is only shown for products where the `HTML_Page` field contains a valid URL.

## Attribution

This project was developed with the assistance of [GitHub Copilot](https://github.com/features/copilot).
