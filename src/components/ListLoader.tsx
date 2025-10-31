import { BulletList } from 'react-content-loader';
import resolveConfig from 'tailwindcss/resolveConfig';
import { useDarkMode } from 'usehooks-ts';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export default function ListLoader() {
  const { isDarkMode } = useDarkMode();

  return (
    <BulletList
      backgroundColor={isDarkMode ? fullConfig.theme.colors.zinc[800] : fullConfig.theme.colors.zinc[300]}
      foregroundColor="#FFFFFF"
    />
  );
}
