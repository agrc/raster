/* eslint-disable no-unused-vars */
var profile = {
    basePath: '../src',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: false,
    layerOptimize: false,
    stripConsole: 'all',
    selectorEngine: 'acme',
    layers: {
        'dojo/dojo': {
            include: [
                'app/App',
                'app/packages',
                'app/run',
                'dojo/domReady',
                'dojo/has',
                'dojo/i18n',
                'dojox/gfx/filters',
                'dojox/gfx/path',
                'dojox/gfx/shape',
                'dojox/gfx/svg',
                'dojox/gfx/svgext',
                'esri/dijit/Attribution',
                'esri/layers/VectorTileLayerImpl'
            ],
            includeLocales: ['en-us'],
            customBase: true,
            boot: true
        }
    },
    packages: [{
        name: 'bootstrap',
        resourceTags: {
            copyOnly: function (filename, mid) {
                return mid === 'bootstrap/grunt/change-version';
            }
        }
    }, {
        name: 'spin',
        resourceTags: {
            copyOnly: function (filename, mid) {
                return mid === 'spin/jquery.spin';
            }
        },
        location: './spinjs',
        main: 'spin'
    }, {
        name: 'moment',
        main: 'moment',
        resourceTags: {
            amd: function (filename) {
                return /\.js$/.test(filename);
            },
            test: function (filename, mid) {
                return /\/tests/.test(mid);
            },
            miniExclude: function (filename, mid) {
                return /\/src/.test(mid) || /\/templates/.test(mid);
            }
        }
    }],
    staticHasFeatures: {
        'dojo-trace-api': 0,
        'dojo-log-api': 0,
        'dojo-publish-privates': 0,
        'dojo-sync-loader': 0,
        'dojo-xhr-factory': 0,
        'dojo-test-sniff': 0
    },
    userConfig: {
        packages: ['app', 'dojo', 'dijit', 'dojox', 'agrc', 'ijit', 'esri', 'layer-selector']
    }
};
