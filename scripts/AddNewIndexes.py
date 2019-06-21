'''
AddNewIndexes.py

Used to add new index layers to this app.

Intended to be run on local server via ArcGIS Desktop python instance.
'''

import json
from os.path import dirname, join, realpath, basename
from sys import argv

import arcpy
from raster_secrets import PROD_SERVERS, SHARE

current_folder = dirname(realpath(__file__))
local_folder = r'C:\forklift\data\production'
sgid = join(current_folder, 'SGID10 as INDICES.sde')


def add_layers_to_pallet(new_layers):
    print('adding layers to layers.json file (used by RasterPallet.py)')
    json_path = join(current_folder, 'layers.json')
    with open(json_path, 'r') as read_file:
        existing_layers = json.loads(read_file.read())

    with open(json_path, 'w') as write_file:
        write_file.write(json.dumps(existing_layers + map(lambda l: basename(l), new_layers), indent=4))


def add_layers_to_gdbs(new_layers):
    folders = [local_folder]
    print('adding layers to raster gdbs in these folders: {}'.format(folders))
    for layer in new_layers:
        for folder in folders:
            print('projecting {} into {}'.format(layer, folder))
            arcpy.management.Project(join(SHARE, layer), join(folder, layer), arcpy.SpatialReference(3857))


def add_layers_to_mxd(new_layers):
    print('adding layers to Raster.mxd')
    mxd_path = join(current_folder, '..', 'maps', 'Raster.mxd')
    mxd = arcpy.mapping.MapDocument(mxd_path)
    template_path = join(current_folder, 'template.lyr')

    for layer_name in new_layers:
        print(layer_name)
        layer = arcpy.mapping.Layer(template_path)
        layer.name = basename(layer_name)
        layer.replaceDataSource(join(local_folder, dirname(layer_name)), 'FILEGDB_WORKSPACE', layer.name)
        arcpy.mapping.AddLayer(mxd.activeDataFrame, layer, 'BOTTOM')

    mxd.save()

    lyrs = arcpy.mapping.ListLayers(mxd)

    def FindLayer(name):
        for l in lyrs:
            if l.name == name:
                return True

        print('ERROR! Could not find layer: %s' % name)

    print('validating that all indexes in the extents feature classes (SDE) are added as layers in mxd')
    for extent_layer in [l for l in lyrs if l.name.endswith('_Extents')]:
        cur = arcpy.SearchCursor(join(sgid, extent_layer.name), "In_House = 'Yes' AND SHOW = 'Y'")
        print('searching %s' % extent_layer)
        for row in cur:
            FindLayer(row.Tile_Index)


try:
    new_layers = argv[1].split(';')
except:
    new_layers = raw_input('New layer(s) including gdb separated by ";" (e.g. DRGs.gdb\Vintage_24K): ').split(';')

add_layers_to_pallet(new_layers)
add_layers_to_gdbs(new_layers)
add_layers_to_mxd(new_layers)

print('SUCCESS!!!')
