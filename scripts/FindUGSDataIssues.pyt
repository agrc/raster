from statistics import mean

import arcpy

fldProject = 'Project'
fldSrcOID = 'src_OBJECTID'
fldAREA = 'AREA'

average_overlap_factor_threshold = 0.35
index_layer_param = arcpy.Parameter(displayName='Scanned Aerial Photograpy Index Layer',
                                    name='tile_index_layer',
                                    datatype='GPFeatureLayer',
                                    parameterType='Required',
                                    direction='input')


class Toolbox(object):
    def __init__(self):
        """Define the toolbox (the name of the toolbox is the name of the
        .pyt file)."""
        self.label = "Toolbox"
        self.alias = ""

        # List of tool classes associated with this toolbox
        self.tools = [FindIncorrectScalesTool, SelectProjectTool]


class SelectProjectTool(object):
    def __init__(self):
        self.label = "Select Project"
        self.description = "Select projects within the index layer"
        self.canRunInBackground = False

    def getParameterInfo(self):
        project_param = arcpy.Parameter(displayName='Project Name',
                                        name='project_param',
                                        datatype='GPString',
                                        parameterType='Required',
                                        direction='input')
        return [index_layer_param, project_param]

    def execute(self, parameters, messages):
        tile_index_layer = parameters[0].valueAsText

        query = '{} = \'{}\''.format(fldProject, parameters[1].valueAsText)
        arcpy.management.SelectLayerByAttribute(tile_index_layer, 'NEW_SELECTION', query)

        #: doesn't look like you can programmatically zoom the map to selected features in pro yet


class FindIncorrectScalesTool(object):
    def __init__(self):
        self.label = "Find Incorrect Scales"
        self.description = "Find scales in the index layer that may be incorrect based on overlap with other tiles within the same project"
        self.canRunInBackground = True

    def getParameterInfo(self):
        return [index_layer_param]

    def execute(self, parameters, messages):
        tile_index_layer = parameters[0].valueAsText

        project = arcpy.mp.ArcGISProject('CURRENT')

        problem_projects = []

        arcpy.management.SelectLayerByAttribute(tile_index_layer, 'CLEAR_SELECTION')

        with arcpy.da.SearchCursor(tile_index_layer, [fldProject], sql_clause=('DISTINCT', None)) as index_cursor:
            for project, in index_cursor:
                messages.addMessage(project)

                layer_where = '{} = \'{}\''.format(fldProject, project)
                arcpy.management.SelectLayerByAttribute(tile_index_layer, 'NEW_SELECTION', layer_where)

                # build source look up so that I can get the areas of the original features
                messages.addMessage('building source area lookup...')
                source_area_lut = {}
                with arcpy.da.SearchCursor(tile_index_layer, ['OID@', 'SHAPE@AREA']) as area_cursor:
                    for oid, area in area_cursor:
                        source_area_lut[oid] = area

                messages.addMessage('running PolygonNeighbors tool...')
                neighbor_table = arcpy.analysis.PolygonNeighbors(tile_index_layer,
                                                                 'in_memory/neighbor_table',
                                                                 area_overlap='AREA_OVERLAP',
                                                                 both_sides='NO_BOTH_SIDES')

                messages.addMessage('looping through neighbor table...')
                overlap_factors = []
                with arcpy.da.SearchCursor(neighbor_table, [fldSrcOID, fldAREA]) as neighbor_cursor:
                    for oid, area in neighbor_cursor:
                        overlap_factor = area / source_area_lut[oid]
                        overlap_factors.append(overlap_factor)

                arcpy.management.Delete(neighbor_table)

                if len(overlap_factors) == 0:
                    continue

                average_overlap_factor = mean(overlap_factors)
                messages.addMessage('average_overlap_factor {}'.format(average_overlap_factor))
                if average_overlap_factor > average_overlap_factor_threshold:
                    problem_projects.append('{}: {}'.format(project, average_overlap_factor))
                    messages.addWarningMessage('project may have a bad scale')

        arcpy.management.SelectLayerByAttribute(tile_index_layer, 'CLEAR_SELECTION')

        if len(problem_projects) > 0:
            messages.addWarningMessage('Projects with scales that may be too small...')

            for project in problem_projects:
                messages.addWarningMessage(project)
