/*globals dojo, console, dijit, raster, rasterglobal, esri, ijit, rasterapp*/
dojo.provide('raster.Download');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('ijit.modules._QueryTaskMixin');
dojo.require('raster.Tile');
dojo.require('raster.ResultGroup');
dojo.require('raster.TilePopup');
dojo.require('raster.ProductResult');
dojo.require('raster.Toolbox');

dojo.declare('raster.Download', [dijit._Widget, dijit._Templated, ijit.modules._QueryTaskMixin], {
    // description:

    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl('raster', 'templates/Download.html'),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: 'download',
    
    // graphic: esri.Graphic
    graphic: null,

    // currentIndex: Number
    currentIndex: null,

    // layer: esri.layers.ArcGISDynamicMapServiceLayer
    layer: null,

    // title: String
    title: '',

    // attributeMap
    attributeMap: dojo.delegate(dijit._Widget.prototype.attributeMap, {
        title: {
            node: 'titleSpan',
            type: 'innerHTML'
        }
    }),

    // ftpPath: String
    ftpPath: null,

    // tiles: raster.Tile[]
    tiles: null,

    // tilesGraphicsLayer: esri.layer.GraphicsLayer
    tilesGraphicsLayer: null,

    // gettingTilesMsg: String
    gettingTilesMsg: 'Getting available tiles...',

    // tooManyTilesMsg: String
    tooManyTilesMsg: 'Too many tiles selected. Please define a smaller area of interest.',

    // nothingMessage: String
    nothingMessageTxt: 'No downloads available yet. Please click on the download button from Step 3 above.',

    // currentLayerId: Number
    currentLayerId: null,

    // mapClickedPoint: esri.Point
    mapClickedPoint: null,

    // map: esri.Map
    //      The current map (either map or previewMap)
    map: null,

    // mapConnects: dojo.connect handle[]
    //      handles for all of the map connects
    mapConnects: null,

    // geoService: esri.tasks.GeometryService
    //      used for intersect in setGraphic
    geoService: null,

    // rightClickTxt: String
    rightClickTxt: rasterglobal.rightClickTxt,

    // onDownloadCompleteChannelName: String
    onDownloadCompleteChannelName: 'raster.Download.onDownloadComplete',


    // Parameters to constructor

    // drawingGraphicsLayer: esri.layer.GraphicsLayer
    drawingGraphicsLayer: null,

    // toolbox: raster.Toolbox
    toolbox: null,
    
    constructor: function(params, div) {
        // summary:
        //    Constructor method
        // params: Object
        //    Parameters to pass into the widget. Required values include:
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);

        this.map = rasterapp.map;

        this.layer = new esri.layers.ArcGISDynamicMapServiceLayer(rasterglobal.urls.mapService);
        this.map.addLayer(this.layer);
        
        this.tilesGraphicsLayer = new esri.layers.GraphicsLayer();
        this.map.addLayer(this.tilesGraphicsLayer);
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        // tags:
        //    private
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);

        this.tilesContainer = new raster.ResultGroup({
            title: 'Selected Tiles',
            forceOpen: true
        }, this.tilesContainer);

        this.subscribe(raster.ProductResult.prototype.showPreviewChannelName, function () {
            this.togglePreview(rasterapp.previewMap);
        });
        this.subscribe(raster.ProductResult.prototype.hidePreviewChannelName, function () {
            this.togglePreview(rasterapp.map);
        });
        this.subscribe(raster.Toolbox.prototype.clearPreviewChannelName, function () {
            this.togglePreview(rasterapp.map);
        });

        this.addMapConnects();
    },
    setGraphic: function (graphic) {
        // summary:
        //      Sets the graphic on the widget and populates all of the other stuff
        //      Also fires off the method that sets up the query task to point to the correct layer
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        var aoiGeometry = this.drawingGraphicsLayer.graphics[0].geometry;

        this.map.infoWindow.hide();

        this.nothingMessage.innerHTML = this.gettingTilesMsg;

        this.graphic = graphic;

        this.currentLayerId = this.getLayerId(graphic.attributes[rasterglobal.fields.common.Tile_Index]);
        
        // query for tiles
        // get intersection between aoi and graphic
        if (!this.geoService) {
            this.geoService = new esri.tasks.GeometryService(rasterglobal.urls.geoService);
        }
        var that = this;
        this.geoService.intersect([aoiGeometry], graphic.geometry, function (geometries) {
            that.setUpQueryTask(rasterglobal.urls.mapService + '/' + that.currentLayerId, {
                returnGeometry: true,
                outFields: ['*']
            });
            that.executeQueryTask(geometries[0]);
        }, function (er) {
            console.error('There was an error with the geometry service', er);
        });

        this.set('title', graphic.attributes[rasterglobal.fields.common.Description]);
        this.ftpPath = graphic.attributes[rasterglobal.fields.common.FTP_Path];

        this.clearResults();

        // display dem disclaimer text if appropriate
        if (graphic.attributes[rasterglobal.fields.common.Product] === rasterglobal.autoDEM) {
            this.noteTxt.innerHTML = rasterglobal.demDisclaimerTxt;
        } else {
            this.noteTxt.innerHTML = '';
        }
    },
    onQueryTaskComplete: function (fSet) {
        // summary:
        //      callback for query task
        // fSet: esri.FeatureSet
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        // send to alternate callback when the user clicked on the map
        if (this.mapClickedPoint) {
            this.onQueryTaskCompleteMapClick(fSet);
            return;
        }
    
        if (fSet.features.length === 0) {
            throw new TypeError('No tiles found! That ain\'t good!');
        }
        if (fSet.features.length > 500) {
            this.nothingMessage.innerHTML = this.tooManyTilesMsg;
        } else {
            var ids = [];
            dojo.forEach(fSet.features, function (f) {
                ids.push(f.attributes[rasterglobal.fields.indices.TILE]);
                // add extra fields from DEM's & LiDAR data Extents graphic
                f.attributes.EXTENT_ATTRIBUTES = {
                    METADATA: this.graphic.attributes[rasterglobal.fields.common.METADATA],
                    REPORT: this.graphic.attributes[rasterglobal.fields.common.REPORT]
                };
                f.setSymbol(this.toolbox.resultsSymbol);
                this.tiles.push(new raster.Tile({
                    graphic: f,
                    graphicsLayer: this.tilesGraphicsLayer
                }, dojo.create('div', null, this.tilesContainer.containerNode)));
            }, this);

            // show indices layer on map
            var layerDefs = [];
            layerDefs[this.currentLayerId] = rasterglobal.fields.indices.TILE + " IN ('" + ids.join("', '") + "')";
            this.layer.setLayerDefinitions(layerDefs, true);
            this.map.reorderLayer(this.layer, this.map.layerIds.length - 1);
            this.layer.setVisibleLayers([this.currentLayerId]);
            this.layer.show();

            this.toggleControls(true);
        }

        dojo.publish(this.onDownloadCompleteChannelName);
    },
    getLayerId: function (name) {
        // summary:
        //      Loops through all of the layers and returns the layer with the matching name
        // name: String
        // returns: Number
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        var id;
        // strip off db and owner from name
        var parts = name.split('.');
        if (parts.length > 1) {
            name = parts[2];
        }
        var found = dojo.some(this.layer.layerInfos, function (info) {
            if (info.name === name) {
                id = info.id;
                return true;
            } else {
                return false;
            }
        });

        if (id) {
            return id;
        } else {
            throw new TypeError('No matching layer found for: ' + name);
        }
    },
    toggleControls: function (show) {
        // summary:
        //      Toggles the visibility of the controls
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        var func;
        var otherFunc;

        func = (show) ? dojo.removeClass : dojo.addClass;
        otherFunc = (!show) ? dojo.removeClass : dojo.addClass;

        func(this.titleSpan, 'hidden');
        func(this.tilesContainerContainer, 'hidden');

        otherFunc(this.nothingMessage, 'hidden');

        if (!show) {
            this.nothingMessage.innerHTML = this.nothingMessageTxt;
        }
    },
    clearResults: function () {
        // summary:
        //      clears out the tiles and hides the controls
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        // clear out any old tiles
        dojo.forEach(this.tiles, function (tile) {
            tile.destroy();
        });
        this.tiles = [];

        this.toggleControls(false);

        this.layer.hide();

        this.map.infoWindow.hide();

        this.tilesGraphicsLayer.clear();
    },
    onMapClick: function (evt) {
        // summary:
        //      fires when the user clicks on the map
        // evt: Event
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.tilesGraphicsLayer.clear();
    
        // set switch to send to alternate callback
        if (!dojo.hasClass(this.tilesContainerContainer, 'hidden')) {
            this.mapClickedPoint = evt.screenPoint;
            this.executeQueryTask(evt.mapPoint, this.layer.layerDefinitions[this.currentLayerId]);
        }

        this.map.infoWindow.resize(310, 125);
    },
    onQueryTaskCompleteMapClick: function (fSet) {
        // summary:
        //      callback for query task when the user clicks on the map
        // fSet: esri.tasks.FeatureSet
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        // make sure that we got a tile
        if (fSet.features.length === 0) {
            this.map.infoWindow.hide();
            return;
        }

        // highlight tile on map
        var g = fSet.features[0];
        g.setSymbol(this.toolbox.resultsSymbol);
        this.tilesGraphicsLayer.add(g);

        // create content for popup
        // add extra fields from DEM's & LiDAR data Extents graphic
        g.attributes.EXTENT_ATTRIBUTES = {
            METADATA: this.graphic.attributes[rasterglobal.fields.common.METADATA],
            REPORT: this.graphic.attributes[rasterglobal.fields.common.REPORT]
        };
        var tilePopup = new raster.TilePopup({
            graphic: g
        }, dojo.create('div'));
        tilePopup.startup();
        this.map.infoWindow.setContent(tilePopup.domNode);
        this.map.infoWindow.setTitle((tilePopup.EXT) ? tilePopup.TILE : tilePopup.NAME);

        this.map.infoWindow.show(this.mapClickedPoint);

        this.mapClickedPoint = false;
    },
    addMapConnects: function () {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.mapConnects = [];
    
        this.mapConnects.push(this.connect(this.map, 'onClick', this.onMapClick));
        this.mapConnects.push(this.connect(this.map.infoWindow, 'onHide', function () {
            this.tilesGraphicsLayer.clear();
        }));
    },
    togglePreview: function (newMap) {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        // only switch layers if map is not switched
        if (newMap !== this.map) {
            // remove existing connects
            dojo.forEach(this.mapConnects, this.disconnect, this);

            // remove layers from old map
            this.map.removeLayer(this.layer);
            this.map.removeLayer(this.tilesGraphicsLayer);

            this.map = newMap;

            this.map.addLayer(this.layer);
            this.map.addLayer(this.tilesGraphicsLayer);

            this.addMapConnects();
        }
    }
});