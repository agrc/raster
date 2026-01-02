import useTiles from '../hooks/useTiles';

export default function TilesControls() {
  const { count } = useTiles();

  if (!count) {
    return null;
  }

  return (
    <div className="mx-auto w-fit rounded-md bg-primary-300/75 px-2 py-1 text-zinc-800">
      <b>{count.toLocaleString()}</b> tiles found
    </div>
  );
}
