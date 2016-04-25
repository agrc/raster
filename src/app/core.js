/*global dojo, console, agrc, ijit, dijit, raster, rasterglobal, esri, window*/
dojo.provide("js.core");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("agrc.widgets.map.BaseMap");
dojo.require("agrc.widgets.map.BaseMapSelector");
dojo.require("raster.Toolbox");
dojo.require("dijit.Toolbar");
dojo.require('ijit.widgets.notify.Feedback');

var rasterapp;
dojo.declare("rasterapp", null, {
	// map: agrc.widgets.map.BaseMap
	map: null,

	// isProductSpecific: Boolean
	//      true if cat or catgroup is passed
	isProductSpecific: true,
	
	constructor: function () {
		// summary:
		//		first function to fire after page loads
		console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
		
		dojo.byId('version').innerHTML = rasterglobal.version;

		// global reference
		rasterapp = this;
		
		this.initMaps();

		var cat = this.getURLParamValue(rasterglobal.urlParams.cat);
		var catGroup = this.getURLParamValue(rasterglobal.urlParams.catGroup);

		if (cat) {
			dojo.byId('title').innerHTML = cat.replace(new RegExp('{|}', 'g'), '') + ' Data Download';
		} else if (catGroup) {
			dojo.byId('title').innerHTML = this.getURLParamValue(rasterglobal.urlParams.title);
		} else {
			this.isProductSpecific = false;
		}
		
		var toolbox = new raster.Toolbox({
			map: this.map,
			previewMap: this.previewMap,
			cat: cat,
			catGroup: (catGroup) ? catGroup.split(',') : null
		}, 'raster-toolbox');
		
		this.wireEvents();
	},
	getURLParamValue: function (param) {
		// summary:
		//      checks to see if there was a category passed into the url
		console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
	
		var regexS = "[\\?&]" + param + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if (results === null) {
			return undefined;
		} else {
			return window.decodeURI(results[1]);
		}
	},
	initMaps: function(){
		// summary:
		//      description
		console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
		
		this.map = new agrc.widgets.map.BaseMap('map-div', {
			useDefaultBaseMap: false,
			includeFullExtentButton: true,
			includeBackButton: true
		});
		
		var selector = new agrc.widgets.map.BaseMapSelector({
			map: this.map,
			id: 'claro',
			position: 'BL'
		});

		var feedback = new ijit.widgets.notify.Feedback({
			map: this.map,
			appName: rasterglobal.appName,
			additionalText: rasterglobal.feedbackTxt
		}, dojo.create('div'));

		this.previewMap = new agrc.widgets.map.BaseMap('preview-map-div', {
			useDefaultBaseMap: false,
			includeFullExtentButton: true,
			includeBackButton: true
		});

		// set display to none after map has been loaded to make sure that it
		// gets the proper dimensions
		dojo.connect(this.map, 'onLoad', this, function () {
			dojo.style('preview-map-div', 'display', 'none');
		});
	},
	wireEvents: function(){
		console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

		dojo.connect(this.map, 'onLoad', this, 'hideLoadingOverlay');
	},
	hideLoadingOverlay: function(){
		// summary:
		//      fades out the loader overlay
		console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
		
		dojo.fadeOut({
			node: 'loading-overlay',
			onEnd: function(n) {
				dojo.style(n, 'display', 'none');
			}
		}).play();
	},
	getMbOrGb: function (mbs) {
		// summary:
		//      returns mbs if under 1,000 or gbs if over 1,000
		// mbs: Number
		console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

		if (!mbs) {
			return '??';
		}else if (mbs < 1000) {
			return mbs + 'Mb';
		} else {
			return (Math.round(mbs/100)/10) + 'Gb';
		}
	}
});

dojo.ready(function(){
	var app = new rasterapp();
});