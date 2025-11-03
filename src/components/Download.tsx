import { whenOnce } from '@arcgis/core/core/reactiveUtils';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import { useQuery } from '@tanstack/react-query';
import { Banner, ExternalLink, Link, useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import config from '../config';
import useMap from '../hooks/useMap';
import useTiles from '../hooks/useTiles';
import useWizardMachine from '../hooks/useWizardMachine';
import getTiles from '../services/tiles';
import type { TileFeature } from '../types';
import ListLoader from './ListLoader';
import Tile from './Tile';
const NO = 'no';
const YES = 'yes';
const DOWNLOADED = 'downloaded';

function getMetadataLink(url: string, logEvent: ReturnType<typeof useFirebaseAnalytics>, source: 'popup' | 'sidebar') {
  if (url.toLowerCase().endsWith('.xml')) {
    // the heads for XML files from GCP buckets don't let the browser download them directly so we open them in a new tab
    return (
      <ExternalLink
        href={url}
        onClick={() => {
          logEvent('tile_metadata_download', { source });
        }}
      >
        Metadata
      </ExternalLink>
    );
  } else {
    return (
      <Link
        href={url}
        download
        onClick={() => {
          logEvent('tile_metadata_download', { source });
        }}
      >
        Metadata
      </Link>
    );
  }
}

type PopupContentProps = {
  attributes: TileFeature['attributes'];
  description: string;
  metadata?: string;
  report?: string;
  // we have to pass these as props since this component is rendered outside of React tree and thus doesn't have access to contexts
  logEvent: ReturnType<typeof useFirebaseAnalytics>;
  markAsDownloaded: (objectId: number) => void;
};
function PopupContent({ attributes, description, metadata, report, logEvent, markAsDownloaded }: PopupContentProps) {
  const { PATH, TILE, EXT, SIZE, OBJECTID } = attributes;

  return (
    <div className="space-y-2 p-3">
      <p>{description}</p>
      <div>
        <strong>File:</strong>{' '}
        <Link
          download
          href={`${PATH}${TILE}${EXT}`}
          onClick={() => {
            markAsDownloaded(OBJECTID);
            logEvent('tile_download_click', {
              url: `${PATH}${TILE}${EXT}`,
              tileName: `${TILE}${EXT}`,
              source: 'popup',
            });
          }}
        >
          Tile
        </Link>
        {metadata ? (
          <>
            {' | '}
            {getMetadataLink(metadata, logEvent, 'popup')}
          </>
        ) : null}
        {report ? (
          <>
            {' | '}
            <Link
              download
              href={report}
              onClick={() => {
                logEvent('tile_report_download', { source: 'popup' });
              }}
            >
              Report
            </Link>
          </>
        ) : null}
      </div>
      <div>
        <strong>Size:</strong> <span>{SIZE.toLocaleString()} MB</span>
      </div>
    </div>
  );
}

export default function Download() {
  const { snapshot } = useWizardMachine();
  const { productType, tileIndex, description, metadata, report } = snapshot.context.download || {};
  const { mapView, zoom } = useMap();
  const featureLayerRef = useRef<__esri.FeatureLayer | null>(null);
  const [highlightedOid, setHighlightedOid] = useState<number | null>(null);
  const logEvent = useFirebaseAnalytics();
  const { data, error, isLoading } = useQuery({
    queryKey: ['tiles', productType, tileIndex, snapshot.context.aoi],
    queryFn: () => getTiles(productType!, tileIndex!, snapshot.context.aoi!),
    enabled: !!productType && !!tileIndex,
  });

  const { setCount, clear, downloadedTiles, markAsDownloaded } = useTiles();

  // remove feature layer and clear tiles when productType or tileIndex is unset
  useEffect(() => {
    if (!productType || !tileIndex) {
      if (featureLayerRef.current && mapView?.map) {
        mapView.map.remove(featureLayerRef.current);
        featureLayerRef.current = null;
        clear();
      }
    }
  }, [productType, tileIndex, mapView, clear]);

  const onTileHover = useCallback(
    (objectId: number, on: boolean) => {
      if (!featureLayerRef.current || !mapView) return;

      if (on) {
        featureLayerRef.current.featureEffect = {
          filter: {
            where: `${config.INDEX_FIELDS.OBJECTID} = ${objectId}`,
          },
          excludedEffect: 'blur(1px) opacity(60%)',
          includedEffect: 'drop-shadow(2px, 2px, 3px)',
        };
        setHighlightedOid(objectId);
      } else {
        featureLayerRef.current.featureEffect = null;
        setHighlightedOid(null);
      }
    },
    [mapView],
  );

  // Update feature layer when tiles are downloaded
  useEffect(() => {
    if (!featureLayerRef.current || !mapView || downloadedTiles.size === 0) return;

    const layer = featureLayerRef.current;

    // Query only the downloaded features for efficiency
    const objectIds = Array.from(downloadedTiles).join(',');
    if (!objectIds) return;
    layer
      .queryFeatures({
        where: `${config.INDEX_FIELDS.OBJECTID} IN (${objectIds})`,
        outFields: ['*'],
        returnGeometry: false,
      })
      .then((result) => {
        const edits = result.features.map((feature) => {
          feature.attributes[DOWNLOADED] = YES;
          return feature;
        });

        if (edits.length > 0) {
          return layer.applyEdits({
            updateFeatures: edits,
          });
        }
      })
      .catch((error) => {
        console.error('Failed to update downloaded tile visualization:', error);
      });
  }, [downloadedTiles, mapView]);

  // add feature layer
  useEffect(() => {
    if (!mapView?.map || !data || featureLayerRef.current) return;

    const downloadedField: __esri.FieldProperties = {
      name: DOWNLOADED,
      type: 'string',
      defaultValue: NO,
    };

    const featureSet = FeatureSet.fromJSON(data) as FeatureSet;

    featureLayerRef.current = new FeatureLayer({
      source: featureSet.features,
      fields: [...featureSet.fields, downloadedField],
      objectIdField: data.objectIdFieldName,
      geometryType: 'polygon',
      renderer: {
        type: 'unique-value',
        field: DOWNLOADED,
        uniqueValueInfos: [
          {
            value: NO,
            symbol: config.TILE_SYMBOL,
          },
          {
            value: YES,
            symbol: config.DOWNLOADED_TILE_SYMBOL,
          },
        ],
      },
      popupEnabled: true,
      popupTemplate: {
        overwriteActions: true,
        outFields: Object.values(config.INDEX_FIELDS),
        title: '{TILE}',
        content: ({ graphic }: { graphic: TileFeature }) => {
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(
            <PopupContent
              attributes={graphic.attributes}
              description={description ?? ''}
              metadata={metadata}
              report={report}
              logEvent={logEvent}
              markAsDownloaded={markAsDownloaded}
            />,
          );
          return container;
        },
      },
    });

    mapView.map.add(featureLayerRef.current);
    whenOnce(() => featureLayerRef.current?.fullExtent).then(() => {
      zoom(featureLayerRef.current!.fullExtent);
    });

    setCount(data.features.length);

    const handle = mapView.on('pointer-move', (event) => {
      const options = {
        include: featureLayerRef.current!,
      };
      mapView.hitTest(event, options).then((response) => {
        const results = response.results;
        if (results.length > 0) {
          // @ts-expect-error not sure why Esri's types are not recognizing graphic here
          const feature = results[0]!.graphic;
          if (feature) {
            const objectId = feature.attributes[config.INDEX_FIELDS.OBJECTID];
            onTileHover(objectId, true);
          }
        } else {
          onTileHover(-1, false);
        }
      });
    });

    return () => {
      handle?.remove();
    };
  }, [
    mapView,
    data,
    zoom,
    setCount,
    onTileHover,
    description,
    metadata,
    report,
    productType,
    logEvent,
    markAsDownloaded,
  ]);

  return (
    <div className="flex-col space-y-2 text-sm">
      <p className="italic">Click on a tile on the map or in the list below to download its associated files.</p>
      {productType === 'autoDem' ? (
        <p>
          <strong>Please note:</strong> The auto-correlation process is not as rigorous as other methods of elevation
          modeling such as photogrammetry, lidar mapping, radar mapping, etc, and therefore end-users should be aware
          that anomalies are expected within the elevation dataset.
        </p>
      ) : null}
      <p className="font-bold">{description}</p>
      {metadata || report ? (
        <div className="flex justify-between">
          {metadata && getMetadataLink(metadata, logEvent, 'sidebar')}
          {report && (
            <Link
              href={report}
              download
              onClick={() => {
                logEvent('tile_report_download', { source: 'sidebar' });
              }}
            >
              Report
            </Link>
          )}
        </div>
      ) : null}
      {isLoading ? (
        <ListLoader />
      ) : error || !data ? (
        <Banner>Error loading tiles</Banner>
      ) : (
        <div>
          {data.features.map((feature) => (
            <Tile
              attributes={feature.attributes}
              isHighlighted={feature.attributes[config.INDEX_FIELDS.OBJECTID] === highlightedOid}
              key={feature.attributes[config.INDEX_FIELDS.OBJECTID]}
              onHover={onTileHover}
            />
          ))}
        </div>
      )}
    </div>
  );
}
