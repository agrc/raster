# Schema Reports

## EXTENTS SERVICES - Finding common field names between feature services

Fetching field information from each service...

Processing aerials...
Found 30 fields

Processing auto_dems...
Found 31 fields

Processing contours...
Found 29 fields

Processing topo...
Found 29 fields

Processing lidar...
Found 35 fields

Processing usgs...
Found 31 fields

### RESULTS

#### Fields by service

##### AERIALS

- Average_File_Size
- Category
- Contact
- Description
- Endpoint
- Estimated_Date
- FTP_Path
- File_Extension
- File_Format
- FlightDate_Location
- HTML_Page
- Horizontal_Accuracy
- In_House
- Interval
- LYR_File
- OBJECTID
- Product
- REST_Endpoint
- Resolution
- SHOW
- ServiceName
- Shape
- Shape\_\_Area
- Shape\_\_Length
- Tile_Index
- Total_Size
- Total_Square_Miles
- Upload_Date
- Vertical_Accuracy
- Year_Collected

##### AUTO_DEMS

- Average_File_Size
- Category
- Contact
- Description
- Estimated_Date
- FTP_Path
- File_Extension
- File_Format
- FlightDate_Location
- HTML_Page
- Horizontal_Accuracy
- In_House
- Interval
- LYR_File
- METADATA
- OBJECTID
- Product
- REPORT
- REST_Endpoint
- Resolution
- SHOW
- ServiceName
- Shape
- Shape\_\_Area
- Shape\_\_Length
- Tile_Index
- Total_Size
- Total_Square_Miles
- Upload_Date
- Vertical_Accuracy
- Year_Collected

##### CONTOURS

- Average_File_Size
- Category
- Contact
- Description
- Estimated_Date
- FTP_Path
- File_Extension
- File_Format
- FlightDate_Location
- HTML_Page
- Horizontal_Accuracy
- In_House
- Interval
- LYR_File
- OBJECTID
- Product
- REST_Endpoint
- Resolution
- SHOW
- ServiceName
- Shape
- Shape\_\_Area
- Shape\_\_Length
- Tile_Index
- Total_Size
- Total_Square_Miles
- Upload_Date
- Vertical_Accuracy
- Year_Collected

##### TOPO

- Average_File_Size
- Category
- Contact
- Description
- Estimated_Date
- FTP_Path
- File_Extension
- File_Format
- FlightDate_Location
- HTML_Page
- Horizontal_Accuracy
- In_House
- Interval
- LYR_File
- OBJECTID
- Product
- REST_Endpoint
- Resolution
- SHOW
- ServiceName
- Shape
- Shape\_\_Area
- Shape\_\_Length
- Tile_Index
- Total_Size
- Total_Square_Miles
- Upload_Date
- Vertical_Accuracy
- Year_Collected

##### LIDAR

- Average_File_Size
- Category
- Contact
- Coverage
- Description
- Estimated_Date
- FTP_Path
- File_Extension
- File_Format
- FlightDate_Location
- HTML_Page
- Horizontal_Accuracy
- In_House
- Interval
- LYR_File
- METADATA
- OBJECTID
- Product
- Project_Name
- Project_Status
- REPORT
- REST_Endpoint
- Resolution
- SHOW
- ServiceName
- Shape
- Shape\_\_Area
- Shape\_\_Length
- Tile_Index
- Total_Size
- Total_Square_Miles
- USGS_QualityLevel
- Upload_Date
- Vertical_Accuracy
- Year_Collected

##### USGS

- Average_File_Size
- Category
- Contact
- Description
- Estimated_Date
- FTP_Path
- File_Extension
- File_Format
- FlightDate_Location
- HTML_Page
- Horizontal_Accuracy
- In_House
- Interval
- LYR_File
- METADATA
- OBJECTID
- Product
- REPORT
- REST_Endpoint
- Resolution
- SHOW
- ServiceName
- Shape
- Shape\_\_Area
- Shape\_\_Length
- Tile_Index
- Total_Size
- Total_Square_Miles
- Upload_Date
- Vertical_Accuracy
- Year_Collected

#### COMMON FIELDS ACROSS ALL EXTENTS SERVICES

Found 29 common fields:

- Average_File_Size
- Category
- Contact
- Description
- Estimated_Date
- FTP_Path
- File_Extension
- File_Format
- FlightDate_Location
- HTML_Page
- Horizontal_Accuracy
- In_House
- Interval
- LYR_File
- OBJECTID
- Product
- REST_Endpoint
- Resolution
- SHOW
- ServiceName
- Shape
- Shape\_\_Area
- Shape\_\_Length
- Tile_Index
- Total_Size
- Total_Square_Miles
- Upload_Date
- Vertical_Accuracy
- Year_Collected

#### NON-COMMON FIELDS BY EXTENTS SERVICE

Found 7 fields that are not common to all services:

##### Coverage

Found in: lidar
Missing from: aerials, usgs, auto_dems, topo, contours

##### Endpoint

Found in: aerials
Missing from: usgs, lidar, auto_dems, topo, contours

##### METADATA

Found in: auto_dems, lidar, usgs
Missing from: contours, aerials, topo

##### Project_Name

Found in: lidar
Missing from: aerials, usgs, auto_dems, topo, contours

##### Project_Status

Found in: lidar
Missing from: aerials, usgs, auto_dems, topo, contours

##### REPORT

Found in: auto_dems, lidar, usgs
Missing from: contours, aerials, topo

##### USGS_QualityLevel

Found in: lidar
Missing from: aerials, usgs, auto_dems, topo, contours

#### EXTENTS FIELD FREQUENCY ANALYSIS

- OBJECTID: 6/6 services (100.0%)
- Resolution: 6/6 services (100.0%)
- Description: 6/6 services (100.0%)
- Year_Collected: 6/6 services (100.0%)
- File_Format: 6/6 services (100.0%)
- File_Extension: 6/6 services (100.0%)
- Average_File_Size: 6/6 services (100.0%)
- Total_Size: 6/6 services (100.0%)
- Horizontal_Accuracy: 6/6 services (100.0%)
- Vertical_Accuracy: 6/6 services (100.0%)
- Total_Square_Miles: 6/6 services (100.0%)
- Contact: 6/6 services (100.0%)
- In_House: 6/6 services (100.0%)
- FTP_Path: 6/6 services (100.0%)
- Product: 6/6 services (100.0%)
- Category: 6/6 services (100.0%)
- Estimated_Date: 6/6 services (100.0%)
- HTML_Page: 6/6 services (100.0%)
- REST_Endpoint: 6/6 services (100.0%)
- LYR_File: 6/6 services (100.0%)
- FlightDate_Location: 6/6 services (100.0%)
- Tile_Index: 6/6 services (100.0%)
- Interval: 6/6 services (100.0%)
- Upload_Date: 6/6 services (100.0%)
- SHOW: 6/6 services (100.0%)
- ServiceName: 6/6 services (100.0%)
- Shape\_\_Area: 6/6 services (100.0%)
- Shape\_\_Length: 6/6 services (100.0%)
- Shape: 6/6 services (100.0%)
- METADATA: 3/6 services (50.0%)
- REPORT: 3/6 services (50.0%)
- Endpoint: 1/6 services (16.7%)
- USGS_QualityLevel: 1/6 services (16.7%)
- Coverage: 1/6 services (16.7%)
- Project_Name: 1/6 services (16.7%)
- Project_Status: 1/6 services (16.7%)

## TILE INDEX SERVICES - Finding common field names between feature services

Fetching field information from each service...

Processing aerials...
Found 10 fields

Processing auto_dems...
Found 9 fields

Processing contours...
Found 9 fields

Processing topo...
Found 9 fields

Processing lidar...
Found 9 fields

Processing usgs...
Found 9 fields

### TILE INDEX RESULTS

#### Fields by tile index service

##### TILE INDEX AERIALS

- EXT
- OBJECTID
- PATH
- RESOLUTION
- SIZE
- Shape
- Shape_Area
- Shape_Length
- TILE
- TILE_INDEX

##### TILE INDEX AUTO_DEMS

- EXT
- OBJECTID
- PATH
- SIZE
- Shape
- Shape_Area
- Shape_Length
- TILE
- TILE_INDEX

##### TILE INDEX CONTOURS

- EXT
- OBJECTID
- PATH
- SIZE
- Shape
- Shape_Area
- Shape_Length
- TILE
- TILE_INDEX

##### TILE INDEX TOPO

- EXT
- OBJECTID
- PATH
- SIZE
- Shape
- Shape_Area
- Shape_Length
- TILE
- TILE_INDEX

##### TILE INDEX LIDAR

- EXT
- OBJECTID
- PATH
- SIZE
- Shape
- Shape_Area
- Shape_Length
- TILE
- TILE_INDEX

##### TILE INDEX USGS

- EXT
- OBJECTID
- PATH
- SIZE
- Shape
- Shape_Area
- Shape_Length
- TILE
- TILE_INDEX

#### COMMON FIELDS ACROSS ALL TILE INDEX SERVICES

Found 9 common fields:

- EXT
- OBJECTID
- PATH
- SIZE
- Shape
- Shape_Area
- Shape_Length
- TILE
- TILE_INDEX

#### NON-COMMON FIELDS BY TILE INDEX SERVICE

Found 1 fields that are not common to all services:

##### RESOLUTION

Found in: aerials
Missing from: usgs, lidar, auto_dems, topo, contours

#### TILE INDEX FIELD FREQUENCY ANALYSIS

- OBJECTID: 6/6 services (100.0%)
- Shape: 6/6 services (100.0%)
- TILE: 6/6 services (100.0%)
- PATH: 6/6 services (100.0%)
- EXT: 6/6 services (100.0%)
- SIZE: 6/6 services (100.0%)
- TILE_INDEX: 6/6 services (100.0%)
- Shape_Length: 6/6 services (100.0%)
- Shape_Area: 6/6 services (100.0%)
- RESOLUTION: 1/6 services (16.7%)
