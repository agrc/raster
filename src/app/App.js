define([
    'agrc/widgets/map/BaseMap',

    'app/config',
    'app/Toolbox',

    'dijit/Toolbar',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom',
    'dojo/dom-style',
    'dojo/text!app/templates/App.html',
    'dojo/_base/declare',

    'esri/geometry/Extent',

    'layer-selector/LayerSelector'
], function (
    BaseMap,

    config,
    Toolbox,

    Toolbar,
    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    dom,
    domStyle,
    template,
    declare,

    Extent,

    LayerSelector
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        widgetsInTemplate: true,
        baseClass: 'app',

        // map: agrc.widgets.map.BaseMap
        map: null,

        // previewMapUtm: agrc.widgets.map.BaseMap
        previewMapUtm: null,

        // previewMapWebMerc: agrc.widgets.map.BaseMap
        previewMapWebMerc: null,

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
                previewMapUtm: this.previewMapUtm,
                previewMapWebMerc: this.previewMapWebMerc,
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
                includeFullExtentButton: true,
                extent: new Extent({
                    xmax: -11762120.612131765,
                    xmin: -13074391.513731329,
                    ymax: 5225035.106177688,
                    ymin: 4373832.359194187,
                    spatialReference: {
                        wkid: 3857
                    }
                })
            });

            var selector = new LayerSelector({
                map: this.map,
                quadWord: config.quadWord,
                baseLayers: ['Terrain', 'Hybrid', 'Lite', 'Topo']
            });
            selector.startup();

            this.previewMapUtm = new BaseMap('preview-map-utm-div', {
                useDefaultBaseMap: false,
                includeFullExtentButton: true,
                includeBackButton: true
            });
            this.previewMapWebMerc = new BaseMap('preview-map-webmerc-div', {
                useDefaultBaseMap: false,
                includeFullExtentButton: true,
                includeBackButton: true
            });

            this.previewMapUtm.setVisibility(false);
            this.previewMapWebMerc.setVisibility(false);
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
