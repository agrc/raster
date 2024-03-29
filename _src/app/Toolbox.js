define([
    'agrc/widgets/locate/FindAddress',

    'app/config',
    'app/Download',
    'app/MainAppLink',
    'app/ProductResult',
    'app/ResultGroup',
    'app/Search',

    'dijit/form/Button',
    'dijit/form/ToggleButton',
    'dijit/registry',
    'dijit/Toolbar',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/on',
    'dojo/query',
    'dojo/text!app/templates/Toolbox.html',
    'dojo/topic',
    'dojo/_base/Color',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/config',
    'esri/dijit/Scalebar',
    'esri/geometry/projection',
    'esri/graphic',
    'esri/layers/GraphicsLayer',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/toolbars/draw',

    'bootstrap'
], function (
    FindAddress,

    config,
    Download,
    MainAppLink,
    ProductResult,
    ResultGroup,
    Search,

    Button,
    ToggleButton,
    registry,
    Toolbar,
    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    domConstruct,
    domStyle,
    on,
    query,
    template,
    topic,
    Color,
    declare,
    lang,

    esriConfig,
    Scalebar,
    projection,
    Graphic,
    GraphicsLayer,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Query,
    QueryTask,
    Draw
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:

        widgetsInTemplate: true,

        templateString: template,

        // baseClass: [private] String
        //    The css class that is applied to the base div of the widget markup
        baseClass: 'raster-toolbox',

        // drawToolbar: esri.toolbars.Draw
        drawToolbar: null,

        // drawingGraphics: GraphicsLayer
        drawingGraphics: null,

        // findAddress: raster.FindAddress
        findAddress: null,

        // search: raster.Search
        search: null,

        // extentGraphics: GraphicsLayer
        extentGraphics: null,

        // resultsSymbol: SimpleFillSymbol
        resultsSymbol: null,

        // catSymbol: SimpleFillSymbol
        //      the symbol used to display the extents of the selected category
        //      when passed via the url
        catSymbol: null,

        // resultGroups: raster.ResultGroup[]
        resultGroups: [],

        // download: raster.Download
        download: null,

        // defaultZoomDuration: Number
        //      A place to store this value when we temporarily change it to 0
        //      in togglePreview
        defaultZoomDuration: null,

        // defaultPanDuration: Number
        //      see defaultZoomDuration above
        defaultPanDuration: null,

        // previewScalebar: esri.dijit.Scalebar
        //      description
        previewScalebar: null,


        // Parameters to constructor

        // map: esri.Map
        map: null,

        // previewMapUtm: esri.Map
        previewMapUtm: null,

        // previewMapWebMerc: esri.Map
        previewMapWebMerc: null,

        // cat: [optional] String
        //      The category as passed in via the cat url parameter, if any
        cat: null,

        // catGroup: [optional] String[]
        //      The groups of categories as passed in via the groupCat parameter, if any
        catGroup: null,

        // products: [optional] String[]
        //      The products as passed in via the products parameter, if any
        products: null,

        constructor: function () {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.log('app/Toolbox:constructor', arguments);

            this.defaultZoomDuration = esriConfig.defaults.map.zoomDuration;
            this.defaultPanDuration = esriConfig.defaults.map.panDuration;
        },
        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/Toolbox:postCreate', arguments);

            this.drawingGraphics = new GraphicsLayer();
            this.map.addLayer(this.drawingGraphics);

            this.findAddress = new FindAddress({
                wkid: config.wkid,
                map: this.map,
                apiKey: config.apiKey,
                graphicsLayer: this.drawingGraphics,
                zoomLevel: 17
            }, 'find-address');

            this.initDrawingToolbar();

            this.resultsSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new Color([255, 255, 0]), 3), null);
            this.catSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                new SimpleLineSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new Color([255, 204, 0]), 3), null);

            this.search = new Search({ map: this.map });

            if (this.products) {
                this.setProducts();
            }

            if (this.cat || this.catGroup) {
                this.setCategory();
            }

            this._wireEvents();

            this.extentGraphics = new GraphicsLayer();
            this.map.addLayer(this.extentGraphics);

            this.download = new Download({
                drawingGraphicsLayer: this.drawingGraphics,
                toolbox: this
            }, this.downloadDiv);

            $('[data-toggle="tooltip"]').tooltip({
                delay: 200,
                placement: 'right'
            });
        },
        setProducts: function () {
            // summary:
            //      pre-checks the products that are passed in via the url
            console.log('app/Toolbox:setProducts', arguments);

            this.products.forEach(function (id) {
                const found = query('.select-products input').some(function (input) {
                    if (input.value === id) {
                        input.checked = true;

                        return true;
                    }
                });

                if (!found) {
                    throw 'Product id not found: ' + id;
                }
            });

            this.step2header.click();
        },
        setCategory: function () {
            // summary:
            //      sets the category for the app
            console.log('app/Toolbox:setCategory', arguments);

            domClass.add(this.stepOneControls, 'hidden');
            domClass.remove(this.preLoader, 'hidden');

            var querytxt;

            // find out which product checkbox to check
            if (this.cat) {
                querytxt = config.fields.common.Category + ' = \'' + this.cat + '\'';
            } else {
                querytxt = config.fields.common.Category + ' IN (\'' + this.catGroup.join('\',\'') + '\')';
            }
            var queryTaskQuery = new Query();
            queryTaskQuery.where = querytxt;
            queryTaskQuery.returnGeometry = true;

            var tasks = [];
            // loop through checkboxes and create a query task for each one
            query('.select-products input').forEach(function (input, idx) {
                tasks.push({
                    qTask: new QueryTask(config.urls.mapService + '/' + input.value),
                    input: input
                });

                // disable them as well
                input.disabled = true;

                // set layer defs on identify task
                if (!this.search.iParams.layerDefinitions) {
                    this.search.iParams.layerDefinitions = {};
                }
                this.search.iParams.layerDefinitions[idx] = querytxt;
            }, this);

            // loop through tasks and fire them off
            var i = tasks.length;
            var found = false;
            tasks.forEach(function (task) {
                // use for testing loader
                // console.log('waiting...');
                // setTimeout(() => {
                task.qTask.execute(queryTaskQuery, lang.hitch(this, function (fSet) {
                    if (fSet.features.length > 0) {
                        var gLayer = new GraphicsLayer();
                        task.input.checked = true;
                        this.step2header.click();
                        found = true;

                        // loop through all returned graphics
                        var extent;
                        fSet.features.forEach(function (g) {
                            g.setSymbol(this.catSymbol);
                            gLayer.add(g);
                            if (extent) {
                                extent = extent.union(g.geometry.getExtent());
                            } else {
                                extent = g.geometry.getExtent();
                            }
                        }, this);
                        this.map.addLayer(gLayer, 0);
                        this.map.setExtent(extent, true);

                        domClass.remove(this.stepOneControls, 'hidden');
                        domClass.add(this.preLoader, 'hidden');
                    }

                    if (i === 1) {
                        if (!found) {
                            throw 'No match found for: ' + this.cat + this.catGroup;
                        }
                    }
                    i = i - 1;
                }), function (e) {
                    throw 'Error with category query.' + e;
                });
                // }, 50000);
            }, this);
        },
        initDrawingToolbar: function () {
            // summary:
            //      Sets up the drawing toolbar
            console.log('app/Toolbox:initDrawingToolbar', arguments);

            this.drawToolbar = new Draw(this.map);
            this.drawToolbar.setMarkerSymbol(this.findAddress.symbol);
            this.drawToolbar.setLineSymbol(this.drawToolbar.lineSymbol.setWidth(4));
            this.drawToolbar.setFillSymbol(this.drawToolbar.fillSymbol.setOutline(this.drawToolbar.lineSymbol));
        },
        _wireEvents: function () {
            // summary:
            //    Wires events.
            // tags:
            //    private
            console.log('app/Toolbox:_wireEvents', arguments);

            this.connect(this.drawToolbar, 'onDrawEnd', this.addDrawingToMap);
            query('.dijitToolbar .dijitToggleButton').forEach(function (node) {
                this.connect(registry.getEnclosingWidget(node), 'onClick', this.onToolbarButtonClick);
            }, this);
            this.connect(this.search, 'onSearchComplete', this.searchComplete);
            topic.subscribe(config.topics.downloadClick, lang.hitch(this, 'onDownloadClick'));
            on(this.clearPreviewBtn, 'click', lang.hitch(this, function () {
                topic.publish(config.topics.clearPreview);
                this.clearPreview();
            }));
            topic.subscribe('agrc.widgets.locate.FindAddress.OnFind', lang.hitch(this, this.onSearchClick));
            this.connect(this.clearAOIBtn, 'onClick', this.onClearAOIButtonClick);
            topic.subscribe(config.topics.showPreview, lang.hitch(this, 'showPreview'));
            topic.subscribe(config.topics.hidePreview, lang.hitch(this, 'clearPreview'));
            topic.subscribe(config.topics.downloadComplete, lang.hitch(this, function () {
                this.step4header.click();
            }));
            topic.subscribe(config.topics.zoomToExtent, lang.hitch(this, 'zoomToExtent'));
        },
        zoomToExtent(extent) {
            // summary:
            //      zooms the currently visible map to the given extent
            // extent: Extent
            console.log('app/Toolbox:zoomToExtent', arguments);

            const map = this.getCurrentMap();

            function finishUp() {
                const projectedGeometry = projection.project(extent, map.spatialReference);
                map.setExtent(projectedGeometry, true);
            }

            if (extent.spatialReference.wkid === map.spatialReference.wkid) {
                map.setExtent(extent, true);
            } else {
                if (!projection.isLoaded()) {
                    projection.load().then(finishUp);
                }

                finishUp();
            }
        },
        addDrawingToMap: function (geometry) {
            // summary:
            //      Fires when the user completes a drawing
            console.log('app/Toolbox:addDrawingToMap', arguments);

            this.drawingGraphics.clear();
            this.drawingGraphics.show();

            // get symbol
            var sym;
            switch (geometry.type) {
                case 'point':
                    sym = this.drawToolbar.markerSymbol;
                    break;
                case 'polyline':
                    sym = this.drawToolbar.lineSymbol;
                    break;
                case 'polygon':
                    sym = this.drawToolbar.fillSymbol;
                    break;
                default:
                    break;
            }

            var g = new Graphic(geometry, sym);
            this.drawingGraphics.add(g);

            this.onSearchClick();
        },
        onToolbarButtonClick: function (evt) {
            // summary:
            //      Fires when the user click a button on the toolbar.
            //      Activates the button with the esri.Toolbar and
            //      un-selects all other buttons.
            console.log('app/Toolbox:onToolbarButtonClick', arguments);

            var clickedButton = registry.getEnclosingWidget(evt.currentTarget);

            // disable drawing toolbar when the use de-selects a tool
            if (!clickedButton.get('checked')) {
                this.drawToolbar.deactivate();

                return;
            }

            this.deselectTools(clickedButton);

            // activate tool
            this.drawToolbar.activate(Draw[clickedButton.get('value')]);

            topic.publish(config.topics.hidePreview);
        },
        deselectTools: function (clickedButton) {
            // summary:
            //      Unselects all toggle buttons on the draw toolbar except for clickedButton
            // clickedButton: dijit.form.ToggleButton [optional]
            console.log('app/Toolbox:deselectTools', arguments);

            // de-select all other buttons
            query('.raster-toolbox .draw-toolbar .icon').forEach(function (btn) {
                var widget = registry.getEnclosingWidget(btn);
                if (clickedButton) {
                    if (widget.id !== clickedButton.id) {
                        widget.set('checked', false);
                    }
                } else {
                    widget.set('checked', false);
                }
            });
        },
        unselectAllTools: function () {
            // summary:
            //      unselects all tools on the toolbar
            console.log('app/Toolbox:unselectAllTools', arguments);

            query('.raster-toolbox .draw-toolbar .icon').forEach(function (btn) {
                registry.getEnclosingWidget(btn).set('checked', false);
            });
        },
        onSearchClick: function () {
            // summary:
            //      Fires when the user clicks the search button
            console.log('app.onSearchClick:onSearchClick', arguments);

            topic.publish(config.topics.hidePreview);
            this.clearSearchResults();

            // check to make sure that some search products are selected
            // check to make sure that a geometry is defined
            var checked = this.getSelectedLayerIds();

            if (checked.length === 0) {
                this.displaySearchWarning(
                    'Please select at least one data category check box in "Step 1 - Select Products"'
                );

                return;
            } else if (this.drawingGraphics.graphics.length === 0) {
                this.displaySearchWarning('Please define an area of interest on the map using the tools above.');

                return;
            }

            domClass.remove(this.searchLoading, 'hidden');
            this.hideSearchWarning();

            try {
                this.search.search(this.drawingGraphics.graphics[0].geometry, checked);
            } catch (er) {
                this.displaySearchWarning('There was an error with the search.');
                domClass.add(this.searchLoading, 'hidden');
            }
        },
        getSelectedLayerIds: function () {
            // summary:
            //      Gets the ids of the layers that are checked in Step 1
            console.log('app/Toolbox:getSelectedLayerIds', arguments);

            var ids = [];
            query('.raster-toolbox .select-products input:checked').forEach(function (chbx) {
                ids.push(chbx.value);
            });

            return ids;
        },
        searchComplete: function (results) {
            // summary:
            //      description
            // results: raster.CustomIdentifyResults
            console.log('app/Toolbox:searchComplete', arguments);

            results.sort();

            var checked = this.getSelectedLayerIds();

            domClass.add(this.noResults, 'hidden');

            // only display results containers that were not checked in 'Select Products'
            query('.results-container').addClass('hidden');
            domClass.add(this.clearPreviewBtn, 'hidden');
            checked.forEach(function (id) {
                var rdiv = this[id + 'Results'].collapsible;

                // clear rdiv
                rdiv.innerHTML = '';

                domClass.remove(this[id + 'ResultsContainer'], 'hidden');

                if (results[id].length > 0) {
                    domClass.remove(this.clearPreviewBtn, 'hidden');
                    // loop through groups
                    var found = false;
                    results[id].forEach(function (result) {
                        // filter out those that don't match the cat or catGroup url params
                        if (window.rasterapp.isProductSpecific &&
                            ((this.cat && result.name !== this.cat) ||
                            (this.catGroup && this.catGroup.indexOf(result.name) === -1))) {
                            return;
                        }
                        found = true;
                        var group = new ResultGroup({
                            title: result.name.replace(new RegExp(' {.*}', 'g'), '')
                        }, domConstruct.create('div', null, rdiv));
                        this.resultGroups.push(group);

                        // loop through products within the group
                        result.products.forEach(function (prod) {
                            // show preview button for aerial photography only if there
                            // is a value for REST_Endpoint
                            prod.setSymbol(this.resultsSymbol);
                            var r = new ProductResult({
                                title: prod.attributes[config.fields.common.Product],
                                gLayer: this.extentGraphics,
                                graphic: prod,
                                previewMapUtm: this.previewMapUtm,
                                previewMapWebMerc: this.previewMapWebMerc,
                                map: this.map,
                                extentLayerId: id
                            }, domConstruct.create('div', null, group.collapsible));
                            r.startup();
                        }, this);
                    }, this);
                }

                if (results[id].length === 0 || !found) {
                    rdiv.innerHTML = 'No data found.';
                }
            }, this);

            this.step3header.click();

            domClass.add(this.searchLoading, 'hidden');

            this.drawToolbar.deactivate();
            this.unselectAllTools();
        },
        displaySearchWarning: function (msg) {
            // summary:
            //      shows the warning box and displays the text
            // msg: String
            console.log('app/Toolbox:displaySearchWarning', arguments);

            this.searchWarning.innerHTML = msg;

            domClass.remove(this.searchWarning, 'hidden');
        },
        hideSearchWarning: function () {
            // summary:
            //      hides the box
            console.log('app/Toolbox:hideSearchWarning', arguments);

            domClass.add(this.searchWarning, 'hidden');
        },
        onDownloadClick: function (graphic) {
            // summary:
            //      description
            // graphic: esri.Graphic
            //      The graphic associated with the ProductResult whos download
            //      button was clicked.
            console.log('app/Toolbox:onDownloadClick', arguments);

            this.download.setGraphic(graphic);
        },
        clearPreview: function () {
            // summary:
            //      Clears the preview if any
            console.log('app/Toolbox:clearPreview', arguments);

            var activePreviewMap = (domStyle.get(this.previewMapUtm.container, 'display') === 'block') ?
                this.previewMapUtm : this.previewMapWebMerc;
            this.toggleMaps(this.map, activePreviewMap);
        },
        toggleMaps(newMap, currentMap) {
            // summary:
            //      description
            // newMap: Map
            // currentMap: Map
            console.log('app/Toolbox:toggleMaps', arguments);

            // don't do anything if the newMap is already showing
            if (domStyle.get(newMap.container, 'display') === 'block') {
                return;
            }

            // move graphics layer
            currentMap.removeLayer(this.drawingGraphics);
            newMap.addLayer(this.drawingGraphics);

            const that = this;
            const setExtent = function (extent) {
                currentMap.setVisibility(false);
                newMap.setVisibility(true);
                window.setTimeout(function () {
                    newMap.resize(true);
                }, 1000);

                esriConfig.defaults.map.zoomDuration = 0;
                esriConfig.defaults.map.panDuration = 0;

                newMap.setExtent(extent);

                esriConfig.defaults.map.zoomDuration = that.defaultZoomDuration;
                esriConfig.defaults.map.panDuration = that.defaultPanDuration;
            };

            function finishUp() {
                const projectedGeometry = projection.project(currentMap.extent, newMap.spatialReference);
                setExtent(projectedGeometry);
            }

            if (newMap.spatialReference.wkid === currentMap.spatialReference.wkid) {
                setExtent(currentMap.extent);
            } else {
                if (!projection.isLoaded()) {
                    projection.load().then(finishUp);
                }

                finishUp();
            }
        },
        getCurrentMap: function () {
            // summary:
            //      returns the currently visible map
            console.log('app/Toolbox:getCurrentMap', arguments);

            if (domStyle.get(this.previewMapUtm.container, 'display') === 'block') {
                return this.previewMapUtm;
            } else if (domStyle.get(this.previewMapWebMerc.container, 'display') === 'block') {
                return this.previewMapWebMerc;
            }

            return this.map;
        },
        showPreview: function (productResult) {
            // summary:
            //      shows the preview map
            // previewMap: BaseMap
            //      The preview map (previewUtm or previewWebMerc) that is to be shown
            console.log('app/Toolbox:showPreview', arguments);

            var previewMap = productResult.previewLyr.getMap();
            this.toggleMaps(previewMap, this.getCurrentMap());

            if (!previewMap.previewScalebar) {
                var handle = previewMap.on('load', lang.hitch(this, function () {
                    previewMap.previewScalebar = new Scalebar({
                        map: previewMap,
                        attachTo: 'top-right'
                    });
                    handle.remove();
                }));
            }
        },
        clearSearchResults: function () {
            // summary:
            //        clears the search results
            console.log('app/Toolbox:clearSearchResults', arguments);

            this.resultGroups.forEach(function (group) {
                group.destroyRecursive();
            });

            this.resultGroups = [];

            this.download.clearResults();
        },
        destroyRecursive: function destroyRecursive() {
            // summary:
            //        overriden to try to clean up more stuff for tests
            console.log('app/Toolbar:destroyRecursive', arguments);

            this.findAddress.destroyRecursive();

            this.inherited(destroyRecursive, arguments);
        },
        onClearAOIButtonClick: function () {
            // summary:
            //      clears the aoi graphic
            console.log('app/Toolbox:onClearAOIButtonClick', arguments);

            this.drawingGraphics.hide();
            this.drawToolbar.deactivate();
            this.deselectTools();
        }
    });
});
