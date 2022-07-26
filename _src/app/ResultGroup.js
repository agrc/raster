define([
    'app/_CaretCollapseMixin',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/text!app/templates/ResultGroup.html',
    'dojo/_base/declare'
], function (
    _CaretCollapseMixin,

    _TemplatedMixin,
    _WidgetBase,

    template,
    declare
) {
    return declare([_WidgetBase, _TemplatedMixin, _CaretCollapseMixin], {
        // description:

        templateString: template,
        baseClass: 'result-group',

        // forceOpen: Boolean
        //      Force the dialog to be open by default
        forceOpen: null,


        // Parameters to constructor

        constructor: function () {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.log('app/ResultGroup:constructor', arguments);
        },
        postCreate: function postCreate() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/ResultGroup:postCreate', arguments);

            this.inherited(postCreate, arguments);

            // for to be closed
            if (this.forceOpen) {
                $(this.collapsible).collapse('show');
            }
        }
    });
});
