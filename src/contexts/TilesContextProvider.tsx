import { createContext, useState } from 'react';

export const TilesContext = createContext<{
  count: number | null;
  setCount: (count: number | null) => void;
} | null>(null);

export default function TilesContextProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState<number | null>(null);

  return <TilesContext.Provider value={{ count, setCount }}>{children}</TilesContext.Provider>;
}
