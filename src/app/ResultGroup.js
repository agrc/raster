/*global dojo, raster, dijit, console*/

// provide namespace
dojo.provide('raster.ResultGroup');

dojo.require('dijit.TitlePane');

dojo.declare('raster.ResultGroup', [dijit.TitlePane], {
    // description:
    
    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    // templateString: [private] String
    //      Template string. See dijit._Templated
    templateString: dojo.cache('raster', 'templates/ResultGroup.html'),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: 'result-group',

    // forceOpen: Boolean
    //      Force the dialog to be open by default
    forceOpen: null,
    

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

        // for to be closed
        if (!this.forceOpen) {
            this.set('open', false);
        }

        this.inherited(arguments);
    }
});