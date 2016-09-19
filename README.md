raster.utah.gov
================

## Installation
1. Publish `maps/Raster.mxd` as `/Raster` map service.

## How to add a new layer
1. Copy the feature class from SGID to `\\172.16.17.53\ArcGISServer\data\Raster\Raster.gdb`.
2. Add new layer to `Raster.mxd`.
3. Save and run `scripts/checkMxd.py`.
4. Republish service.

## Notes
### Preview URL's
The preview button is wired up to the `ServiceName` field first, then `REST`. If there is no value in either field the button is hidden.

### Custom Category URL Examples
raster.utah.gov/?catGroup=24K%20GeoPDF,24K%20DRG&title=USGS%2024K%20Topo%20Maps  
raster.utah.gov/?cat=HRO%202009%20(25cm)
