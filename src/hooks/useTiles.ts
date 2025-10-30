import { useContext } from 'react';
import { TilesContext } from '../contexts/TilesContextProvider';

export default function useTiles() {
  const context = useContext(TilesContext);

  if (!context) {
    throw new Error('useTiles must be used within a TilesContextProvider');
  }

  return context;
}
