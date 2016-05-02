define([
    'app/config',
    'app/IdentifyResults',

    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/tasks/IdentifyParameters',
    'esri/tasks/IdentifyTask'
], function (
    config,
    IdentifyResults,

    declare,
    lang,

    IdentifyParameters,
    IdentifyTask
) {
    return declare(null, {
        // summary:
        //      in charge of search through map services

        // identifyTask: Identify
        iTask: null,

        // iParams: IdentifyParameters
        iParams: null,


        // Parameters passed in via the constructor

        // map: esri.Map
        map: null,

        constructor: function (params) {
            console.log('app/Search:constructor', arguments);

            lang.mixin(this, params);

            this.initIdentifyTask();
        },
        initIdentifyTask: function () {
            // summary:
            //      Sets up the identify task.
            console.log('app/Search:initIdentifyTask', arguments);

            this.iParams = new IdentifyParameters();
            this.iParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
            this.iParams.returnGeometry = true;
            this.iParams.tolerance = 0;

            this.iTask = new IdentifyTask(config.urls.mapService);
            this.iTask.on('complete', lang.hitch(this, 'onTaskComplete'));
            this.iTask.on('error', lang.hitch(this, 'onTaskError'));
        },
        search: function (geometry, layerIds) {
            // summary:
            //      description
            // geometry: esri.geometry.Geometry
            console.log('app/Search:search', arguments);

            this.iParams.geometry = geometry;
            this.iParams.layerIds = layerIds;

            this.iParams.height = this.map.height;
            this.iParams.width = this.map.width;
            this.iParams.mapExtent = this.map.extent;
            this.iParams.maxAllowableOffset = (this.map.extent.getWidth() / this.map.width) * 0.75;

            this.iTask.execute(this.iParams);

            // zoom to geometry if it's a line or polygon
            if (geometry.type === 'polyline' || geometry.type === 'polygon') {
                this.map.setExtent(geometry.getExtent(), true);
            }
        },
        onTaskComplete: function (responses) {
            // summary:
            //      description
            console.log('app/Search:onTaskComplete', arguments);

            var results = new IdentifyResults();

            responses.results.forEach(function (iResult) {
                results.add(iResult);
            });

            this.onSearchComplete(results);
        },
        onSearchComplete: function () {
            // summary:
            //      Event for toolbox to hook to.
            // results: raster.CustomIdentifyResults
            console.log('app/Search:onSearchComplete', arguments);
        },
        onTaskError: function () {
            // summary:
            //      description
            console.log('app/Search:onTaskError', arguments);
        }
    });
});
