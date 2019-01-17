define([
    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/tasks/query',
    'esri/tasks/QueryTask'
], function (
    declare,
    lang,

    Query,
    QueryTask
) {
    return declare(null, {
        query: null,
        qTask: null,
        setUpQueryTask: function (url, options) {
            this.query = new Query();
            lang.mixin(this.query, options);
            this.qTask = new QueryTask(url);
            this.qTask.on('complete', lang.hitch(this, 'onQueryTaskComplete'));
            this.qTask.on('error', lang.hitch(this, 'onQueryTaskError'));
        },
        executeQueryTask: function (geo, where) {
            this.query.geometry = geo;
            this.query.where = where;
            this.qTask.execute(this.query);
        }
    });
});
