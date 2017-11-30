raster.utah.gov
================

## Installation
1. Publish `maps/Raster.mxd` as `/Raster` map service.

## How to add a new layer (from test server)
1. Run `scripts/AddNewIndexes.py` with the new layers.
1. Publish `Raster.mxd`.

## Notes
### Preview URL's
The preview button is wired up to the `ServiceName` field first, then `REST`. If there is no value in either field the button is hidden.

### Custom Category URL Examples
raster.utah.gov/?catGroup=24K%20GeoPDF,24K%20DRG&title=USGS%2024K%20Topo%20Maps  
raster.utah.gov/?cat=HRO%202009%20(25cm)
