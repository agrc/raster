"""
used to check the raster.mxd to make sure that it has all of the indices layers
that are referenced in the *_Extents feature classes.
"""

import arcpy
from os import path

mxd = arcpy.mapping.MapDocument(path.join(path.dirname(__file__), '..', 'maps', 'Raster.mxd'))
lyrs = arcpy.mapping.ListLayers(mxd)


def FindLayer(name):
    for l in lyrs:
        if l.name == name:
            return True

    print('could not find: %s' % name)

for i in range(4):
    cur = arcpy.SearchCursor(lyrs[i], "In_House = 'Yes'")
    print('searching %s' % lyrs[i])
    for row in cur:
        FindLayer(row.Tile_Index.split('.')[2])

print('done')
