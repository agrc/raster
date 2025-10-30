import { Link } from '@ugrc/utah-design-system';
import { useEffect, useRef } from 'react';
import { twJoin } from 'tailwind-merge';
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
          'flex justify-between rounded p-1 no-underline',
          isHighlighted && 'bg-zinc-50 font-bold dark:bg-zinc-800',
        )}
        href={`${PATH}${filename}`}
        onMouseEnter={() => onHover(OBJECTID, true)}
        onMouseLeave={() => onHover(OBJECTID, false)}
      >
        <span>{filename}</span>
        <span>{SIZE} MB</span>
      </Link>
    </div>
  );
}
