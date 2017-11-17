#!/usr/bin/env python
# * coding: utf8 *
'''
AddNewIndexes.py

Used to add new index layers to this app.

Intended to be run on test server (.58) via ArcGIS Desktop python.
'''

import json
from os.path import dirname, join, realpath
from sys import argv

import arcpy
from raster_secrets import PROD_SERVERS

current_folder = dirname(realpath(__file__))
local_folder = r'C:\MapData'
sgid = join(current_folder, 'SGID10 as INDICES.sde')


def add_layers_to_pallet(new_layers):
    print('adding layers to layers.json file (used by RasterPallet.py)')
    json_path = join(current_folder, 'layers.json')
    with open(json_path, 'r') as read_file:
        existing_layers = json.loads(read_file.read())

    with open(json_path, 'w') as write_file:
        write_file.write(json.dumps(existing_layers + map(lambda l: l.split('.')[-1], new_layers), indent=4))


def add_layers_to_gdbs(new_layers):
    folders = [local_folder] + PROD_SERVERS.map(lambda ip: r'\\{}\c$\MapData'.format(ip))
    # folders = [local_folder]
    print('adding layers to raster.gdb in these folders: {}'.format(folders))
    for layer in new_layers:
        for folder in folders:
            gdb = join(folder, 'raster.gdb')
            print('projecting {} into {}'.format(layer, gdb))
            arcpy.management.Project(join(sgid, layer), join(gdb, layer), arcpy.SpatialReference(3857), 'NAD_1983_To_WGS_1984_5')


def add_layers_to_mxd(new_layers):
    print('adding layers to Raster.mxd')
    mxd_path = join(current_folder, '..', 'maps', 'Raster.mxd')
    mxd = arcpy.mapping.MapDocument(mxd_path)
    template_path = join(current_folder, 'template.lyr')

    for layer_name in new_layers:
        print(layer_name)
        layer = arcpy.mapping.Layer(template_path)
        layer.name = layer_name.split('.')[-1]
        layer.replaceDataSource(join(local_folder, 'raster.gdb'), 'FILEGDB_WORKSPACE', layer_name.split('.')[-1])
        arcpy.mapping.AddLayer(mxd.activeDataFrame, layer, 'BOTTOM')

    mxd.save()

    lyrs = arcpy.mapping.ListLayers(mxd)

    def FindLayer(name):
        for l in lyrs:
            if l.name == name:
                return True

        print('ERROR! Could not find layer: %s' % name)

    print('validating that all indexes in the extents feature classes (SDE) are added as layers in mxd')
    for i in range(4):
        cur = arcpy.SearchCursor(join(sgid, lyrs[i].name), "In_House = 'Yes' AND SHOW = 'Y'")
        print('searching %s' % lyrs[i])
        for row in cur:
            FindLayer(row.Tile_Index.split('.')[2])


try:
    new_layers = argv[1].split(';')
except:
    new_layers = raw_input('New layer(s) separated by ";": ').split(';')

add_layers_to_pallet(new_layers)
add_layers_to_gdbs(new_layers)
add_layers_to_mxd(new_layers)

print('SUCCESS!!!')
print('Next step: Open Raster.mxd and publish to prod')
print('Note: The extents feature class was not updated during this process.')
