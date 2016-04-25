/*global dojo, console, dijit, rasterglobal, esri, raster, rasterapp, dojox*/

// provide namespace
dojo.provide("raster.ProductResult");

// other dojo requires
dojo.require("dijit.TitlePane");
dojo.require('dijit.form.ToggleButton');
dojo.require('dijit.Dialog');
dojo.require('dojo.string');
dojo.require('raster.Toolbox');
dojo.require('dojox.html.entities');

dojo.declare("raster.ProductResult", [dijit.TitlePane], {
    // description:
    //      Widget that displays info and functionality for a specific 
    //      product.
    
    // widgetsInTemplate: [private] Boolean
    //      Specific to dijit._Templated.
    widgetsInTemplate: true,
    
    templateString: dojo.cache("raster", "templates/ProductResult.html"),
    
    // baseClass: [private] String
    //    The css class that is applied to the base div of the widget markup
    baseClass: "product-result",
    
    // buttonClick: Boolean
    //      Used to prevent the pane from toggling when clicking on the extent
    //      or preview buttons
    buttonClick: false,

    // showPreviewChannelName: String
    showPreviewChannelName: 'raster.ProductResult.onPreviewShow',

    // hidePreviewChannelName: String
    hidePreviewChannelName: 'raster.ProductResult.onPreviewHide',

    // downloadClickChannelName: String
    downloadClickChannelName: 'raster.ProductResult.onDownloadClick',

    // previewLyr: esri.layers.ArcGISImageServiceLayer
    previewLyr: null,
    
    // moreInfoDialog: dijit.Dialog
    moreInfoDialog: null,


    // Parameters to constructor
    
    // title: String
    
    // gLayer: esri.layers.GraphicsLayer
    gLayer: null,
    
    // graphic: esri.Graphic
    graphic: null,

    // map: esri.Map
    map: null,

    // extentLayerId: String
    //      The id of the extent layer that this feature came from
    //      Used to separate image service parameters in addLayer
    extentLayerId: null,
    
    constructor: function(params, div) {
        // summary:
        //    Constructor method
        // params: Object
        //    Parameters to pass into the widget. Required values include:
        // div: String|DomNode
        //    A reference to the div that you want the widget to be created in.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);      
    },
    postCreate: function() {
        // summary:
        //    Overrides method of same name in dijit._Widget.
        // tags:
        //    private
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        this._wireEvents();
        
        this.inherited(arguments);
        
        // doing it this way prevents the animation from happening
        this.set('open', false);

        // show preview button
        var rest = this.graphic.attributes[rasterglobal.fields.common.REST_Endpoint];
        if (rest && rest !== 'n/a' && rest !== '' && rest !== 'Null') {
            dojo.removeClass(this.previewBtn.domNode, 'hidden');
        }

        dojo.place(this.innerContent, this.containerNode);

        this.buildContent();
    },
    buildContent: function () {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        var htmlpage = this.graphic.attributes[rasterglobal.fields.common.HTML_Page];
        var inhouse = this.graphic.attributes[rasterglobal.fields.common.In_House];

        this.description.innerHTML = this.graphic.attributes[rasterglobal.fields.common.Description];

        // web page link
        if (htmlpage !== 'n/a' && htmlpage !== '') {
            this.link.href = htmlpage;
        } else {
            dojo.destroy(this.link);
        }

        // download button
        if (inhouse === 'No') {
            this.downloadBtn.destroy();
        }
    },
    _wireEvents: function() {
        // summary:
        //    Wires events.
        // tags:
        //    private
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.connect(this.previewBtn, 'onClick', this.onPreviewClick);
        this.connect(this.domNode, 'onmouseenter', this.onMouseEnter);
        this.connect(this.domNode, 'onmouseleave', this.onMouseLeave);
        // hide this preview if another one is clicked
        this.subscribe(this.showPreviewChannelName, this.hidePreview);
        this.subscribe(raster.Toolbox.prototype.clearPreviewChannelName, this.hidePreview);
        this.connect(this.downloadBtn, 'onClick', this.onDownloadClick);
        this.connect(this.extentBtn, 'onClick', this.onExtentClick);
        this.connect(this.moreInfo, 'onclick', this.onMoreInfoClick);
    },
    hidePreview: function (params) {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        if (!this.buttonClicked) {
            this.previewBtn.set('checked', false);
            if (this.previewLyr) {
                this.previewLyr.hide();
            }
        }
    },
    onPreviewClick: function(evt){
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.preventToggle(evt);

        var show = this.previewBtn.get('checked');

        if (!this.previewLyr) {
            this.addLayer();
        } else {
            this.previewLyr.setVisibility(show);
        }

        if (show) {
            dojo.publish(this.showPreviewChannelName);
        } else {
            dojo.publish(this.hidePreviewChannelName);
        }

        // this is because _onTitleClick never fires in IE < 9 so 
        // we manually have to set buttonClicked to false so that
        // the next time hidePreview fires, the code will run correctly
        if (dojo.isIE < 9) {
            this.buttonClicked = false;
        }
    },
    addLayer: function () {
        // summary:
        //      addes the image service layer to the map
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        var params = new esri.layers.ImageServiceParameters();
        params.format = 'jpg';
        if (this.extentLayerId === '0' || this.extentLayerId === '4') {
            // aerials, drg's
            params.bandIds = [0,1,2];
        } else {
            // hillshades
            params.bandIds = [0];
        }
        params.interpolation = params.INTERPOLATION_BILINEAR;
        var url = this.graphic.attributes[rasterglobal.fields.common.REST_Endpoint];
        this.previewLyr = new esri.layers.ArcGISImageServiceLayer(url, {
            imageServiceParameters: params,
            id: 'preview' + (this.map.layerIds.length + 1)
        });
        this.map.addLayer(this.previewLyr, 1);
        this.map.addLoaderToLayer(this.previewLyr);

        // add event to toggle preview button when the layer is hidden via the clear preview button
        this.connect(this.previewLyr, 'onVisibilityChange', function (visibility) {
            if (!visibility) {
                this.previewBtn.set('checked', false);
            }
        });
    },
    preventToggle: function(evt){
        // summary:
        //      Prevents the title pane from toggling
        // evt: Event{}
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        this.buttonClicked = true;
        evt.stopPropagation();
    },
    _onTitleClick: function(evt){
        // summary:
        //      Overridden to check to see if a button was clicked.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        if (!this.buttonClicked) {
            this.inherited(arguments);
        } else {
            this.buttonClicked = false;
        }
    },
    onMouseEnter: function(){
        // summary:
        //      description
        // console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.gLayer.add(this.graphic);
    },
    onMouseLeave: function(){
        // summary:
        //      description
        // console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        this.gLayer.clear();
    },
    destroy: function () {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        if (this.previewLyr) {
            this.map.removeLayer(this.previewLyr);
        }

        this.inherited(arguments);
    },
    onDownloadClick: function (evt) {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        dojo.publish(this.downloadClickChannelName, [this.graphic]);
    },
    onExtentClick: function (evt) {
        // summary:
        //      Fires when the user clicks the extent button.
        //      Zooms the map to the extent of the graphic.
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        this.preventToggle(evt);

        // zoom the correct map
        if (dojo.style('map-div', 'display') === 'block') {
            rasterapp.map.setExtent(this.graphic.geometry.getExtent(), true);
        } else {
            this.map.setExtent(this.graphic.geometry.getExtent(), true);
        }
    },
    onMoreInfoClick: function (evt) {
        // summary:
        //        fires when the user clicks on the more info link
        // evt: dojo normalized event
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        var template;

        evt.preventDefault();

        // I realize this could be written using a simple look up object, but then
        // the build system wouldn't know where to get the cache string, so lay off man!
        switch(this.graphic.attributes.layerId) {
            case 0:
                template = dojo.cache(dojo.moduleUrl('raster', 'html/MoreInfo_Aerials.html'));
                break;
            case 1:
                template = dojo.cache(dojo.moduleUrl('raster', 'html/MoreInfo_Contours.html'));
                break;
            case 2:
                template = dojo.cache(dojo.moduleUrl('raster', 'html/MoreInfo_DEMs.html'));
                break;
            case 3:
                template = dojo.cache(dojo.moduleUrl('raster', 'html/MoreInfo_LiDAR.html'));
                break;
            case 4:
                template = dojo.cache(dojo.moduleUrl('raster', 'html/MoreInfo_Topos.html'));
                break;
        }

        if (!template) {
            throw TypeError('No template found for: ' + this.graphic.layerId);
        }

        // encode attribute values
        for (var att in this.graphic.attributes) {
            var v = this.graphic.attributes[att];
            if (this.graphic.attributes.hasOwnProperty(att) && typeof v === 'string')
            this.graphic.attributes[att] = dojox.html.entities.encode(v);
        }

        if (!this.moreInfoDialog) {
            this.moreInfoDialog = new dijit.Dialog({
                title: "More Information",
                content: dojo.string.substitute(template, this.graphic.attributes)
            });
        }

        // hide layer file link if there is no data
        var lfile = this.graphic.attributes[rasterglobal.fields.common.LYR_File];
        var links = dojo.query('.layer-file-link');
        if (lfile === 'n/a' || lfile === '' || !lfile) {
            links.style('display', 'none');
        } else {
            links.style('display', 'table-row');
        }
        this.moreInfoDialog.show();
    },
    resize: function () {
        // summary:
        //      description
        // console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
    
        // do nothing! It's parent is a fixed size.
    }
});