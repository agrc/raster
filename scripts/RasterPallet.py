#!/usr/bin/env python
# * coding: utf8 *
'''
RasterPallet.py

A module that contains a forklift pallet definition for the Raster app.
It updates all data in the raster.gdb database.
The DRG.gdb database is managed manually in staging.
'''

from os.path import dirname, join, realpath

from forklift.models import Pallet

current_folder = dirname(realpath(__file__))


class RasterPallet(Pallet):
    def build(self, configuration):
        self.raster = join(self.staging_rack, 'raster.gdb')
        self.sgid = join(self.garage, 'SGID10 as INDICES.sde')

        self.static_data = [r'C:\Scheduled\static\drg.gdb']
        self.copy_data = [self.raster]
        self.arcgis_services = [('Raster', 'MapServer')]

        self.add_crates(['Aerial_Photography_Extents',
                         'AutoCorrelated_DEM_2m',
                         'AutoCorrelated_DEM_5m',
                         'BLM_1970s_QQuads',
                         'Contour_Line_Extents',
                         'Contours_2meter_SLCo',
                         'DEM_Extents',
                         'DEM10_Quads',
                         'DEM30_Quads',
                         'DEM30_Statewide',
                         'DEM90_Quads',
                         'DEM90_Statewide',
                         'DOQ_County',
                         'DOQ_Quads',
                         'HRO2006',
                         'HRO2009',
                         'HRO2012_4_Band',
                         'HRO2012_UintahBasin',
                         'HRO2012',
                         'Iron_Beaver2003_Color',
                         'LiDAR_Extents',
                         'LiDAR2006_1_25m_BareEarth_Tiles',
                         'LiDAR2006_1_25m_Raw_Tiles',
                         'LiDAR2006_1m_BareEarth_Tiles',
                         'LiDAR2006_1m_FirstReturn_Tiles',
                         'LiDAR2006_1m_LastReturn_Tiles',
                         'LiDAR2006_1m_Raw_Tiles',
                         'LiDAR2006_2m_BareEarth_Tiles',
                         'LiDAR2006_2m_Raw_Tiles',
                         'LiDAR2011_10ft_DavisCo_DEM_Tile',
                         'LiDAR2011_1m_BearRiver_DEM_Tiles',
                         'LiDAR2011_1m_CedarValley_DEM_Tiles',
                         'LiDAR2011_1m_GSL_Middle_DEM_Tiles',
                         'LiDAR2011_1m_GSL_North_DEM_Tiles',
                         'LiDAR2011_1m_GSL_South_DEM_Tiles',
                         'LiDAR2011_1m_GSL_Tooele_DEM_Tiles',
                         'LiDAR2011_1m_HurricaneFault_DEM_Tiles',
                         'LiDAR2011_1m_LowryWater_DEM_Tiles',
                         'LiDAR2011_1m_OgdenFEMA_DEM_Tiles',
                         'LiDAR2011_1m_OgdenValley_DEM_Tiles',
                         'LiDAR2013_1m_SanRafael_Tile',
                         'LiDAR2013_2014_50cm_WasatchFront_DSM_Tiles',
                         'LiDAR2013_2014_50cm_WasatchFront_DTM_Tiles',
                         'LiDAR2015_50cm_Rivers_DEM_Tiles',
                         'LiDAR2015_50cm_Rivers_DSM_Tiles',
                         'LiDAR2016_50cm_MonroeMtn_DEM_Tiles',
                         'LiDAR2016_50cm_MonroeMtn_DSM_Tiles',
                         'LiDAR2017_50cm_WVW_DEM_Tiles',
                         'LiDAR2017_50cm_WVW_DSM_Tiles',
                         'NAIP2003_County',
                         'NAIP2003_QQuads',
                         'NAIP2004_County',
                         'NAIP2004_QQuads',
                         'NAIP2006_CIR_County',
                         'NAIP2006_CIR_QQuads',
                         'NAIP2006_County',
                         'NAIP2006_QQuads',
                         'NAIP2009_4_Band_QQuads',
                         'NAIP2009_County',
                         'NAIP2009_QQuads',
                         'NAIP2011_4_Band_QQuads',
                         'NAIP2011_County',
                         'NAIP2014_Band4_QQuads',
                         'NAIP2014_County',
                         'NAIP2014_RGB_QQuads',
                         'NAIP2016_Band4_QQuads',
                         'NAIP2016_County',
                         'NAIP2016_RGB_QQuads',
                         'NED10_County',
                         'NED10_Quads',
                         'NED30_County',
                         'NED30_Statewide',
                         'SLCo_1977_County',
                         'SLCo_1977_Quads',
                         'UAO2003'],
                        {'source_workspace': self.sgid, 'destination_workspace': self.raster})
