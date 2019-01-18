#!/usr/bin/env python
# * coding: utf8 *
'''
RasterPallet.py

A module that contains a forklift pallet definition for the Raster app.
It updates all data in the raster.gdb database.
The DRG.gdb database is managed manually in staging.
'''

from json import loads
from os.path import dirname, join, realpath, basename

import arcpy
from forklift.models import Pallet

import raster_secrets as secrets


current_folder = dirname(realpath(__file__))


class RasterPallet(Pallet):
    def build(self, configuration):
        self.indices = join(self.staging_rack, 'indicies.gdb')
        self.sgid = join(self.garage, 'SGID10 as INDICES.sde')

        self.copy_data = [self.indices]
        self.arcgis_services = [('Raster', 'MapServer')]

        self.log.info('adding crates for extent feature classes in SGID')
        self.add_crates([
            "Aerial_Photography_Extents",
            "AutoCorrelated_DEM_Extents",
            "Contour_Line_Extents",
            "USGS_DEM_Extents",
            "LiDAR_Extents",
            "DRG_Extents"
        ], {'source_workspace': self.sgid, 'destination_workspace': self.indices})

        self.log.info('adding crates for all data in the agrc/raster share gdbs')
        arcpy.env.workspace = secrets.SHARE
        for source_gdb in arcpy.ListWorkspaces(workspace_type='FileGDB'):
            self.log.debug(source_gdb)
            arcpy.env.workspace = source_gdb
            destination_gdb = join(self.staging_rack, basename(source_gdb))
            self.copy_data.append(destination_gdb)

            self.add_crates(arcpy.ListFeatureClasses(), {'source_workspace': source_gdb, 'destination_workspace': destination_gdb})
