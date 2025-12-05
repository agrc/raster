import { createContext, useCallback, useState } from 'react';

export const TilesContext = createContext<{
  count: number | null;
  setCount: (count: number | null) => void;
  downloadedTiles: Set<number>;
  markAsDownloaded: (objectId: number) => void;
  clear: () => void;
} | null>(null);

export default function TilesContextProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState<number | null>(null);
  const [downloadedTiles, setDownloadedTiles] = useState<Set<number>>(new Set());

  const markAsDownloaded = useCallback((objectId: number) => {
    setDownloadedTiles((prev) => new Set(prev).add(objectId));
  }, []);

  const clear = useCallback(() => {
    setCount(null);
    setDownloadedTiles(new Set());
  }, []);

  return (
    <TilesContext.Provider value={{ count, setCount, downloadedTiles, markAsDownloaded, clear }}>
      {children}
    </TilesContext.Provider>
  );
}
