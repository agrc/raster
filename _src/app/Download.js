define([
    'app/config',
    'app/ProductResult',
    'app/ResultGroup',
    'app/Tile',
    'app/TilePopup',
    'app/_QueryTaskMixin',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!app/templates/Download.html',
    'dojo/topic',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/GraphicsLayer',
    'esri/tasks/GeometryService'
], function (
    config,
    ProductResult,
    ResultGroup,
    Tile,
    TilePopup,
    _QueryTaskMixin,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    domConstruct,
    template,
    topic,
    array,
    declare,
    lang,

    ArcGISDynamicMapServiceLayer,
    GraphicsLayer,
    GeometryService
) {
    return declare([_WidgetBase, _TemplatedMixin, _QueryTaskMixin, _WidgetsInTemplateMixin], {
        // description:

        widgetsInTemplate: true,
        templateString: template,

        // baseClass: [private] String
        //    The css class that is applied to the base div of the widget markup
        baseClass: 'download',

        // graphic: esri.Graphic
        graphic: null,

        // currentIndex: Number
        currentIndex: null,

        // layer: ArcGISDynamicMapServiceLayer
        layer: null,

        // title: String
        title: '',

        // tiles: Tile[]
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
        rightClickTxt: config.rightClickTxt,


        // Parameters to constructor

        // drawingGraphicsLayer: esri.layer.GraphicsLayer
        drawingGraphicsLayer: null,

        // toolbox: Toolbox
        toolbox: null,

        constructor: function () {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.log('app/Download:constructor', arguments);

            this.map = window.rasterapp.map;

            this.layer = new ArcGISDynamicMapServiceLayer(config.urls.mapService);
            this.map.addLayer(this.layer);

            this.tilesGraphicsLayer = new GraphicsLayer();
            this.map.addLayer(this.tilesGraphicsLayer);

            this.tiles = [];
        },
        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/Download:postCreate', arguments);

            this.tilesContainer = new ResultGroup({
                title: 'Selected Tiles',
                forceOpen: true
            }, this.tilesContainer);

            topic.subscribe(config.topics.showPreview, lang.hitch(this, 'togglePreview'));
            topic.subscribe(config.topics.hidePreview, lang.hitch(this, function () {
                this.togglePreview(this.map);
            }));
            topic.subscribe(config.topics.clearPreview, lang.hitch(this, function () {
                this.togglePreview(this.map);
            }));

            this.addMapConnects();
        },
        setGraphic: function (graphic) {
            // summary:
            //      Sets the graphic on the widget and populates all of the other stuff
            //      Also fires off the method that sets up the query task to point to the correct layer
            console.log('app/Download:setGraphic', arguments);

            var aoiGeometry = this.drawingGraphicsLayer.graphics[0].geometry;

            this.map.infoWindow.hide();

            this.nothingMessage.innerHTML = this.gettingTilesMsg;

            this.graphic = graphic;

            this.currentLayerId = this.getLayerId(graphic.attributes[config.fields.common.Tile_Index]);

            // query for tiles
            // get intersection between aoi and graphic
            if (!this.geoService) {
                this.geoService = new GeometryService(config.urls.geoService);
            }
            var that = this;
            this.geoService.intersect([aoiGeometry], graphic.geometry, function (geometries) {
                that.setUpQueryTask(config.urls.mapService + '/' + that.currentLayerId, {
                    returnGeometry: true,
                    outFields: ['*']
                });
                that.executeQueryTask(geometries[0]);
            }, function (er) {
                console.error('There was an error with the geometry service', er);
            });

            this.set('title', graphic.attributes[config.fields.common.Description]);

            this.clearResults();

            // display dem disclaimer text if appropriate
            if (graphic.attributes[config.fields.common.Product] === config.autoDEM) {
                this.noteTxt.innerHTML = config.demDisclaimerTxt;
            } else {
                this.noteTxt.innerHTML = '';
            }

            var checkProjectLevelLink = function (fld, node) {
                var value = that.graphic.attributes[fld];
                var hasValue = value && value.length > 0;
                if (hasValue) {
                    node.href = that.graphic.attributes[config.fields.common.FTP_Path] + value;
                }
                domClass.toggle(node, 'hidden', !hasValue);
            };
            checkProjectLevelLink(config.fields.common.METADATA, this.metadataLink);
            checkProjectLevelLink(config.fields.common.REPORT, this.reportLink);
        },
        onQueryTaskError: function (err) {
            // summary:
            //      error callback for query task
            // err: Error Object
            console.log('app/Download:onQueryTaskError', arguments);

            console.error(err);
            //
            // topic.publish(config.topics.toast, {
            //     type: 'danger',
            //     message: 'Error during query for tiles!'
            // });

            topic.publish(config.topics.downloadComplete);
        },
        onQueryTaskComplete: function (result) {
            // summary:
            //      callback for query task
            // fSet: esri.FeatureSet
            console.log('app/Download:onQueryTaskComplete', arguments);

            var fSet = result.featureSet;

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
                fSet.features.forEach(function (f) {
                    ids.push(f.attributes[config.fields.indices.TILE]);
                    // add extra fields from DEM's & LiDAR data Extents graphic on popup
                    f.attributes.EXTENT_ATTRIBUTES = {
                        METADATA: this.graphic.attributes[config.fields.common.METADATA],
                        REPORT: this.graphic.attributes[config.fields.common.REPORT]
                    };
                    f.setSymbol(this.toolbox.resultsSymbol);
                    this.tiles.push(new Tile({
                        graphic: f,
                        graphicsLayer: this.tilesGraphicsLayer
                    }, domConstruct.create('div', null, this.tilesContainer.collapsible)));
                }, this);

                // show indices layer on map
                var layerDefs = [];
                layerDefs[this.currentLayerId] = config.fields.indices.TILE + ' IN (\'' + ids.join('\', \'') + '\')';
                this.layer.setLayerDefinitions(layerDefs, true);
                this.map.reorderLayer(this.layer, this.map.layerIds.length - 1);
                this.layer.setVisibleLayers([this.currentLayerId]);
                this.layer.show();

                this.toggleControls(true);
            }

            topic.publish(config.topics.downloadComplete);
        },
        getLayerId: function (name) {
            // summary:
            //      Loops through all of the layers and returns the layer with the matching name
            // name: String
            // returns: Number
            console.log('app/Download:getLayerId', arguments);

            var id;
            // strip off db and owner from name
            var parts = name.split('.');
            if (parts.length > 1) {
                name = parts[2];
            }
            array.some(this.layer.layerInfos, function (info) {
                if (info.name === name) {
                    id = info.id;

                    return true;
                }

                return false;
            });

            if (id) {
                return id;
            }

            throw new TypeError('No matching layer found for: ' + name);
        },
        toggleControls: function (show) {
            // summary:
            //      Toggles the visibility of the controls
            console.log('app/Download:toggleControls', arguments);

            var func;
            var otherFunc;

            func = (show) ? domClass.remove : domClass.add;
            otherFunc = (show) ? domClass.add : domClass.remove;

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
            console.log('app/Download:clearResults', arguments);

            // clear out any old tiles
            this.tiles.forEach(function (tile) {
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
            console.log('app/Download:onMapClick', arguments);

            this.tilesGraphicsLayer.clear();

            // set switch to send to alternate callback
            if (!domClass.contains(this.tilesContainerContainer, 'hidden')) {
                this.mapClickedPoint = evt.screenPoint;
                this.executeQueryTask(evt.mapPoint, this.layer.layerDefinitions[this.currentLayerId]);
            }

            this.map.infoWindow.resize(310, 125);
        },
        onQueryTaskCompleteMapClick: function (fSet) {
            // summary:
            //      callback for query task when the user clicks on the map
            // fSet: esri.tasks.FeatureSet
            console.log('app/Download:onQueryTaskCompleteMapClick', arguments);

            var that = this;
            var addToGraphicsLayer = function (g) {
                g.setSymbol(that.toolbox.resultsSymbol);
                that.tilesGraphicsLayer.add(g);
            };

            // make sure that we got a tile
            if (fSet.features.length === 0) {
                this.map.infoWindow.hide();

                return;
            } else if (fSet.features.length > 1) {
                var content = domConstruct.create('div', {
                    innerHTML: 'Please select a tile below:',
                    className: 'multi-tiles-popup-content'
                });
                fSet.features.forEach(function processFeature(f) {
                    addToGraphicsLayer(f);

                    domConstruct.create('button', {
                        innerHTML: f.attributes[config.fields.indices.TILE],
                        className: 'btn btn-default btn-xs',
                        click: function () {
                            that.onQueryTaskCompleteMapClick({ features: [f] });
                        }
                    }, content);
                }, this);
                this.map.infoWindow.setContent(content);
                this.map.infoWindow.setTitle('Multiple Tiles Found');
            } else {
                // highlight tile on map
                var g = fSet.features[0];
                addToGraphicsLayer(g);

                // create content for popup
                // add extra fields from DEM's & LiDAR data Extents graphic
                g.attributes.EXTENT_ATTRIBUTES = {
                    METADATA: this.graphic.attributes[config.fields.common.METADATA],
                    REPORT: this.graphic.attributes[config.fields.common.REPORT]
                };
                var tilePopup = new TilePopup({
                    graphic: g
                }, domConstruct.create('div'));
                tilePopup.startup();
                this.map.infoWindow.setContent(tilePopup.domNode);
                this.map.infoWindow.setTitle((tilePopup.EXT) ? tilePopup.TILE : tilePopup.NAME);
            }

            this.map.infoWindow.show(this.mapClickedPoint);
            this.mapClickedPoint = false;
        },
        addMapConnects: function () {
            // summary:
            //      description
            console.log('app/Download:addMapConnects', arguments);

            this.mapConnects = [];

            this.mapConnects.push(this.connect(this.map, 'onClick', this.onMapClick));
            this.mapConnects.push(this.connect(this.map.infoWindow, 'onHide', function () {
                this.tilesGraphicsLayer.clear();
            }));
        },
        togglePreview: function (productResult) {
            // summary:
            //      description
            console.log('app/Download:togglePreview', arguments);

            // only switch layers if map is not switched
            if (productResult.previewLyr && productResult.previewLyr.getMap() !== this.map) {
                // remove existing connects
                this.mapConnects.forEach(this.disconnect, this);

                // remove layers from old map
                this.map.removeLayer(this.layer);
                this.map.removeLayer(this.tilesGraphicsLayer);

                this.map = productResult.previewLyr.getMap();

                this.map.addLayer(this.layer);
                this.map.addLayer(this.tilesGraphicsLayer);

                this.addMapConnects();
            }
        }
    });
});
