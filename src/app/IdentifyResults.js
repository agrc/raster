/*global dojo, dijit, raster, console, rasterglobal*/
dojo.provide("raster.IdentifyResults");

dojo.declare('raster.IdentifyResults', null, {
    // one array for each layer
    // arrays are initialized in the constructor
    // arrays hold groups which, in turn, hold arrays of products
    0: null, // aerials
    1: null, // contours
    2: null, // dem's
    3: null, // lidar
    4: null, // topo

    // layer example: 
    //
    // [
    //     // group
    //     {
    //         name: String (Category),
    //         date: Date,
    //         products: esri.Graphic[]
    //     }
    // ]

    
    constructor: function () {
        this['0'] = [];
        this['1'] = [];
        this['2'] = [];
        this['3'] = [];
        this['4'] = [];
    },
    add: function (result) {
        // summary:
        //      Adds a result to the appropriate layer and group
        // result: esri.tasks.IdentifyResult
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        var atts = result.feature.attributes;
        var flds = rasterglobal.fields.common;
        var groupname = atts[flds.Category];
        var date;
        var est_date;

        // add layerId to graphic so that we can query it when building
        // the more info dialog
        atts.layerId = result.layerId;

        // look for existing group and add to products
        var found = dojo.some(this[result.layerId], function (group) {
            if (group.name === groupname) {
                group.products.push(result.feature);
                return true;
            } else {
                return false;
            }
        }, this);

        // if no group found, then create new group
        if (!found) {
            // if no date is provided then put it at the bottom of the list.
            est_date = atts[flds.Estimated_Date];
            if (est_date && est_date !== '') {
                date = new Date(est_date + ' UTC');
            } else {
                date = new Date(0);
            }
            this[result.layerId].push({
                name: groupname,
                date: date,
                products: [result.feature]
            });
        }
    },
    sort: function () {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
        function sortGroups(a, b) {
            if (a.date < b.date) {
                return 1;
            } else {
                return -1;
            }
        }

        // only sort photography
        this['0'].sort(sortGroups);
        this['3'].sort(sortGroups);
    }
});
