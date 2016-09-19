#!/usr/bin/env python
# * coding: utf8 *
'''
RasterPallet.py

A module that contains a forklift pallet definition for the Raster app.
It updates all data in the raster.gdb database.
The DRG.gdb database is managed manually in staging.
'''

import arcpy
from forklift.models import Pallet
from os.path import join


class RasterPallet(Pallet):
    def build(self, configuration):
        self.staging = r'C:\Scheduled\staging'
        self.drg = join(self.staging, 'drg.gdb')
        self.raster = join(self.staging, 'raster.gdb')
        self.sgid = join(self.garage, 'SGID10 as INDICES.sde')

        self.copy_data = [self.drg, self.raster]
        self.arcgis_services = [('Raster', 'MapServer')]

        arcpy.env.workspace = self.raster
        self.add_crates(arcpy.ListFeatureClasses(), {'source_workspace': self.sgid, 'destination_workspace': self.raster})

        arcpy.env.workspace = None
