/*global dojo, dijit, raster, console, esri, rasterglobal*/
dojo.provide('raster.Search');

dojo.require("raster.IdentifyResults");

dojo.declare("raster.Search", null, {
    // summary:
    //      in charge of search through map services
    
    // identifyTask: esri.tasks.Identify
    iTask: null,
    
    // iParams: esri.tasks.IdentifyParameters
    iParams: null,
    
    
    // Parameters passed in via the constructor
    
    // map: esri.Map
    map: null,
    
    constructor: function(params) {
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        dojo.mixin(this, params);
        
        this.initIdentifyTask();
    },
    initIdentifyTask: function(){
        // summary:
        //      Sets up the identify task.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.iParams = new esri.tasks.IdentifyParameters();
        this.iParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        this.iParams.returnGeometry = true;
        this.iParams.tolerance = 0;
        
        this.iTask = new esri.tasks.IdentifyTask(rasterglobal.urls.mapService);
        dojo.connect(this.iTask, 'onComplete', this, 'onTaskComplete');
        dojo.connect(this.iTask, 'onError', this, 'onTaskError');
    },
    search: function(geometry, layerIds){
        // summary:
        //      description
        // geometry: esri.geometry.Geometry
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
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
    onTaskComplete: function(responses){
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        var results = raster.IdentifyResults();
        
        dojo.forEach(responses, function(iResult) {
            results.add(iResult);
        });
        
        this.onSearchComplete(results);
    },
    onSearchComplete: function(results){
        // summary:
        //      Event for toolbox to hook to.
        // results: raster.CustomIdentifyResults
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    },
    onTaskError: function(er){
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    }
});