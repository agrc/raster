#!/usr/bin/env python
# * coding: utf8 *
'''
RasterPallet.py

A module that contains a forklift pallet definition for the Raster app.
'''

from json import loads
from os.path import dirname, join, realpath, basename

import arcpy
from forklift.models import Pallet

import raster_secrets as secrets


current_folder = dirname(realpath(__file__))
layers_json_file = join(current_folder, 'layers.json')


class RasterPallet(Pallet):
    def build(self, configuration):
        #: this is so that crates with sources that are not in 26912 will not choke on reprojecting
        self.geographic_transformation = None
        self.indices = join(self.staging_rack, 'indices.gdb')
        self.sgid = join(self.garage, 'SGID as INDICES.sde')

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

        self.log.info('adding crates for all all layers from layer.json')
        with open(layers_json_file) as file:
            layers = loads(file.read())

        arcpy.env.workspace = secrets.SHARE
        for source_gdb in arcpy.ListWorkspaces(workspace_type='FileGDB'):
            self.log.debug(source_gdb)
            arcpy.env.workspace = source_gdb
            destination_gdb = join(self.staging_rack, basename(source_gdb))

            crate_layers = [name for name in arcpy.ListFeatureClasses() if name in layers]

            if len(crate_layers) > 0:
                self.add_crates(crate_layers, {'source_workspace': source_gdb, 'destination_workspace': destination_gdb})
                self.copy_data.append(destination_gdb)
