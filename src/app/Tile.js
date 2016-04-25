/*global dojo, dijit, raster, console, rasterglobal, window, rasterapp*/

// provide namespace
dojo.provide('raster.Tile');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('raster._BuildTileFileLinksMixin');

dojo.declare('raster.Tile', [dijit._Widget, dijit._Templated, raster._BuildTileFileLinksMixin], {
    // description:

    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl('raster', 'templates/Tile.html'),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: 'tile-widget',
    

    // Parameters to constructor

    // graphic: esri.Graphic
    graphic: null,

    // graphicsLayer: esri.layers.GraphicsLayer
    graphicsLayer: null,

    constructor: function(params, div) {
        // summary:
        //    Constructor method
        // params: Object
        //    Parameters to pass into the widget. Required values include:
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        // tags:
        //    private
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);

        this.buildFileLinks();

        this.wireEvents();
    },
    wireEvents: function () {
        // summary:
        //      sets up the events for this widget
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        // set up events to show tile on map on hover
        this.connect(this.domNode, 'onmouseenter', function () {
            this.graphicsLayer.clear();
            this.graphicsLayer.add(this.graphic);
        });
        this.connect(this.domNode, 'onmouseleave', function () {
            this.graphicsLayer.clear();
        });
    }
});