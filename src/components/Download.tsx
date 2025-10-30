import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import { useQuery } from '@tanstack/react-query';
import { Banner, ExternalLink, Link } from '@ugrc/utah-design-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BulletList } from 'react-content-loader';
import { createRoot } from 'react-dom/client';
import resolveConfig from 'tailwindcss/resolveConfig';
import { useDarkMode } from 'usehooks-ts';
import tailwindConfig from '../../tailwind.config';
import config from '../config';
import useMap from '../hooks/useMap';
import useTiles from '../hooks/useTiles';
import useWizardMachine from '../hooks/useWizardMachine';
import getTiles from '../services/tiles';
import type { TileFeature } from '../types';
import Tile from './Tile';

const fullConfig = resolveConfig(tailwindConfig);

function getMetadataLink(url: string) {
  if (url.toLocaleLowerCase().endsWith('.xml')) {
    // the heads for XML files from GCP buckets don't let the browser download them directly so we open them in a new tab
    return <ExternalLink href={url}>Metadata</ExternalLink>;
  } else {
    return (
      <Link href={url} download>
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
};
function PopupContent({ attributes, description, metadata, report }: PopupContentProps) {
  const { PATH, TILE, EXT, SIZE } = attributes;

  return (
    <div className="space-y-2 p-3">
      <p>{description}</p>
      <div>
        <strong>File:</strong>{' '}
        <Link download href={`${PATH}${TILE}${EXT}`}>
          Tile
        </Link>
        {metadata ? (
          <>
            {' | '}
            {getMetadataLink(metadata)}
          </>
        ) : null}
        {report ? (
          <>
            {' | '}
            <Link download href={report}>
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
  const { isDarkMode } = useDarkMode();
  const [highlightedOid, setHighlightedOid] = useState<number | null>(null);
  const { data, error, isLoading } = useQuery({
    queryKey: ['tiles', productType, tileIndex, snapshot.context.aoi],
    queryFn: () => getTiles(productType!, tileIndex!, snapshot.context.aoi!),
    enabled: !!productType && !!tileIndex,
  });

  const { setCount } = useTiles();

  useEffect(() => {
    if (!productType || !tileIndex) {
      if (featureLayerRef.current && mapView?.map) {
        mapView.map.remove(featureLayerRef.current);
        featureLayerRef.current = null;
      }
    }

    setCount(null);
  }, [productType, tileIndex, mapView, setCount]);

  const onTileHover = useCallback(
    (objectId: number, on: boolean) => {
      if (!featureLayerRef.current || !mapView) return;

      if (on) {
        featureLayerRef.current.featureEffect = {
          filter: {
            where: `${config.INDEX_FIELDS.OBJECTID} = ${objectId}`,
          },
          excludedEffect: 'blur(1px) opacity(60%)',
          includedEffect: 'drop-shadow(2px, 2px, 3px) bloom(1.5, 0.5px, 0.1)',
        };
        setHighlightedOid(objectId);
      } else {
        featureLayerRef.current.featureEffect = null;
        setHighlightedOid(null);
      }
    },
    [mapView],
  );

  useEffect(() => {
    if (!mapView?.map || !data) return;

    const featureSet = FeatureSet.fromJSON(data) as FeatureSet;

    featureLayerRef.current = new FeatureLayer({
      source: featureSet.features,
      fields: featureSet.fields,
      objectIdField: data.objectIdFieldName,
      geometryType: 'polygon',
      renderer: {
        type: 'simple',
        symbol: config.TILE_SYMBOL,
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
            />,
          );
          return container;
        },
      },
    });

    mapView.map.add(featureLayerRef.current);
    featureLayerRef.current.when(() => {
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
  }, [mapView, data, zoom, setCount, onTileHover, description, metadata, report]);

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
          {metadata && getMetadataLink(metadata)}
          {report && (
            <Link href={report} download>
              Report
            </Link>
          )}
        </div>
      ) : null}
      {isLoading ? (
        <BulletList
          backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]}
          foregroundColor="#FFFFFF"
        />
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
