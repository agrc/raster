// provide namespace
dojo.provide('raster.MainAppLink');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.declare('raster.MainAppLink', [dijit._Widget, dijit._Templated], {
    // description:

    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl('raster', 'templates/MainAppLink.html'),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: 'main-app-link',
    

    // Parameters to constructor
    
    constructor: function(params, div) {
        // summary:
        //    Constructor method
        // params: Object
        //    Parameters to pass into the widget. Required values include:
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);

        params.dataName = dojo.byId('title').innerHTML.replace(' Data Download', '');
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        // tags:
        //    private
        console.info(this.declaredClass + '::' + arguments.callee.nom, arguments);

        if (!rasterapp.isProductSpecific) {
            dojo.style(this.domNode, 'display', 'none');
        }
    }
});