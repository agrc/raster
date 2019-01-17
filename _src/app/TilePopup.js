define([
    'app/config',
    'app/_BuildTileFileLinksMixin',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/text!app/templates/TilePopup.html',
    'dojo/_base/declare'
], function (
    config,
    _BuildTileFileLinksMixin,

    _TemplatedMixin,
    _WidgetBase,

    template,
    declare
) {
    return declare([_WidgetBase, _TemplatedMixin, _BuildTileFileLinksMixin], {
        // description:

        templateString: template,
        baseClass: 'tile-popup',

        // rightClickTxt: String
        rightClickTxt: config.rightClickTxt,


        // Parameters to constructor

        constructor: function () {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.log('app/TilePopup:constructor', arguments);
        },
        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/TilePopup:postCreate', arguments);

            this.buildFileLinks();
        },
        buildFileLinks: function () {
            // summary:
            //      The first function to fire. Sets up this class
            //      Overridden from _BuildTileFileLinksMixin
            console.log('app/TilePopup:buildFileLinks', arguments);

            this.createExtraFileLink(this[config.fields.indices.WORLDFILE], true, 'World File');
            this.createExtraFileLink(this[config.fields.indices.METADATA], true, 'Metadata');
            this.createExtraFileLink(this.EXTENT_ATTRIBUTES[config.fields.common.METADATA], false, 'Metadata');
            this.createExtraFileLink(this.EXTENT_ATTRIBUTES[config.fields.common.REPORT], false, 'Report');
        }
    });
});
