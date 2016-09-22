raster.utah.gov
================

## Installation
1. Publish `maps/Raster.mxd` as `/Raster` map service.

## How to add a new layer
1. Add new feature class name to `scripts/RasterPallet.py` and run the pallet.
2. Add new layer to `Raster.mxd`.
3. Save and run `scripts/checkMxd.py`.
4. Republish service.

## Notes
### Preview URL's
The preview button is wired up to the `ServiceName` field first, then `REST`. If there is no value in either field the button is hidden.

### Custom Category URL Examples
raster.utah.gov/?catGroup=24K%20GeoPDF,24K%20DRG&title=USGS%2024K%20Topo%20Maps  
raster.utah.gov/?cat=HRO%202009%20(25cm)
