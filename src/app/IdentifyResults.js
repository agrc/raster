define([
    'app/config',

    'dojo/_base/array',
    'dojo/_base/declare'
], function (
    config,

    array,
    declare
) {
    return declare(null, {
        // one array for each layer
        // arrays are initialized in the constructor
        // arrays hold groups which, in turn, hold arrays of products
        0: null,
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,

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
            console.log('app/IdentifyResults:constructor', arguments);

            Object.keys(config.categoryIds).forEach(function (categoryName) {
                this[config.categoryIds[categoryName]] = [];
            }.bind(this));
        },
        add: function (result) {
            // summary:
            //      Adds a result to the appropriate layer and group
            // result: esri.tasks.IdentifyResult
            console.log('app/IdentifyResults:add', arguments);

            var atts = result.feature.attributes;
            var flds = config.fields.common;
            var groupname = atts[flds.Category];
            var date;
            var est_date;

            // add layerId to graphic so that we can query it when building
            // the more info dialog
            atts.layerId = result.layerId;

            // look for existing group and add to products
            var found = array.some(this[result.layerId], function (group) {
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
            console.log('app/IdentifyResults:sort', arguments);

            function sortGroups(a, b) {
                if (a.date < b.date) {
                    return 1;
                } else {
                    return -1;
                }
            }

            // only sort photography and LiDAR
            this[config.categoryIds.aerials].sort(sortGroups);
            this[config.categoryIds.lidar].sort(sortGroups);
        }
    });
});
