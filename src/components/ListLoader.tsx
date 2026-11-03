import { BulletList } from 'react-content-loader';
import { useDarkMode } from 'usehooks-ts';

export default function ListLoader() {
  const { isDarkMode } = useDarkMode();

  return (
    <BulletList
      backgroundColor={isDarkMode ? 'var(--color-zinc-800)' : 'var(--color-zinc-300)'}
      foregroundColor="#FFFFFF"
    />
  );
}
