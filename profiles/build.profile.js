dependencies = {
	cssOptimize: "comments",
	optimize: "shrinksafe",
	layerOptimize: "shrinksafe",
	action: "clean,release",
	version: "1.6.1src",
	internStrings: true,
	mini: true,
	stripConsole: "all",
	releaseName: "Raster",
    localeList: 'en-us',
	layers: [
		{
			name: "esriapi.discard",
			resourceName: "esriapi.discard",
			discard: true,
			dependencies: [
				"dijit.WidgetSet",
				"dojo.fx.Toggler",
				"dojo.Stateful",
				"dijit._WidgetBase",
				"dijit._Widget",
				"dijit._Templated",
				"dijit._Container",
				"dijit._CssStateMixin",
				"dijit.form._FormWidget",
				"dijit.form._FormValueWidget",
				"dojo.dnd.Mover",
				"dojo.dnd.Moveable",
				"dojo.dnd.move.constrainedMoveable",
				"dojo.dnd.move.boxConstrainedMoveable",
				"dojo.dnd.move.parentConstrainedMoveable",
				"dijit._HasDropDown",
				"dijit.form.Button",
				"dijit.form.DropDownButton",
				"dijit.form.ComboButton",
				"dijit.form.ToggleButton",
				"dijit.form.HorizontalSlider",
				"dijit.form._SliderMover",
				"dijit.form.VerticalSlider",
				"dijit.form.HorizontalRule",
				"dijit.form.VerticalRule",
				"dijit.form.HorizontalRuleLabels",
				"dijit.form.VerticalRuleLabels"
			]
		},
		{
			name: "../raster/RasterLyr.js",
			resourceName: "raster.RasterLyr",
			layerDependencies: [
				"esriapi.discard"
			],
			dependencies: [
				"js.core"
			]
		}
	],
	prefixes: [
		["css", "Y:/Documents/Projects/Raster/trunk/css"],
		["data", "Y:/Documents/Projects/Raster/trunk/data"],
		["html", "Y:/Documents/Projects/Raster/trunk/html"],
		["images", "Y:/Documents/Projects/Raster/trunk/images"],
		["agrc", "Y:/Documents/Projects/Raster/trunk/agrc"],
		["ijit", "Y:/Documents/Projects/Raster/trunk/ijit"],
		["js", "Y:/Documents/Projects/Raster/trunk/js"],
		['raster', 'Y:/Documents/Projects/Raster/trunk/raster'],
		['dojox', '../dojox'],
		["dijit", "../dijit"]
	]
}
