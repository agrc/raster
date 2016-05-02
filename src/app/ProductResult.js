define([
    'app/config',
    'app/_CaretCollapseMixin',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/query',
    'dojo/string',
    'dojo/text!app/html/MoreInfo_Aerials.html',
    'dojo/text!app/html/MoreInfo_Contours.html',
    'dojo/text!app/html/MoreInfo_DEMs.html',
    'dojo/text!app/html/MoreInfo_LiDAR.html',
    'dojo/text!app/html/MoreInfo_Topos.html',
    'dojo/text!app/templates/ProductResult.html',
    'dojo/topic',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'dojox/html/entities',

    'esri/layers/ArcGISImageServiceLayer',
    'esri/layers/ImageServiceParameters',

    'bootstrap'
], function (
    config,
    _CaretCollapseMixin,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    domConstruct,
    domStyle,
    query,
    dojoString,
    aerialsHTML,
    contoursHTML,
    demsHTML,
    lidarHTML,
    toposHTML,
    template,
    topic,
    declare,
    lang,

    entities,

    ArcGISImageServiceLayer,
    ImageServiceParameters
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _CaretCollapseMixin], {
        // description:
        //      Widget that displays info and functionality for a specific
        //      product.

        widgetsInTemplate: true,
        templateString: template,

        // baseClass: [private] String
        //    The css class that is applied to the base div of the widget markup
        baseClass: 'product-result panel panel-default',

        // previewLyr: ArcGISImageServiceLayer
        previewLyr: null,

        // moreInfoDialog: dijit.Dialog
        moreInfoDialog: null,


        // Parameters to constructor

        // title: String

        // gLayer: GraphicsLayer
        gLayer: null,

        // graphic: esri.Graphic
        graphic: null,

        // map: esri.Map
        map: null,

        // extentLayerId: String
        //      The id of the extent layer that this feature came from
        //      Used to separate image service parameters in addLayer
        extentLayerId: null,

        constructor: function () {
            // summary:
            //    Constructor method
            // params: Object
            //    Parameters to pass into the widget. Required values include:
            // div: String|DomNode
            //    A reference to the div that you want the widget to be created in.
            console.log('app/ProductResult:constructor', arguments);
        },
        postCreate: function () {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/ProductResult:postCreate', arguments);

            this._wireEvents();

            // hide preview button
            var rest = this.graphic.attributes[config.fields.common.REST_Endpoint];
            if (!rest || rest === 'n/a' || rest === '' || rest === 'Null') {
                domConstruct.destroy(this.previewBtnLabel);
            }
            this.buildContent();

            this.inherited(arguments);
        },
        buildContent: function () {
            // summary:
            //      description
            console.log('app/ProductResult:buildContent', arguments);

            var htmlpage = this.graphic.attributes[config.fields.common.HTML_Page];
            var inhouse = this.graphic.attributes[config.fields.common.In_House];

            this.description.innerHTML = this.graphic.attributes[config.fields.common.Description];

            // web page link
            if (htmlpage !== 'n/a' && htmlpage !== '') {
                this.link.href = htmlpage;
            } else {
                domConstruct.destroy(this.link);
            }

            // download button
            if (inhouse === 'No') {
                domConstruct.destroy(this.downloadBtn);
            }
        },
        _wireEvents: function () {
            // summary:
            //    Wires events.
            // tags:
            //    private
            console.log('app/ProductResult:_wireEvents', arguments);

            this.connect(this.domNode, 'onmouseenter', this.onMouseEnter);
            this.connect(this.domNode, 'onmouseleave', this.onMouseLeave);

            // hide this preview if another one is clicked
            topic.subscribe(config.topics.showPreview, lang.hitch(this, 'hidePreview'));
            topic.subscribe(config.topics.clearPreview, lang.hitch(this, 'hidePreview'));
        },
        hidePreview: function (widget) {
            // summary:
            //      description
            console.log('app/ProductResult:hidePreview', arguments);

            if (this !== widget) {
                this.previewBtn.checked = false;
                domClass.remove(this.previewBtnLabel, 'active');
                if (this.previewLyr) {
                    this.previewLyr.hide();
                }
            }
        },
        onPreviewClick: function (evt) {
            // summary:
            //      description
            console.log('app/ProductResult:onPreviewClick', arguments);

            this.previewBtn.checked = !this.previewBtn.checked;
            var show = this.previewBtn.checked;
            console.debug('show', show);

            domClass.toggle(this.previewBtnLabel, 'active', show);

            if (!this.previewLyr) {
                this.addLayer();
            } else {
                this.previewLyr.setVisibility(show);
            }

            if (show) {
                topic.publish(config.topics.showPreview, this);
            } else {
                topic.publish(config.topics.hidePreview);
            }

            this.preventToggle(evt);
        },
        preventToggle: function (evt) {
            // summary:
            //      prevent the panel from toggling collapsed state
            // evt: Mouse Click Event
            console.log('app/ProductResult:preventToggle', arguments);

            evt.stopPropagation();
            evt.preventDefault();
        },
        addLayer: function () {
            // summary:
            //      addes the image service layer to the map
            console.log('app/ProductResult:addLayer', arguments);

            var params = new ImageServiceParameters();
            params.format = 'jpg';
            if (this.extentLayerId === '0' || this.extentLayerId === '4') {
                // aerials, drg's
                params.bandIds = [0,1,2];
            } else {
                // hillshades
                params.bandIds = [0];
            }
            params.interpolation = params.INTERPOLATION_BILINEAR;
            var url = this.graphic.attributes[config.fields.common.REST_Endpoint];
            this.previewLyr = new ArcGISImageServiceLayer(url, {
                imageServiceParameters: params,
                id: 'preview' + (this.previewMap.layerIds.length + 1)
            });
            this.previewMap.addLayer(this.previewLyr, 1);
            this.previewMap.addLoaderToLayer(this.previewLyr);

            // add event to toggle preview button when the layer is hidden via the clear preview button
            this.connect(this.previewLyr, 'onVisibilityChange', function (visibility) {
                if (!visibility) {
                    this.previewBtn.checked = false;
                    domClass.remove(this.previewBtnLabel, 'active');
                }
            });
        },
        onMouseEnter: function () {
            // summary:
            //      description
            console.log('app/ProductResult:onMouseEnter', arguments);

            this.gLayer.add(this.graphic);
        },
        onMouseLeave: function () {
            // summary:
            //      description
            console.log('app/ProductResult:onMouseLeave', arguments);

            this.gLayer.clear();
        },
        destroy: function () {
            // summary:
            //      description
            console.log('app/ProductResult:destroy', arguments);

            if (this.previewLyr) {
                this.previewMap.removeLayer(this.previewLyr);
            }

            this.inherited(arguments);
        },
        onDownloadClick: function () {
            // summary:
            //      description
            console.log('app/ProductResult:onDownloadClick', arguments);

            topic.publish(config.topics.downloadClick, this.graphic);
        },
        onExtentClick: function (evt) {
            // summary:
            //      Fires when the user clicks the extent button.
            //      Zooms the map to the extent of the graphic.
            console.log('app/ProductResult:onExtentClick', arguments);

            this.preventToggle(evt);

            // zoom the correct map
            if (domStyle.get('map-div', 'display') !== 'block') {
                this.previewMap.setExtent(this.graphic.geometry.getExtent(), true);
            } else {
                this.map.setExtent(this.graphic.geometry.getExtent(), true);
            }
        },
        onMoreInfoClick: function (evt) {
            // summary:
            //        fires when the user clicks on the more info link
            // evt: dojo normalized event
            console.log('app/ProductResult:onMoreInfoClick', arguments);

            var template;

            evt.preventDefault();

            // I realize this could be written using a simple look up object, but then
            // the build system wouldn't know where to get the cache string, so lay off man!
            switch (this.graphic.attributes.layerId) {
                case 0:
                    template = aerialsHTML;
                    break;
                case 1:
                    template = contoursHTML;
                    break;
                case 2:
                    template = demsHTML;
                    break;
                case 3:
                    template = lidarHTML;
                    break;
                case 4:
                    template = toposHTML;
                    break;
            }

            if (!template) {
                throw new TypeError('No template found for: ' + this.graphic.layerId);
            }

            // encode attribute values
            for (var att in this.graphic.attributes) {
                if (this.graphic.attributes.hasOwnProperty(att)) {
                    var v = this.graphic.attributes[att];
                    if (this.graphic.attributes.hasOwnProperty(att) && typeof v === 'string') {
                        this.graphic.attributes[att] = entities.encode(v);
                    }
                }
            }

            this.modalContent.innerHTML = dojoString.substitute(template, this.graphic.attributes);

            if (!this.modalInitialized) {
                $(this.modal).modal();
            } else {
                $(this.modal).modal('show');
            }

            // hide layer file link if there is no data
            var lfile = this.graphic.attributes[config.fields.common.LYR_File];
            var links = query('.layer-file-link');
            if (lfile === 'n/a' || lfile === '' || !lfile) {
                links.style('display', 'none');
            } else {
                links.style('display', 'table-row');
            }
        }
    });
});
