#!/usr/bin/env python
# * coding: utf8 *
'''
RasterPallet.py

A module that contains a forklift pallet definition for the Raster app.
It updates all data in the raster.gdb database.
The DRG.gdb database is managed manually in staging.
'''

from json import loads
from os.path import dirname, join, realpath

from forklift.models import Pallet

current_folder = dirname(realpath(__file__))
layersJSONFile = join(current_folder, 'layers.json')


class RasterPallet(Pallet):
    def build(self, configuration):
        self.raster = join(self.staging_rack, 'raster.gdb')
        self.sgid = join(self.garage, 'SGID10 as INDICES.sde')

        self.static_data = [r'C:\Scheduled\static\drg.gdb']
        self.copy_data = [self.raster]
        self.arcgis_services = [('Raster', 'MapServer')]

        with open(layersJSONFile) as jfile:
            layers = loads(jfile.read())

        self.add_crates(layers, {'source_workspace': self.sgid, 'destination_workspace': self.raster})
