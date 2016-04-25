/*global dojo, dijit, raster, console, rasterglobal*/

// provide namespace
dojo.provide('raster.TilePopup');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');
dojo.require('raster._BuildTileFileLinksMixin');

dojo.declare('raster.TilePopup', [dijit._Widget, dijit._Templated, raster._BuildTileFileLinksMixin], {
    // description:

    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl('raster', 'templates/TilePopup.html'),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: 'tile-popup',

    // rightClickTxt: String
    rightClickTxt: rasterglobal.rightClickTxt,
    

    // Parameters to constructor
    
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
    },
    buildFileLinks: function () {
        // summary:
        //      The first function to fire. Sets up this class
        //      Overridden from _BuildTileFileLinksMixin
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.createExtraFileLink(this[rasterglobal.fields.indices.WORLDFILE], true, 'World File');
        this.createExtraFileLink(this[rasterglobal.fields.indices.METADATA], true, 'Metadata');
        this.createExtraFileLink(this.EXTENT_ATTRIBUTES[rasterglobal.fields.common.METADATA], false, 'Metadata');
        this.createExtraFileLink(this.EXTENT_ATTRIBUTES[rasterglobal.fields.common.REPORT], false, 'Report');
    }
});