import { createContext, useState } from 'react';

export const TilesContext = createContext<{
  count: number | null;
  setCount: (count: number | null) => void;
  downloadedTiles: Set<number>;
  markAsDownloaded: (objectId: number) => void;
  clearDownloaded: () => void;
} | null>(null);

export default function TilesContextProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState<number | null>(null);
  const [downloadedTiles, setDownloadedTiles] = useState<Set<number>>(new Set());

  const markAsDownloaded = (objectId: number) => {
    setDownloadedTiles((prev) => new Set(prev).add(objectId));
  };

  const clearDownloaded = () => {
    setDownloadedTiles(new Set());
  };

  return (
    <TilesContext.Provider value={{ count, setCount, downloadedTiles, markAsDownloaded, clearDownloaded }}>
      {children}
    </TilesContext.Provider>
  );
}
