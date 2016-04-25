/*global dojo, console, dijit, ijit, agrc, raster, esri, rasterglobal, rasterapp*/
/*jshint sub:true*/

// provide namespace
dojo.provide("raster.Toolbox");

// dojo widget requires
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

// other dojo requires
dojo.require("dijit.layout.AccordionContainer");
dojo.require("raster.FindAddress");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.Toolbar");
dojo.require("raster.Search");
dojo.require("raster.ProductResult");
dojo.require('raster.ResultGroup');
dojo.require('raster.Download');
dojo['require']('esri.dijit.Scalebar');
dojo.require('raster.MainAppLink');

dojo.declare("raster.Toolbox", [dijit._Widget, dijit._Templated], {
    // description:

    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,

    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl("raster", "templates/Toolbox.html"),

    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: "raster-toolbox",

    // drawToolbar: esri.toolbars.Draw
    drawToolbar: null,

    // drawingGraphics: esri.layers.GraphicsLayer
    drawingGraphics: null,

    // findAddress: raster.FindAddress
    findAddress: null,

    // search: raster.Search
    search: null,

    // extentGraphics: esri.layers.GraphicsLayer
    extentGraphics: null,

    // resultsSymbol: esri.symbol.SimpleFillSymbol
    resultsSymbol: null,

    // catSymbol: esri.symbol.SimpleFillSymbol
    //      the symbol used to display the extents of the selected category
    //      when passed via the url
    catSymbol: null,

    // resultGroups: raster.ResultGroup[]
    resultGroups: [],

    // download: raster.Download
    download: null,

    // clearPreviewChannelName: String
    //      Channel for Product Results to listen for
    clearPreviewChannelName: 'raster.Toolbox.clearPreview',

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

    // previewMap: esri.Map
    previewMap: null,

    // cat: [optional] String
    //      The category as passed in via the cat url parameter, if any
    cat: null,

    // catGroup: [optional] String[]
    //      The groups of categories as passed in via the groupCat parameter, if any
    catGroup: null,

    constructor: function(params, div) {
        // summary:
        //    Constructor method
        // params: Object
        //    Parameters to pass into the widget. Required values include:
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.defaultZoomDuration = esri.config.defaults.map.zoomDuration;
        this.defaultPanDuration = esri.config.defaults.map.panDuration;
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        // tags:
        //    private
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.accordionContainer.startup();

        this.drawingGraphics = new esri.layers.GraphicsLayer();
        this.map.addLayer(this.drawingGraphics);

        this.findAddress = new raster.FindAddress({
            map: this.map,
            apiKey: rasterglobal.apiKey,
            graphicsLayer: this.drawingGraphics,
            onFind: dojo.hitch(this, function() {
                this.onSearchClick();
            })
        }, 'find-address');

        this.initDrawingToolbar();

        this.resultsSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new dojo.Color([255, 255, 0]), 3), null);
        this.catSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new dojo.Color([255, 204, 0]), 3), null);

        this.search = new raster.Search({map: this.map});

        if (this.cat || this.catGroup) {
            this.setCategory();
        }

        this._wireEvents();

        this.extentGraphics = new esri.layers.GraphicsLayer();
        this.map.addLayer(this.extentGraphics);

        this.download = new raster.Download({
            drawingGraphicsLayer: this.drawingGraphics,
            toolbox: this
        }, this.downloadDiv);
    },
    setCategory: function () {
        // summary:
        //      sets the category for the app
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        var querytxt;

        // find out which product checkbox to check
        if (this.cat) {
            querytxt = '"' + rasterglobal.fields.common.Category + "\" = '" + this.cat + "'";
        } else {
            querytxt = '"' + rasterglobal.fields.common.Category + "\" IN ('" + this.catGroup.join("','") + "')";
        }
        var query = new esri.tasks.Query();
        query.where = querytxt;
        query.returnGeometry = true;

        var tasks = [];
        // loop through checkboxes and create a query task for each one
        dojo.query('.select-products input').forEach(function (input, idx) {
            tasks.push({
                qTask: new esri.tasks.QueryTask(rasterglobal.urls.mapService + '/' + input.value),
                input: input
            });

            // disable them as well
            dijit.getEnclosingWidget(input).set('disabled', true);

            // set layer defs on identify task
            if (!this.search.iParams.layerDefinitions) {
                this.search.iParams.layerDefinitions = {};
            }
            this.search.iParams.layerDefinitions[idx] = querytxt;
        }, this);

        // loop through tasks and fire them off
        var i = tasks.length;
        var found = false;
        dojo.forEach(tasks, function (task) {
            task.qTask.execute(query, dojo.hitch(this, function (fSet) {
                if (fSet.features.length > 0) {
                    var gLayer = new esri.layers.GraphicsLayer();
                    dijit.getEnclosingWidget(task.input).set('checked', true);
                    this.accordionContainer.selectChild(this.accordionContainer.getChildren()[1], true);
                    found = true;

                    if (this.cat) {
                        // loop through all returned graphics
                        var extent;
                        dojo.forEach(fSet.features, function (g) {
                            g.setSymbol(this.catSymbol);
                            gLayer.add(g);
                            if (!extent) {
                                extent = g.geometry.getExtent();
                            } else {
                                extent = extent.union(g.geometry.getExtent());
                            }
                        }, this);
                        this.map.addLayer(gLayer, 0);
                        this.map.setExtent(extent, true);
                    }
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
        }, this);
    },
    initDrawingToolbar: function(){
        // summary:
        //      Sets up the drawing toolbar
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.drawToolbar = new esri.toolbars.Draw(this.map);
        this.drawToolbar.setMarkerSymbol(this.findAddress.symbol);
        this.drawToolbar.setLineSymbol(this.drawToolbar.lineSymbol.setWidth(4));
        this.drawToolbar.setFillSymbol(this.drawToolbar.fillSymbol.setOutline(this.drawToolbar.lineSymbol));
    },
    _wireEvents: function() {
        // summary:
        //    Wires events.
        // tags:
        //    private
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.connect(this.drawToolbar, 'onDrawEnd', this.addDrawingToMap);
        dojo.query('.dijitToolbar .dijitToggleButton').forEach(function (node) {
            this.connect(dijit.getEnclosingWidget(node), 'onClick', this.onToolbarButtonClick);
        }, this);
        this.connect(this.search, 'onSearchComplete', this.searchComplete);
        this.subscribe(raster.ProductResult.prototype.downloadClickChannelName, this.onDownloadClick);
        this.connect(this.clearPreviewBtn, 'onClick', function () {
            dojo.publish(this.clearPreviewChannelName);
            this.clearPreview();
        });
        dojo.subscribe("agrc.widgets.locate.FindAddress.OnFind", dojo.hitch(this, this.onSearchClick));
        this.connect(this.clearAOIBtn, 'onClick', this.onClearAOIButtonClick);
        this.subscribe(raster.ProductResult.prototype.showPreviewChannelName, this.showPreview);
        this.subscribe(raster.ProductResult.prototype.hidePreviewChannelName, this.clearPreview);
        this.subscribe(raster.Download.prototype.onDownloadCompleteChannelName, function () {
            this.accordionContainer.selectChild(this.accordionContainer.getChildren()[3], true);
        });
    },
    addDrawingToMap: function(geometry){
        // summary:
        //      Fires when the user completes a drawing
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

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
        }

        var g = new esri.Graphic(geometry, sym);
        this.drawingGraphics.add(g);

        this.onSearchClick();
    },
    onToolbarButtonClick: function(evt) {
        // summary:
        //      Fires when the user click a button on the toolbar.
        //      Activates the button with the esri.Toolbar and
        //      un-selects all other buttons.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        var clickedButton = dijit.getEnclosingWidget(evt.currentTarget);

        // disable drawing toolbar when the use de-selects a tool
        if (!clickedButton.get('checked')) {
            this.drawToolbar.deactivate();
            return;
        }

        this.deselectTools(clickedButton);

        // activate tool
        this.drawToolbar.activate(esri.toolbars.Draw[clickedButton.get('value')]);

        dojo.publish(raster.ProductResult.prototype.hidePreviewChannelName);
    },
    deselectTools: function (clickedButton) {
        // summary:
        //      Unselects all toggle buttons on the draw toolbar except for clickedButton
        // clickedButton: dijit.form.ToggleButton [optional]
        console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);

        // de-select all other buttons
        dojo.query('.raster-toolbox .draw-toolbar .icon').forEach(function (btn) {
            var widget = dijit.getEnclosingWidget(btn);
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
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        dojo.query('.raster-toolbox .draw-toolbar .icon').forEach(function (btn) {
            dijit.getEnclosingWidget(btn).set('checked', false);
        });
    },
    onSearchClick: function(){
        // summary:
        //      Fires when the user clicks the search button
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        dojo.publish(raster.ProductResult.prototype.hidePreviewChannelName);
        this.clearSearchResults();

        // check to make sure that some search products are selected
        // check to make sure that a geometry is defined
        var checked = this.getSelectedLayerIds();

        if (checked.length === 0) {
            this.displaySearchWarning('Please select at least one data category check box in "Step 1 - Select Products"');
            return;
        } else if (this.drawingGraphics.graphics.length === 0) {
            this.displaySearchWarning('Please define an area of interest on the map using the tools above.');
            return;
        }

        dojo.removeClass(this.searchLoading, 'hidden');
        this.hideSearchWarning();

        try {
            this.search.search(this.drawingGraphics.graphics[0].geometry, checked);
        } catch (er) {
            this.displaySearchWarning('There was an error with the search.');
            dojo.addClass(this.searchLoading, 'hidden');
        }
    },
    getSelectedLayerIds: function(){
        // summary:
        //      Gets the ids of the layers that are checked in Step 1
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        var ids = [];
        dojo.query('.raster-toolbox .select-products input[aria-pressed=true]').forEach(function (chbx) {
            ids.push(chbx.value);
        });
        return ids;
    },
    searchComplete: function(results){
        // summary:
        //      description
        // results: raster.CustomIdentifyResults
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        results.sort();

        var checked = this.getSelectedLayerIds();

        dojo.addClass(this.noResults, 'hidden');

        // only display results containers that were not checked in "Select Products"
        dojo.query('.results-container').addClass('hidden');
        dojo.addClass(this.clearBtnContainer, 'hidden');
        dojo.forEach(checked, function (id) {
            var rdiv = this[id + 'Results'].containerNode;

            // clear rdiv
            rdiv.innerHTML = '';

            dojo.removeClass(this[id + 'ResultsContainer'], 'hidden');

            if (results[id].length > 0) {
                dojo.removeClass(this.clearBtnContainer, 'hidden');
                // loop through groups
                var found = false;
                dojo.forEach(results[id], function (result) {
                    // filter out those that don't match the cat or catGroup url params
                    if (rasterapp.isProductSpecific &&
                        ((this.cat && result.name !== this.cat) ||
                        (this.catGroup && this.catGroup.indexOf(result.name) === -1))) {
                        return;
                    }
                    found = true;
                    var group = new raster.ResultGroup({
                        title: result.name.replace(new RegExp(' {.*}', 'g'), '')
                    }, dojo.create('div', null, rdiv));
                    this.resultGroups.push(group);

                    // loop through products within the group
                    dojo.forEach(result.products, function (prod) {
                        // show preview button for aerial photography only if there
                        // is a value for REST_Endpoint
                        prod.setSymbol(this.resultsSymbol);
                        var r = new raster.ProductResult({
                            title: prod.attributes[rasterglobal.fields.common.Product],
                            gLayer: this.extentGraphics,
                            graphic: prod,
                            map: this.previewMap,
                            extentLayerId: id
                        }, dojo.create('div', null, group.containerNode));
                    }, this);
                }, this);
            }

            if (results[id].length === 0 || !found) {
                rdiv.innerHTML = 'No data found.';
            }
        }, this);

        this.accordionContainer.selectChild(this.accordionContainer.getChildren()[2], true);

        dojo.addClass(this.searchLoading, 'hidden');

        this.drawToolbar.deactivate();
        this.unselectAllTools();
    },
    displaySearchWarning: function(msg){
        // summary:
        //      shows the warning box and displays the text
        // msg: String
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.searchWarning.innerHTML = msg;

        dojo.removeClass(this.searchWarning, 'hidden');
    },
    hideSearchWarning: function () {
        // summary:
        //      hides the box
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        dojo.addClass(this.searchWarning, 'hidden');
    },
    onDownloadClick: function (graphic) {
        // summary:
        //      description
        // graphic: esri.Graphic
        //      The graphic associated with the ProductResult whos download
        //      button was clicked.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.download.setGraphic(graphic);
    },
    clearPreview: function () {
        // summary:
        //      Clears the preview if any
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        // don't do anything if the default map is already showing
        if (dojo.style('map-div', 'display') === 'block') {
            return;
        }

        // show default map and hide preview map
        dojo.style('map-div', 'display', 'block');
        dojo.style('preview-map-div', 'display', 'none');

        rasterapp.previewMap.removeLayer(this.drawingGraphics);
        this.map.addLayer(this.drawingGraphics);

        esri.config.defaults.map.zoomDuration = 0;
        esri.config.defaults.map.panDuration = 0;

        rasterapp.map.setExtent(rasterapp.previewMap.extent);

        esri.config.defaults.map.zoomDuration = this.defaultZoomDuration;
        esri.config.defaults.map.panDuration = this.defaultPanDuration;
    },
    showPreview: function () {
        // summary:
        //      shows the preview map
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        // don't do anything if the preview map is already showing
        if (dojo.style('preview-map-div', 'display') === 'block') {
            return;
        }

        if (!this.previewScalebar) {
            var handle = this.connect(rasterapp.previewMap, 'onLoad', function () {
                this.previewScalebar = new esri.dijit.Scalebar({
                    map: rasterapp.previewMap,
                    attachTo: 'bottom-right'
                });
                this.disconnect(handle);
            });
        }

        this.map.removeLayer(this.drawingGraphics);
        rasterapp.previewMap.addLayer(this.drawingGraphics);

        dojo.style('preview-map-div', 'display', 'block');
        dojo.style('map-div', 'display', 'none');

        esri.config.defaults.map.zoomDuration = 0;
        esri.config.defaults.map.panDuration = 0;

        rasterapp.previewMap.setExtent(rasterapp.map.extent);

        esri.config.defaults.map.zoomDuration = this.defaultZoomDuration;
        esri.config.defaults.map.panDuration = this.defaultPanDuration;
    },
    clearSearchResults: function () {
        // summary:
        //        clears the search results
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        dojo.forEach(this.resultGroups, function (group) {
            group.destroyRecursive();
        });

        this.resultGroups = [];

        this.download.clearResults();
    },
    destroyRecursive: function () {
        // summary:
        //        overriden to try to clean up more stuff for tests
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.findAddress.destroyRecursive();

        this.inherited(arguments);
    },
    onClearAOIButtonClick: function () {
        // summary:
        //      clears the aoi graphic
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.drawingGraphics.hide();
        this.drawToolbar.deactivate();
        this.deselectTools();
    }
});
