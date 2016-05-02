raster.utah.gov
================

## Installation
1. Publish `maps/Raster.mxd` as `/Raster` map service.

## How to add a new layer
1. Copy the feature class from SGID to `\\172.16.17.53\ArcGISServer\data\Raster\Raster.gdb`.
2. Add new layer to `Raster.mxd`.
3. Save and run `scripts/checkMxd.py`.
4. Republish service.
