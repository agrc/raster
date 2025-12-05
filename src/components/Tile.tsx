import { Link, useFirebaseAnalytics } from '@ugrc/utah-design-system';
import { Check } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { twJoin } from 'tailwind-merge';
import useTiles from '../hooks/useTiles';
import type { TileFeature } from '../types';

export type TileProps = {
  attributes: TileFeature['attributes'];
  onHover: (objectId: number, on: boolean) => void;
  isHighlighted?: boolean;
};

export default function Tile({ attributes, onHover, isHighlighted }: TileProps) {
  const { OBJECTID, TILE, SIZE, EXT, PATH } = attributes;
  const filename = `${TILE}${EXT}`;

  const rootNodeRef = useRef<HTMLDivElement>(null);
  const logEvent = useFirebaseAnalytics();
  const { markAsDownloaded, downloadedTiles } = useTiles();

  useEffect(() => {
    if (isHighlighted) {
      rootNodeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isHighlighted]);

  return (
    <div ref={rootNodeRef}>
      <Link
        download
        className={twJoin(
          'flex items-center justify-between rounded p-1 no-underline',
          isHighlighted && 'bg-zinc-50 font-bold dark:bg-zinc-800',
        )}
        href={`${PATH}${filename}`}
        onPress={() => {
          markAsDownloaded(OBJECTID);
          logEvent('tile_download_click', { url: `${PATH}${filename}`, tileName: filename, source: 'sidebar' });
        }}
        onMouseEnter={() => onHover(OBJECTID, true)}
        onMouseLeave={() => onHover(OBJECTID, false)}
      >
        <span>{filename}</span>
        {downloadedTiles.has(OBJECTID) && (
          <Check className="h-4 w-4 text-green-600 dark:text-green-400" aria-label="Downloaded" />
        )}
        <span>{SIZE} MB</span>
      </Link>
    </div>
  );
}
