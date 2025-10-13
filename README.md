# raster.utah.gov

This repository contains the source code for the raster data discovery website maintained by the Utah Geospatial Resource Center (UGRC). The website provides users with tools to discover, visualize, and download various raster datasets relevant to Utah.

## Architecture

### Models

#### Product Types

These are the different types of data available through the app. Each of them have corresponding extent and tile indexes feature classes.

- Aerial Photography
- Auto-Correlated DEMs
- LiDAR
- Contours
- USGS DEMs
- Topos

##### Category

Top-level results groups returned in step 3. These come from the `Category` field in the extents datasets. Products are grouped by category but everything within the curly braces is removed from the label. For example from LiDAR extents: `2 Meter {2006 LiDAR}` is labeled as `2 Meter`.

##### Product

Individual results returned in step 3 as cards. Each product is represented by an individual row in the extents datasets.

##### Tile

A single file that can be downloaded from cloud storage. Each row in the tile indexes datasets represents a single tile.

### Datasets

#### Extents

Currently available as hosted feature services in ArcGIS Online (AGOL) (maintained in internal, pushed to AGOL via Dolly Carton). One service per product type. Stores an extent for each feature along with metadata. These provide the search results (grouped by `Category`).

- [Utah Aerial Photography Extents](https://www.arcgis.com/home/item.html?id=91f0336b027a426ba14d62aa95a4af9b#data)
- [Utah LiDAR Extents](https://www.arcgis.com/home/item.html?id=90556bb0e09640648be66013a6ab56e6#data)
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
- `REST_Endpoint`
- `Resolution`
- `SHOW`
- `ServiceName`
- `Tile_Index`
- `Total_Size`
- `Total_Square_Miles`
- `Upload_Date`
- `Vertical_Accuracy`
- `Year_Collected`

These are only found in Auto-Correlated DEMs, LiDAR DEMs, and USGS DEMs:

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

## Attribution

This project was developed with the assistance of [GitHub Copilot](https://github.com/features/copilot).
