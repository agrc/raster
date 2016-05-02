define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/dom',
    'dojo/dom-style',
    'dojo/text!app/templates/MainAppLink.html',
    'dojo/_base/declare'
], function (
    _TemplatedMixin,
    _WidgetBase,

    dom,
    domStyle,
    template,
    declare
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:

        templateString: template,
        baseClass: 'main-app-link',

        // Parameters to constructor

        constructor: function (params) {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.log('app/MainAppLink:constructor', arguments);

            params.dataName = dom.byId('title').innerHTML.replace(' Data Download', '');
        },
        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/MainAppLink:postCreate', arguments);

            if (!window.rasterapp.isProductSpecific) {
                domStyle.set(this.domNode, 'display', 'none');
            }
        }
    });
});
