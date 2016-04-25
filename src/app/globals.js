var djConfig={
	isDebug: true, // remove for build
	debugAtAllCosts: true, // remove for build
	baseUrl: "./", // remove for build
	modulePaths: { // remove for build
		"agrc": "./agrc",
		"ijit": "./ijit",
		'raster': './raster'
	},
	parseOnLoad: true
};
var rasterglobal = {
	appName: 'Raster',
	version: '1.4.1',
	apiKey: 'AGRC-B64EE510811955',
	urls: {
		mapService: '/ArcGIS/rest/services/Raster/MapServer',
		geoService: '/ArcGIS/rest/services/Geometry/GeometryServer'
	},
	fields: {
		common: {
			Category: 'Category',
			Product: 'Product',
			REST_Endpoint: 'REST_Endpoint',
			Estimated_Date: 'Estimated_Date',
			OBJECTID: 'OBJECTID',
			Description: 'Description',
			File_Format: 'File_Format',
			In_House: 'In_House',
			HTML_Page: 'HTML_Page',
			Average_File_Size: 'Average_File_Size',
			Horizontal_Accuracy: 'Horizontal_Accuracy',
			Contact: 'Contact',
			FTP_Path: 'FTP_Path',
			Tile_Index: 'Tile_Index',
			METADATA: 'METADATA',
			REPORT: 'REPORT',
			LYR_File: 'LYR_File'
		},
		indices: {
			TILE: 'TILE',
			EXT: 'EXT',
			PATH: 'PATH',
			SIZE: 'SIZE',
			WORLDFILE: 'WORLDFILE',
			METADATA: 'METADATA',
			SIZE_FORMATTED: 'SIZE_FORMATTED'
		}
	},
	urlParams: {
		cat: 'cat',
		catGroup: 'catGroup',
		title: 'title'
	},
	feedbackTxt: 'We would also like to hear of any other data that you may know of that should be added to this map.',
	rightClickTxt: "You may have to right-click and select 'save as' to download the files.",
	demDisclaimerTxt: '<strong>Please note:</strong> The auto-correlation process is not as rigorous as other methods of elevation modeling such as photogrammetry, lidar mapping, radar mapping, etc, and therefore end-users should be aware that anomalies are expected within the elevation dataset.',
	autoDEM: 'Auto-Correlated DEM'
};
