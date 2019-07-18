raster.utah.gov
================
[![Build Status](https://travis-ci.com/agrc/raster.svg?branch=master)](https://travis-ci.com/agrc/raster)

## Installation
1. Publish `maps/Raster.mxd` as `/Raster` map service.

## How to add a new layer
1. From dev machine: `scripts/AddNewIndexes.py` with the new layers.
1. Commit changes and push.
1. From production forklift machine: `forklift special-delivery ./scripts/RasterPallet.py`
1. Publish `Raster.mxd`.
1. Push changes to repo.

## Notes
### Preview Urls
The preview button is wired up to the `ServiceName` field first, then `REST`. If there is no value in either field the button is hidden.

### Custom Category URL Examples
raster.utah.gov/?catGroup=24K%20GeoPDF,24K%20DRG&title=USGS%2024K%20Topo%20Maps

raster.utah.gov/?cat=HRO%202009%20(25cm)
