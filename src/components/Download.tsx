import { whenOnce } from '@arcgis/core/core/reactiveUtils';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import { useQuery } from '@tanstack/react-query';
import { Banner, Button, ExternalLink, Link, Radio, RadioGroup, useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { Check, Copy } from 'lucide-react';
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
import { generateCommands, type DownloadTool } from './utils';
const NO = 'no';
const YES = 'yes';
const DOWNLOADED = 'downloaded';

function getSidebarMetadataLink(url: string, logEvent: ReturnType<typeof useFirebaseAnalytics>) {
  if (url.toLowerCase().endsWith('.xml')) {
    // the heads for XML files from GCP buckets don't let the browser download them directly so we open them in a new tab
    return (
      <ExternalLink
        href={url}
        onPress={() => {
          logEvent('tile_metadata_download', { source: 'sidebar' });
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
        onPress={() => {
          logEvent('tile_metadata_download', { source: 'sidebar' });
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

// PopupContent is rendered into a detached DOM container via createRoot for the ArcGIS popup.
// We use native anchor elements here instead of React Aria's Link/ExternalLink components because
// React Aria uses pointer events internally, which get intercepted by the ArcGIS popup container,
// preventing onClick/onPress handlers from firing. Native onClick handlers work correctly.
// We rely on Esri's default link styling since the popup renders inside a shadow DOM where
// Tailwind classes from the main stylesheet are not available.
function PopupMetadataLink({ url, logEvent }: { url: string; logEvent: ReturnType<typeof useFirebaseAnalytics> }) {
  if (url.toLowerCase().endsWith('.xml')) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          logEvent('tile_metadata_download', { source: 'popup' });
        }}
      >
        Metadata
      </a>
    );
  } else {
    return (
      <a
        href={url}
        download
        onClick={() => {
          logEvent('tile_metadata_download', { source: 'popup' });
        }}
      >
        Metadata
      </a>
    );
  }
}

function PopupContent({ attributes, description, metadata, report, logEvent, markAsDownloaded }: PopupContentProps) {
  const { PATH, TILE, EXT, SIZE, OBJECTID } = attributes;

  return (
    <div>
      <p>{description}</p>
      <div>
        <strong>File:</strong>{' '}
        <a
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
        </a>
        {metadata ? (
          <>
            {' | '}
            <PopupMetadataLink url={metadata} logEvent={logEvent} />
          </>
        ) : null}
        {report ? (
          <>
            {' | '}
            <a
              download
              href={report}
              onClick={() => {
                logEvent('tile_report_download', { source: 'popup' });
              }}
            >
              Report
            </a>
          </>
        ) : null}
      </div>
      <div>
        <strong>Size:</strong> <span>{SIZE.toLocaleString()} MB</span>
      </div>
    </div>
  );
}

const popupContainer = document.createElement('div');
const popupRoot = createRoot(popupContainer);

type DownloadProps = {
  getTilesService?: typeof getTiles;
};

export default function Download({ getTilesService = getTiles }: DownloadProps) {
  const { snapshot } = useWizardMachine();
  const { productType, tileIndex, description, metadata, report } = snapshot.context.download || {};
  const { mapView, zoom } = useMap();
  const featureLayerRef = useRef<__esri.FeatureLayer | null>(null);
  const [highlightedOid, setHighlightedOid] = useState<number | null>(null);
  const logEvent = useFirebaseAnalytics();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['tiles', productType, tileIndex, snapshot.context.aoi],
    queryFn: () => getTilesService(productType!, tileIndex!, snapshot.context.aoi!),
    enabled: !!productType && !!tileIndex,
  });
  const layerId = `tiles-${productType}-${tileIndex}`;

  const { setCount, clear, downloadedTiles, markAsDownloaded } = useTiles();
  const [selectedTool, setSelectedTool] = useState<DownloadTool>('curl');
  const [copied, setCopied] = useState(false);

  // remove feature layer and clear tiles when productType or tileIndex is changed or unset
  useEffect(() => {
    if (!productType || !tileIndex || featureLayerRef.current?.id !== layerId) {
      if (featureLayerRef.current && mapView?.map) {
        mapView.map.remove(featureLayerRef.current);
        featureLayerRef.current = null;
        clear();
      }
    }
  }, [productType, tileIndex, mapView, clear, layerId]);

  const onTileHover = useCallback((objectId: number, on: boolean) => {
    if (on) {
      if (featureLayerRef.current) {
        featureLayerRef.current.featureEffect = {
          filter: {
            where: `${config.INDEX_FIELDS.OBJECTID} = ${objectId}`,
          },
          excludedEffect: 'blur(1px) opacity(60%)',
          includedEffect: 'drop-shadow(2px, 2px, 3px)',
        };
      }
      setHighlightedOid(objectId);
    } else {
      if (featureLayerRef.current) {
        featureLayerRef.current.featureEffect = null;
      }
      setHighlightedOid(null);
    }
  }, []);

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
    if (!mapView?.map || !data || featureLayerRef.current?.id === layerId) return;

    const downloadedField: __esri.FieldProperties = {
      name: DOWNLOADED,
      type: 'string',
      defaultValue: NO,
    };

    const featureSet = FeatureSet.fromJSON(data) as FeatureSet;

    featureLayerRef.current = new FeatureLayer({
      id: layerId,
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
          popupRoot.render(
            <PopupContent
              attributes={graphic.attributes}
              description={description ?? ''}
              metadata={metadata}
              report={report}
              logEvent={logEvent}
              markAsDownloaded={markAsDownloaded}
            />,
          );
          return popupContainer;
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
    tileIndex,
    clear,
    layerId,
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
          {metadata && getSidebarMetadataLink(metadata, logEvent)}
          {report && (
            <Link
              href={report}
              download
              onPress={() => {
                logEvent('tile_report_download', { source: 'sidebar' });
              }}
            >
              Report
            </Link>
          )}
        </div>
      ) : null}
      {data && data.features.length > 0 ? (
        <div className="space-y-2 rounded border border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-600 dark:bg-zinc-800">
          <RadioGroup
            label="Bulk download snippet"
            value={selectedTool}
            onChange={(value) => setSelectedTool(value as DownloadTool)}
            orientation="horizontal"
          >
            <Radio value="curl">curl</Radio>
            <Radio value="wget">wget</Radio>
            <Radio value="aria2c">aria2c</Radio>
          </RadioGroup>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Tip: On Windows PowerShell, curl works best. Wget requires GNU wget.exe.
          </p>
          <Button
            variant="secondary"
            size="extraSmall"
            className="w-full"
            onPress={async () => {
              const command = generateCommands(selectedTool, data.features);
              try {
                if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
                  throw new Error('Clipboard API is not available');
                }
                await navigator.clipboard.writeText(command);
                setCopied(true);
                logEvent('copy_tile_commands', { tool: selectedTool, count: data.features.length });
                setTimeout(() => setCopied(false), 2000);
              } catch (error) {
                // Clipboard write failed; do not show "Copied!" to the user.
                console.error('Failed to copy download command to clipboard:', error);
              }
            }}
          >
            {copied ? (
              <>
                <Check size={14} className="mr-1" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} className="mr-1" />
                Copy command to download {data.features.length.toLocaleString()}{' '}
                {data.features.length === 1 ? 'tile' : 'tiles'}
              </>
            )}
          </Button>
        </div>
      ) : null}
      {isLoading ? (
        <ListLoader />
      ) : error || !data ? (
        <Banner>
          <div className="flex flex-col gap-1">
            {error instanceof Error && error.name === 'MaxTilesExceededError' ? (
              <>
                The number of tiles for this area exceeds the maximum allowed ({config.MAX_DOWNLOAD_TILES}). Please
                narrow your area of interest and try again.
              </>
            ) : (
              <>
                Failed to load tile information
                <Button className="self-end" variant="destructive" size="extraSmall" onClick={() => refetch()}>
                  Retry
                </Button>
              </>
            )}
          </div>
        </Banner>
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
