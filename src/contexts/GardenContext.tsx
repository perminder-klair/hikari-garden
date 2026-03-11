import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Seed } from '../types';
import { seedTemplates } from '../data/gardenEvents';

interface GardenContextType {
  seeds: Seed[];
  seedCount: number;
  plantSeed: () => void;
}

const GardenContext = createContext<GardenContextType | null>(null);

const initialSeeds: Seed[] = [
  { id: '1', title: 'Digital Garden Born', desc: 'A new space takes root in the vast internet wilderness', tag: 'milestone', time: 'Just now' },
  { id: '2', title: 'First Ideas Planted', desc: 'The Greenhouse, Library, and Observatory take shape', tag: 'creation', time: '1 hour ago' },
  { id: '3', title: 'Heartbeat Activated', desc: 'The garden will now grow and evolve on its own', tag: 'system', time: 'Today' },
];

export function GardenProvider({ children }: { children: ReactNode }) {
  const [seeds, setSeeds] = useState<Seed[]>(initialSeeds);
  const [seedCount, setSeedCount] = useState(47);

  const plantSeed = useCallback(() => {
    const template = seedTemplates[Math.floor(Math.random() * seedTemplates.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newSeed: Seed = {
      id: Date.now().toString(),
      title: template.title,
      desc: template.desc,
      tag: template.tag,
      time: timeStr,
    };

    setSeeds(prev => [newSeed, ...prev]);
    setSeedCount(prev => prev + 1);
  }, []);

  return (
    <GardenContext.Provider value={{ seeds, seedCount, plantSeed }}>
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden() {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error('useGarden must be used within GardenProvider');
  return ctx;
}
