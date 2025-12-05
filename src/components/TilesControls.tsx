import useTiles from '../hooks/useTiles';

export default function TilesControls() {
  const { count } = useTiles();

  if (!count) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-md bg-primary-300/75 px-2 py-1 text-zinc-800">
      {count.toLocaleString()} Tiles Found
    </div>
  );
}
