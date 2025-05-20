# raster.utah.gov

## Installation

1. Publish `Raster` map in `maps/Raster.aprx` as `/Raster` map service.

## How to add a new layer

1. From dev machine (proenv): `propy scripts/ManageIndexes.py add <newLayers>`
    - e.g. `propy ManageIndexes.py add Lidar.gdb\LiDAR2019_100cm_Kane_County_DEM_Tiles;Lidar.gdb\LiDAR2019_100cm_Kane_County_DSM_Tiles`
1. Commit changes and push.
1. From production forklift machine: `forklift special-delivery c:/forklift/warehouse/raster/scripts/RasterPallet.py`
1. Publish `Raster` map in `maps/Raster.aprx` to production ArcGIS Server machines.

## Notes

### Preview Urls

The preview button is wired up to the `ServiceName` field first, then `REST`. If there is no value in either field the button is hidden.

### Optional URL Parameters

A URL may contain only one of `cat` or `catGroup`. If both are present, `cat` will be used. The other parameters can be mixed and matched as needed.

`cat` and `catGroup` are mutually exclusive

`products` accepts a zero-based index of the product checkboxes that you would like to be checked by default. You may pass multiple values separated by commas.

`title` sets the title of the app.

#### Examples

raster.utah.gov/?catGroup=24K%20GeoPDF,24K%20DRG&title=USGS%2024K%20Topo%20Maps

raster.utah.gov/?cat=HRO%202009%20(25cm)

raster.utah.gov/?products=1,3&title=My Custom Title

## :robot: Dependabot

- `uglify-js` greater than `3.17.4` breaks `npm run build:prod`. Last checked with `3.19.3`
