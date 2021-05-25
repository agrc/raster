/* eslint-disable camelcase, max-len */
define([
    'dojo/has',
    'dojo/request/xhr',

    'esri/config'
], function (
    has,
    xhr,

    esriConfig
) {
    var config = {
        appName: 'Raster',
        version: '2.2.6',
        wkid: 3857,
        urls: {
            mapService: 'https://mapserv.utah.gov/arcgis/rest/services/Raster/MapServer',
            discover: 'https://discover.agrc.utah.gov/login/path/<quadWord>/tiles/<serviceName>/${level}/${col}/${row}'
        },
        googleStorage: 'https://storage.googleapis.com/',
        categoryIds: {
            // these need to match the values of the checkboxes in Toolbox.html
            aerials: 0,
            lidar: 1,
            usgsDEMs: 2,
            autoCorrelated: 3,
            contours: 4,
            topos: 5
        },
        topics: {
            clearPreview: 'raster.clearPreview',
            showPreview: 'raster.showPreview',
            hidePreview: 'raster.hidePreview',
            downloadComplete: 'raster.downloadComplete',
            downloadClick: 'raster.downloadClick',
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
        // raster.utah.gov
        config.apiKey = 'AGRC-30967AD0866524';
        config.quadWord = 'alfred-plaster-crystal-dexter';
    } else if (has('agrc-build') === 'stage') {
        // *.dev.utah.gov
        config.apiKey = 'AGRC-FE1B257E901672';
        config.quadWord = 'wedding-tactic-enrico-yes';
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

    esriConfig.defaults.io.corsEnabledServers.push('mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('api.mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('discover.agrc.utah.gov');

    return config;
});
