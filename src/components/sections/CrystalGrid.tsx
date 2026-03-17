import { useState, useCallback, useMemo } from 'react';
import { Sparkles, RefreshCw, Shuffle } from 'lucide-react';
import { crystals, crystalIntentions } from '../../data/crystals';
import type { Crystal } from '../../types';
import styles from './CrystalGrid.module.css';

const crystalEmojis: Record<string, string> = {
  'Clear Quartz': '💎',
  'Amethyst': '🔮',
  'Rose Quartz': '🌸',
  'Citrine': '☀️',
  'Black Obsidian': '🌑',
  'Moonstone': '🌙',
  'Labradorite': '🌌',
  'Carnelian': '🔥',
  'Lapis Lazuli': '🌊',
};

export default function CrystalGrid() {
  const [crystalStates, setCrystalStates] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      crystals.forEach(c => {
        initial[c.id] = c.activated;
      });
      return initial;
    }
  );
  const [currentIntention, setCurrentIntention] = useState('');
  const [isShuffling, setIsShuffling] = useState(false);

  const activatedCount = useMemo(() => 
    Object.values(crystalStates).filter(Boolean).length,
    [crystalStates]
  );

  const energyLevel = useMemo(() => 
    Math.round((activatedCount / crystals.length) * 100),
    [activatedCount]
  );

  const toggleCrystal = useCallback((id: string) => {
    setCrystalStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const generateIntention = useCallback(() => {
    const random = crystalIntentions[Math.floor(Math.random() * crystalIntentions.length)];
    setCurrentIntention(random);
  }, []);

  const shuffleCrystals = useCallback(() => {
    setIsShuffling(true);
    
    // Randomly activate/deactivate crystals
    setTimeout(() => {
      const newStates: Record<string, boolean> = {};
      crystals.forEach(c => {
        newStates[c.id] = Math.random() > 0.5;
      });
      setCrystalStates(newStates);
      setIsShuffling(false);
    }, 500);
  }, []);

  const resetGrid = useCallback(() => {
    const newStates: Record<string, boolean> = {};
    crystals.forEach(c => {
      newStates[c.id] = false;
    });
    setCrystalStates(newStates);
    setCurrentIntention('');
  }, []);

  return (
    <section className={styles.crystalGrid}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Sparkles className={styles.icon} size={28} />
          Crystal Grid
          <Sparkles className={styles.icon} size={28} />
        </h2>
        <p className={styles.subtitle}>
          Activate crystals to set intentions and manifest your desires. Each stone holds unique energy.
        </p>
      </header>

      <div className={`${styles.gridContainer} ${isShuffling ? styles.shuffling : ''}`}>
        {crystals.map((crystal) => (
          <div
            key={crystal.id}
            className={`${styles.crystal} ${crystalStates[crystal.id] ? styles.activated : ''}`}
            style={{ backgroundColor: crystal.color }}
            onClick={() => toggleCrystal(crystal.id)}
          >
            <div 
              className={styles.crystalGlow}
              style={{ backgroundColor: crystal.color }}
            />
            <span className={styles.crystalIcon}>{crystalEmojis[crystal.name] || '💎'}</span>
            <span className={styles.crystalName}>{crystal.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.intentionPanel}>
        <div className={styles.intentionHeader}>
          <h3 className={styles.intentionTitle}>Your Intention</h3>
          <span className={styles.activatedCount}>
            {activatedCount} / {crystals.length} activated
          </span>
        </div>

        <p className={`${styles.intentionText} ${!currentIntention ? styles.empty : ''}`}>
          {currentIntention || 'Click on crystals to activate their energy, then generate an intention...'}
        </p>

        <div className={styles.actionButtons}>
          <button 
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={generateIntention}
            disabled={activatedCount === 0}
          >
            <Sparkles size={16} />
            Generate Intention
          </button>
          <button className={styles.actionButton} onClick={shuffleCrystals}>
            <Shuffle size={16} />
            Shuffle
          </button>
          <button className={styles.actionButton} onClick={resetGrid}>
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        <div className={styles.energyBar}>
          <div className={styles.energyLabel}>
            <span>Grid Energy</span>
            <span className={styles.energyValue}>{energyLevel}%</span>
          </div>
          <div className={styles.energyTrack}>
            <div 
              className={styles.energyFill}
              style={{ width: `${energyLevel}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
