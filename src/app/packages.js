require({
    packages: [
        'agrc',
        'app',
        'dgrid',
        'dgrid1',
        'dijit',
        'dstore',
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
            name: 'ladda',
            location: './ladda-bootstrap',
            main: 'dist/ladda'
        }, {
            name: 'spin',
            location: './spinjs',
            main: 'spin'
        }
    ]
});
