import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import { useQuery } from '@tanstack/react-query';
import { Banner, Link } from '@ugrc/utah-design-system';
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

function PopupContent({ attributes }: { attributes: TileFeature['attributes'] }) {
  const { PATH, TILE, EXT, SIZE } = attributes;

  return (
    <div className="space-y-2 p-3 text-lg">
      <div>
        <strong>{TILE}</strong>
      </div>
      <div>
        <strong>File:</strong> <Link href={`${PATH}${TILE}${EXT}`}>Tile</Link>
      </div>
      <div>
        <strong>Size:</strong> <span>{SIZE.toLocaleString()} MB</span>
      </div>
    </div>
  );
}

export default function Download() {
  const { snapshot } = useWizardMachine();
  const [productType, tileIndex] = snapshot.context.download || [];
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
        title: 'Tile Details',
        content: ({ graphic }: { graphic: TileFeature }) => {
          const container = document.createElement('div');
          const root = createRoot(container);
          root.render(<PopupContent attributes={graphic.attributes} />);
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
  }, [mapView, data, zoom, setCount, onTileHover]);

  return (
    <div className="text-sm">
      <p>Click on a tile below to download.</p>
      {isLoading ? (
        <BulletList
          backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]}
          foregroundColor="#FFFFFF"
        />
      ) : error || !data ? (
        <Banner>Error loading tiles</Banner>
      ) : (
        data.features.map((feature) => (
          <Tile
            attributes={feature.attributes}
            isHighlighted={feature.attributes[config.INDEX_FIELDS.OBJECTID] === highlightedOid}
            key={feature.attributes[config.INDEX_FIELDS.OBJECTID]}
            onHover={onTileHover}
          />
        ))
      )}
    </div>
  );
}
