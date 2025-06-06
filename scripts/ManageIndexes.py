'''
ManageIndexes.py

Used to add or remove index layers to this app.

Intended to be run on local server via pro python environment

Arguments:
1 - Action ( add | remove )
2 - Layers
semi-colon separated list of layers (including gdb) to act upon
e.g. "DRGs.gdb\Vintage_24K;LiDAR.gdb\AnotherLayer"
'''

import json
from os.path import dirname, join, realpath, basename
from sys import argv

import arcpy
from raster_secrets import SHARE

current_folder = dirname(realpath(__file__))
local_folder = r'C:\forklift\data\production'
sgid = join(current_folder, 'SGID.sde')


def manage_pallet_layers(layers, action):
    print('{}ing layers to layers.json file (used by RasterPallet.py)'.format(action))
    json_path = join(current_folder, 'layers.json')
    with open(json_path, 'r') as read_file:
        existing_layers = json.loads(read_file.read())

    new_layers = existing_layers
    if action == 'add':
        new_layers += map(lambda l: basename(l), layers)
    else:
        for layer in layers:
            try:
                new_layers.remove(basename(layer))
            except ValueError:
                raise Exception('layer not found in layers.json! {}'.format(layer))
    with open(json_path, 'w') as write_file:
        write_file.write(json.dumps(new_layers, indent=4))


def manage_gdb_layers(layers, action):
    folders = [local_folder]
    print('{}ing layers to raster gdbs in these folders: {}'.format(action, folders))
    for layer in layers:
        for folder in folders:
            if action == 'add':
                if (not arcpy.Exists(join(folder, layer))):
                    print('projecting {} into {}'.format(layer, folder))
                    arcpy.management.Project(join(SHARE, layer), join(folder, layer), arcpy.SpatialReference(3857))
            else:
                print('deleting {} from {}'.format(layer, folder))
                arcpy.management.Delete(join(folder, layer))


def manage_map_layers(layers, action):
    print('{}ing layers to/from maps.aprx'.format(action))
    project_path = join(current_folder, '..', 'maps', 'Raster.aprx')
    project = arcpy.mp.ArcGISProject(project_path)
    map = project.listMaps('Raster')[0]
    template_path = join(current_folder, 'template.lyrx')

    for layer_name in layers:
        print(layer_name)

        if action == 'add':
            layer_file = arcpy.mp.LayerFile(template_path)
            layer = layer_file.listLayers()[0]
            layer.name = basename(layer_name)
            props_copy = layer.connectionProperties
            props_copy['connection_info']['database'] = dirname(join(local_folder, layer_name))
            props_copy['dataset'] = basename(layer_name)
            layer.updateConnectionProperties(layer.connectionProperties, props_copy)
            map.addLayer(layer, 'BOTTOM')
        else:
            existing_layers = map.listLayers(basename(layer_name))[0]

            if len(existing_layers) == 0:
                raise Exception('Layer not found in mxd! {}'.format(basename(layer_name)))

            map.removeLayer(existing_layers[0])

    project.save()

    layers = map.listLayers()

    def FindLayer(name):
        for l in layers:
            if l.name == name:
                return True

        print('ERROR! Could not find layer: %s' % name)

    print('validating that all indexes in the extents feature classes (SDE) are added as layers in mxd')
    for extent_layer in [l for l in layers if l.name.endswith('_Extents')]:
        cur = arcpy.SearchCursor(join(sgid, 'SGID.INDICES.' + extent_layer.name), "In_House = 'Yes' AND SHOW = 'Y'")
        print('searching %s' % extent_layer)
        for row in cur:
            FindLayer(row.Tile_Index)


action = argv[1]
if action not in ['add', 'remove']:
    raise Exception('Invalid argument! {} is not "add" or "remove".'.format(action))

try:
    layers = argv[2].split(';')
except Exception:
    layers = input('New layer(s) including gdb separated by ";" (e.g. DRGs.gdb\Vintage_24K): ').split(';')

manage_pallet_layers(layers, action)
manage_gdb_layers(layers, action)
manage_map_layers(layers, action)

print('layers were successfully {}ed:\n{}'.format(action, '\n'.join(layers)))
