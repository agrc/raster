/*global dojo, agrc, raster*/
dojo.provide("raster.FindAddress");

dojo.require("agrc.widgets.locate.FindAddress");

dojo.declare("raster.FindAddress", [agrc.widgets.locate.FindAddress], {
    // description:
    //      overriden to alter the template
    
    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    // templatePath: [private] String
    //      Path to template. See dijit._Templated
    templatePath: dojo.moduleUrl("raster", "templates/FindAddress.html"),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: "raster-find-address"
});
