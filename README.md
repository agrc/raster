# raster.utah.gov

[![firebase deploy](https://github.com/agrc/raster/actions/workflows/nodejs.yml/badge.svg)](https://github.com/agrc/raster/actions/workflows/nodejs.yml)

## Installation

1. Publish `maps/Raster.mxd` as `/Raster` map service.

## How to add a new layer

1. From dev machine (python2): `scripts/ManageIndexes.py add <newlayers>`
   - e.g. `python ManageIndexes.py add Lidar.gdb\LiDAR2019_100cm_Kane_County_DEM_Tiles;Lidar.gdb\LiDAR2019_100cm_Kane_County_DSM_Tiles`
1. Commit changes and push.
1. From production forklift machine: `forklift special-delivery ./scripts/RasterPallet.py`
1. Publish `Raster.mxd` to production ArcGIS Server machines.

## Notes

### Preview Urls

The preview button is wired up to the `ServiceName` field first, then `REST`. If there is no value in either field the button is hidden.

### Custom Category URL Examples

raster.utah.gov/?catGroup=24K%20GeoPDF,24K%20DRG&title=USGS%2024K%20Topo%20Maps

raster.utah.gov/?cat=HRO%202009%20(25cm)
