define([
    'app/_BuildTileFileLinksMixin',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/text!app/templates/Tile.html',
    'dojo/_base/declare'
], function (
    _BuildTileFileLinksMixin,

    _TemplatedMixin,
    _WidgetBase,

    template,
    declare
) {
    return declare([_WidgetBase, _TemplatedMixin, _BuildTileFileLinksMixin], {
        // description:

        templateString: template,

        // baseClass: [private] String
        //    The css class that is applied to the base div of the widget markup
        baseClass: 'tile-widget',


        // Parameters to constructor

        // graphic: esri.Graphic
        graphic: null,

        // graphicsLayer: GraphicsLayer
        graphicsLayer: null,

        constructor: function () {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.log('app/Tile:constructor', arguments);
        },
        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/Tile:postCreate', arguments);

            this.buildFileLinks();

            this.wireEvents();
        },
        wireEvents: function () {
            // summary:
            //      sets up the events for this widget
            console.log('app/Tile:wireEvents', arguments);

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
});
