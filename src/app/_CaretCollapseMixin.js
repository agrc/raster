define([
    'dojo/dom-class',
    'dojo/_base/declare',
    'dojo/_base/lang'
], function (
    domClass,
    declare,
    lang
) {
    return declare(null, {
        icons: {
            right: 'glyphicon-triangle-right',
            down: 'glyphicon-triangle-bottom'
        },

        postCreate: function () {
            // summary:
            //      set up events
            // param or return
            console.log('app/_CaretCollapseMixin:postCreate', arguments);

            $(this.collapsible).on('shown.bs.collapse', lang.hitch(this, function (evt) {
                this.onToggleCollapse(evt, true);
            }));
            $(this.collapsible).on('hidden.bs.collapse', lang.hitch(this, function (evt) {
                this.onToggleCollapse(evt, false);
            }));

            this.inherited(arguments);
        },
        onToggleCollapse: function (evt, shown) {
            // summary:
            //      collapse has been show or hidden, update caret
            // evt: Event Object
            // shown: Boolean
            console.log('app/_CaretCollapseMixin:onToggleCollapse', arguments);

            var newIcon = (shown) ? this.icons.down : this.icons.right;
            var oldIcon = (shown) ? this.icons.right : this.icons.down;
            domClass.remove(this.caret, oldIcon);
            domClass.add(this.caret, newIcon);
            evt.stopPropagation();
            evt.preventDefault();
        }
    });
});
