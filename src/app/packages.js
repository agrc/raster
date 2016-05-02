require({
    packages: [
        'agrc',
        'app',
        'dgrid',
        'dijit',
        'dojo',
        'dojox',
        'esri',
        'layer-selector',
        'moment',
        'put-selector',
        'xstyle',
        {
            name: 'bootstrap',
            location: './bootstrap',
            main: 'dist/js/bootstrap'
        }, {
            name: 'jquery',
            location: './jquery/dist',
            main: 'jquery'
        }, {
            name: 'spin',
            location: './spinjs',
            main: 'spin'
        }
    ]
});
