define([
    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    'app/config',
    'app/Toolbox',

    'dijit/Toolbar',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom',
    'dojo/dom-style',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare'
], function (
    BaseMap,
    BaseMapSelector,

    config,
    Toolbox,

    Toolbar,
    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    dom,
    domStyle,
    template,
    declare
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        baseClass: 'app',

        // map: agrc.widgets.map.BaseMap
        map: null,

        // previewMap: agrc.widgets.map.BaseMap
        previewMap: null,

        // isProductSpecific: Boolean
        //      true if cat or catgroup is passed
        isProductSpecific: true,

        postCreate: function () {
            // summary:
            //        first function to fire after page loads
            console.log('app/App:postCreate', arguments);

            this.version.innerHTML = config.version;

            // global reference
            window.rasterapp = this;

            this.initMaps();

            var cat = this.getURLParamValue(config.urlParams.cat);
            var catGroup = this.getURLParamValue(config.urlParams.catGroup);

            if (cat) {
                dom.byId('title').innerHTML = cat.replace(new RegExp('{|}', 'g'), '') + ' Data Download';
            } else if (catGroup) {
                dom.byId('title').innerHTML = this.getURLParamValue(config.urlParams.title);
            } else {
                this.isProductSpecific = false;
            }

            var toolbox = new Toolbox({
                map: this.map,
                previewMap: this.previewMap,
                cat: cat,
                catGroup: (catGroup) ? catGroup.split(',') : null
            }, 'raster-toolbox');
            toolbox.startup();
        },
        getURLParamValue: function (param) {
            // summary:
            //      checks to see if there was a category passed into the url
            console.log('app/App:getURLParamValue', arguments);

            var regexS = '[\\?&]' + param + '=([^&#]*)';
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (results === null) {
                return undefined;
            } else {
                return window.decodeURI(results[1]);
            }
        },
        initMaps: function () {
            // summary:
            //      description
            console.log('app/App:initMaps', arguments);

            this.map = new BaseMap('map-div', {
                useDefaultBaseMap: false,
                includeFullExtentButton: true
            });

            var selector = new BaseMapSelector({
                map: this.map,
                id: 'claro',
                position: 'BL'
            });
            selector.startup();

            this.previewMap = new BaseMap('preview-map-div', {
                useDefaultBaseMap: false,
                includeFullExtentButton: true,
                includeBackButton: true
            });

            // set display to none after map has creation to make sure that it sized correctly
            domStyle.set(this.previewMap.container, 'display', 'none');
        },
        getMbOrGb: function (mbs) {
            // summary:
            //      returns mbs if under 1,000 or gbs if over 1,000
            // mbs: Number
            console.log('app/App:getMbOrGb', arguments);

            if (!mbs) {
                return '??';
            } else if (mbs < 1000) {
                return mbs + 'Mb';
            } else {
                return (Math.round(mbs / 100) / 10) + 'Gb';
            }
        }
    });
});
