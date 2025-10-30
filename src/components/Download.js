"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Download;
var FeatureLayer_1 = require("@arcgis/core/layers/FeatureLayer");
var FeatureSet_1 = require("@arcgis/core/rest/support/FeatureSet");
var react_query_1 = require("@tanstack/react-query");
var utah_design_system_1 = require("@ugrc/utah-design-system");
var react_1 = require("react");
var react_content_loader_1 = require("react-content-loader");
var client_1 = require("react-dom/client");
var resolveConfig_1 = require("tailwindcss/resolveConfig");
var usehooks_ts_1 = require("usehooks-ts");
var tailwind_config_1 = require("../../tailwind.config");
var config_1 = require("../config");
var useMap_1 = require("../hooks/useMap");
var useTiles_1 = require("../hooks/useTiles");
var useWizardMachine_1 = require("../hooks/useWizardMachine");
var tiles_1 = require("../services/tiles");
var Tile_1 = require("./Tile");
var fullConfig = (0, resolveConfig_1.default)(tailwind_config_1.default);
function getMetadataLink(url) {
    if (url.toLocaleLowerCase().endsWith('.xml')) {
        // the heads for XML files from GCP buckets don't let the browser download them directly so we open them in a new tab
        return <utah_design_system_1.ExternalLink href={url}>Metadata</utah_design_system_1.ExternalLink>;
    }
    else {
        return (<utah_design_system_1.Link href={url} download>
        Metadata
      </utah_design_system_1.Link>);
    }
}
function PopupContent(_a) {
    var attributes = _a.attributes, description = _a.description, metadata = _a.metadata, report = _a.report;
    var PATH = attributes.PATH, TILE = attributes.TILE, EXT = attributes.EXT, SIZE = attributes.SIZE;
    return (<div className="space-y-2 p-3">
      <p>{description}</p>
      <div>
        <strong>File:</strong>{' '}
        <utah_design_system_1.Link download href={"".concat(PATH).concat(TILE).concat(EXT)}>
          Tile
        </utah_design_system_1.Link>
        {metadata ? (<>
            {' | '}
            {getMetadataLink(metadata)}
          </>) : null}
        {report ? (<>
            {' | '}
            <utah_design_system_1.Link download href={report}>
              Report
            </utah_design_system_1.Link>
          </>) : null}
      </div>
      <div>
        <strong>Size:</strong> <span>{SIZE.toLocaleString()} MB</span>
      </div>
    </div>);
}
function Download() {
    var snapshot = (0, useWizardMachine_1.default)().snapshot;
    var _a = snapshot.context.download || {}, productType = _a.productType, tileIndex = _a.tileIndex, description = _a.description, metadata = _a.metadata, report = _a.report;
    var _b = (0, useMap_1.default)(), mapView = _b.mapView, zoom = _b.zoom;
    var featureLayerRef = (0, react_1.useRef)(null);
    var isDarkMode = (0, usehooks_ts_1.useDarkMode)().isDarkMode;
    var _c = (0, react_1.useState)(null), highlightedOid = _c[0], setHighlightedOid = _c[1];
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['tiles', productType, tileIndex, snapshot.context.aoi],
        queryFn: function () { return (0, tiles_1.default)(productType, tileIndex, snapshot.context.aoi); },
        enabled: !!productType && !!tileIndex,
    }), data = _d.data, error = _d.error, isLoading = _d.isLoading;
    var setCount = (0, useTiles_1.default)().setCount;
    (0, react_1.useEffect)(function () {
        if (!productType || !tileIndex) {
            if (featureLayerRef.current && (mapView === null || mapView === void 0 ? void 0 : mapView.map)) {
                mapView.map.remove(featureLayerRef.current);
                featureLayerRef.current = null;
            }
        }
        setCount(null);
    }, [productType, tileIndex, mapView, setCount]);
    var onTileHover = (0, react_1.useCallback)(function (objectId, on) {
        if (!featureLayerRef.current || !mapView)
            return;
        if (on) {
            featureLayerRef.current.featureEffect = {
                filter: {
                    where: "".concat(config_1.default.INDEX_FIELDS.OBJECTID, " = ").concat(objectId),
                },
                excludedEffect: 'blur(1px) opacity(60%)',
                includedEffect: 'drop-shadow(2px, 2px, 3px) bloom(1.5, 0.5px, 0.1)',
            };
            setHighlightedOid(objectId);
        }
        else {
            featureLayerRef.current.featureEffect = null;
            setHighlightedOid(null);
        }
    }, [mapView]);
    (0, react_1.useEffect)(function () {
        if (!(mapView === null || mapView === void 0 ? void 0 : mapView.map) || !data)
            return;
        var featureSet = FeatureSet_1.default.fromJSON(data);
        featureLayerRef.current = new FeatureLayer_1.default({
            source: featureSet.features,
            fields: featureSet.fields,
            objectIdField: data.objectIdFieldName,
            geometryType: 'polygon',
            renderer: {
                type: 'simple',
                symbol: config_1.default.TILE_SYMBOL,
            },
            popupEnabled: true,
            popupTemplate: {
                overwriteActions: true,
                outFields: Object.values(config_1.default.INDEX_FIELDS),
                title: '{TILE}',
                content: function (_a) {
                    var graphic = _a.graphic;
                    var container = document.createElement('div');
                    var root = (0, client_1.createRoot)(container);
                    root.render(<PopupContent attributes={graphic.attributes} description={description !== null && description !== void 0 ? description : ''} metadata={metadata} report={report}/>);
                    return container;
                },
            },
        });
        mapView.map.add(featureLayerRef.current);
        featureLayerRef.current.when(function () {
            zoom(featureLayerRef.current.fullExtent);
        });
        setCount(data.features.length);
        var handle = mapView.on('pointer-move', function (event) {
            var options = {
                include: featureLayerRef.current,
            };
            mapView.hitTest(event, options).then(function (response) {
                var results = response.results;
                if (results.length > 0) {
                    // @ts-expect-error not sure why Esri's types are not recognizing graphic here
                    var feature = results[0].graphic;
                    if (feature) {
                        var objectId = feature.attributes[config_1.default.INDEX_FIELDS.OBJECTID];
                        onTileHover(objectId, true);
                    }
                }
                else {
                    onTileHover(-1, false);
                }
            });
        });
        return function () {
            handle === null || handle === void 0 ? void 0 : handle.remove();
        };
    }, [mapView, data, zoom, setCount, onTileHover, description, metadata, report]);
    return (<div className="flex-col space-y-2 text-sm">
      <p className="italic">Click on a tile on the map or in the list below to download its associated files.</p>
      {productType === 'autoDem' ? (<p>
          <strong>Please note:</strong> The auto-correlation process is not as rigorous as other methods of elevation
          modeling such as photogrammetry, lidar mapping, radar mapping, etc, and therefore end-users should be aware
          that anomalies are expected within the elevation dataset.
        </p>) : null}
      <p className="font-bold">{description}</p>
      {metadata || report ? (<div className="flex justify-between">
          {metadata && getMetadataLink(metadata)}
          {report && (<utah_design_system_1.Link href={report} download>
              Report
            </utah_design_system_1.Link>)}
        </div>) : null}
      {isLoading ? (<react_content_loader_1.BulletList backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]} foregroundColor="#FFFFFF"/>) : error || !data ? (<utah_design_system_1.Banner>Error loading tiles</utah_design_system_1.Banner>) : (<div>
          {data.features.map(function (feature) { return (<Tile_1.default attributes={feature.attributes} isHighlighted={feature.attributes[config_1.default.INDEX_FIELDS.OBJECTID] === highlightedOid} key={feature.attributes[config_1.default.INDEX_FIELDS.OBJECTID]} onHover={onTileHover}/>); })}
        </div>)}
    </div>);
}
