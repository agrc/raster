define([
    'dojo/has',
    'dojo/request/xhr'
], function (
    has,
    xhr
) {
    var config = {
        appName: 'Raster',
        version: '2.0.2',
        wkid: 26912,
        urls: {
            mapService: '/ArcGIS/rest/services/Raster/MapServer',
            geoService: '/ArcGIS/rest/services/Geometry/GeometryServer',
            discover: 'https://discover.agrc.utah.gov/login/path/<quadWord>/tiles/<serviceName>/${level}/${col}/${row}'
        },
        topics: {
            clearPreview: 'raster.clearPreview',
            showPreview: 'raster.showPreview',
            hidePreview: 'raster.hidePreview',
            downloadComplete: 'raster.downloadComplete',
            downloadClick: 'raster.downloadClick',
            showPreview: 'raster.showPreview',
            hidePreview: 'raster.hidePreview',
            zoomToExtent: 'raster.zoomToExtent'
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
                LYR_File: 'LYR_File',
                ServiceName: 'ServiceName'
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
        rightClickTxt: 'You may have to right-click and select "save as" to download the files.',
        demDisclaimerTxt: '<strong>Please note:</strong> The auto-correlation process is not as rigorous as other methods of elevation modeling such as photogrammetry, lidar mapping, radar mapping, etc, and therefore end-users should be aware that anomalies are expected within the elevation dataset.',
        autoDEM: 'Auto-Correlated DEM'
    };

    if (has('agrc-build') === 'prod') {
        config.apiKey = 'AGRC-81AF0E22246112';
        config.quadWord = 'alfred-plaster-crystal-dexter';
    } else if (has('agrc-build') === 'stage') {
        config.quadWord = 'opera-event-little-pinball';
        config.apiKey = 'AGRC-AC122FA9671436';
    } else {
        xhr(require.baseUrl + 'secrets.json', {
            handleAs: 'json',
            sync: true
        }).then(function (secrets) {
            config.quadWord = secrets.quadWord;
            config.apiKey = secrets.apiKey;
        }, function () {
            throw 'Error getting secrets!';
        });
    }
    return config;
});
